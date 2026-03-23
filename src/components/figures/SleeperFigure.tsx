import { useDrag } from '@use-gesture/react';
import { useMemo, useRef } from 'react';
import { clamp, normalizeAngle, radToDeg, rotateVector } from '../../lib/geometry';
import { getSpeciesProfile } from '../../simulation/presets/resolveSleeperPreset';
import type { Point, Sleeper, WorldSegment } from '../../types';
import type { RefObject } from 'react';
import { renderCatSVG } from './renderCatSVG';
import { renderDogSVG } from './renderDogSVG';
import { renderHumanSVG } from './renderHumanSVG';

interface JointHandleProps {
  svgRef: RefObject<SVGSVGElement | null>;
  pivot: Point;
  target: Point;
  definition: {
    id: string;
    baseAngle: number;
    jointLimits: [number, number];
  };
  referenceAngle: number;
  onSegmentAngle: (segmentId: string, angle: number) => void;
}

const clientToSvg = (svg: SVGSVGElement, clientX: number, clientY: number) => {
  const point = svg.createSVGPoint();
  point.x = clientX;
  point.y = clientY;
  return point.matrixTransform(svg.getScreenCTM()?.inverse());
};

const JointHandle = ({
  svgRef,
  pivot,
  target,
  definition,
  referenceAngle,
  onSegmentAngle,
}: JointHandleProps) => {
  const bindJoint = useDrag(({ xy: [clientX, clientY], event }) => {
    event.stopPropagation();
    const svg = svgRef.current;
    if (!svg) return;
    const point = clientToSvg(svg, clientX, clientY);
    const worldAngle = radToDeg(Math.atan2(point.y - pivot.y, point.x - pivot.x));
    const nextAngle = normalizeAngle(worldAngle - referenceAngle - definition.baseAngle);
    onSegmentAngle(definition.id, clamp(nextAngle, definition.jointLimits[0], definition.jointLimits[1]));
  });

  return (
    <g>
      <line
        x1={pivot.x}
        y1={pivot.y}
        x2={target.x}
        y2={target.y}
        stroke="rgba(255, 243, 218, 0.38)"
        strokeDasharray="1.1 1.1"
        strokeWidth={0.22}
      />
      <circle
        {...bindJoint()}
        cx={target.x}
        cy={target.y}
        r={1.28}
        fill="#f6c990"
        stroke="#6d4120"
        strokeWidth={0.22}
      />
    </g>
  );
};

interface SleeperFigureProps {
  sleeper: Sleeper;
  segments: WorldSegment[];
  svgRef: RefObject<SVGSVGElement | null>;
  bedWidthIn: number;
  bedLengthIn: number;
  selected: boolean;
  onSelect: () => void;
  onMove: (point: Point) => void;
  onRotate: (angleDeg: number) => void;
  onSegmentAngle: (segmentId: string, angle: number) => void;
}

export const SleeperFigure = ({
  sleeper,
  segments,
  svgRef,
  bedWidthIn,
  bedLengthIn,
  selected,
  onSelect,
  onMove,
  onRotate,
  onSegmentAngle,
}: SleeperFigureProps) => {
  const dragOrigin = useRef<Point>(sleeper.root);
  const species = getSpeciesProfile(sleeper.type);
  const segmentDefinitions = useMemo(
    () => Object.fromEntries(species.rig.segments.map((segment) => [segment.id, segment])),
    [species.rig.segments],
  );
  const segmentMap = useMemo(
    () => Object.fromEntries(segments.map((segment) => [segment.segmentId, segment])),
    [segments],
  );

  const centroid = useMemo(() => {
    const total = segments.reduce(
      (accumulator, segment) => ({
        x: accumulator.x + segment.cx,
        y: accumulator.y + segment.cy,
      }),
      { x: 0, y: 0 },
    );
    return {
      x: total.x / (segments.length || 1),
      y: total.y / (segments.length || 1),
    };
  }, [segments]);

  const labelPoint = useMemo(() => {
    const head = segmentMap.head;
    if (head) {
      return {
        x: head.cx,
        y: head.cy - head.width * 0.95,
      };
    }

    return {
      x: centroid.x,
      y: centroid.y - 7.5,
    };
  }, [centroid.x, centroid.y, segmentMap]);

  const rotationHandle = useMemo(() => {
    const offset = rotateVector({ x: 0, y: -11 }, sleeper.rotationDeg);
    return {
      x: centroid.x + offset.x,
      y: centroid.y + offset.y,
    };
  }, [centroid.x, centroid.y, sleeper.rotationDeg]);

  const bindDrag = useDrag(({ first, movement: [mx, my], event }) => {
    event.stopPropagation();
    onSelect();
    if (first) {
      dragOrigin.current = sleeper.root;
    }
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    onMove({
      x: clamp(dragOrigin.current.x + (mx / rect.width) * bedWidthIn, 2.5, bedWidthIn - 2.5),
      y: clamp(dragOrigin.current.y + (my / rect.height) * bedLengthIn, 2.5, bedLengthIn - 2.5),
    });
  });

  const bindRotate = useDrag(({ xy: [clientX, clientY], event }) => {
    event.stopPropagation();
    onSelect();
    const svg = svgRef.current;
    if (!svg) return;
    const point = clientToSvg(svg, clientX, clientY);
    const angle = radToDeg(Math.atan2(point.y - centroid.y, point.x - centroid.x));
    onRotate(normalizeAngle(angle - 90));
  });

  const editableHandles = species.rig.editableSegments
    .map((segmentId) => {
      const definition = segmentDefinitions[segmentId];
      const segment = segmentMap[segmentId];
      const parent = definition.parentId ? segmentMap[definition.parentId] : undefined;
      if (!definition || !segment) return null;
      return {
        definition,
        segment,
        pivot: { x: segment.x1, y: segment.y1 },
        referenceAngle: parent?.angleDeg ?? sleeper.rotationDeg,
      };
    })
    .filter((handle): handle is NonNullable<typeof handle> => Boolean(handle));

  const visibleFigure = (() => {
    if (sleeper.type === 'adult' || sleeper.type === 'child') {
      return renderHumanSVG(segments, sleeper, selected, bedWidthIn, bedLengthIn);
    }
    if (sleeper.type === 'dog') {
      return renderDogSVG(segments, sleeper, selected, bedWidthIn, bedLengthIn);
    }
    return renderCatSVG(segments, sleeper, selected, bedWidthIn, bedLengthIn);
  })();

  return (
    <g {...bindDrag()} onPointerDown={onSelect}>
      {visibleFigure}

      {selected ? (
        <text
          x={labelPoint.x}
          y={labelPoint.y}
          textAnchor="middle"
          className="pointer-events-none font-mono text-[3.2px] font-semibold uppercase tracking-[0.7px]"
          fill="#fff9ed"
          stroke="rgba(7, 9, 15, 0.96)"
          strokeWidth={0.95}
          paintOrder="stroke"
        >
          {sleeper.name}
        </text>
      ) : null}

      {selected ? (
        <>
          <line
            x1={centroid.x}
            y1={centroid.y}
            x2={rotationHandle.x}
            y2={rotationHandle.y}
            stroke="rgba(255, 243, 218, 0.8)"
            strokeDasharray="1.4 1.4"
            strokeWidth={0.3}
          />
          <circle
            {...bindRotate()}
            cx={rotationHandle.x}
            cy={rotationHandle.y}
            r={1.8}
            fill="#fff4de"
            stroke="#7d4c21"
            strokeWidth={0.35}
          />
          {editableHandles.map(({ definition, segment, pivot, referenceAngle }) => (
            <JointHandle
              key={`${segment.segmentId}-handle`}
              svgRef={svgRef}
              pivot={pivot}
              target={{ x: segment.x2, y: segment.y2 }}
              definition={{
                id: segment.segmentId,
                baseAngle: definition.baseAngle,
                jointLimits: definition.jointLimits,
              }}
              referenceAngle={referenceAngle}
              onSegmentAngle={onSegmentAngle}
            />
          ))}
        </>
      ) : null}
    </g>
  );
};
