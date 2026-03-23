import { useDrag } from '@use-gesture/react';
import { useMemo, useRef } from 'react';
import { clamp, normalizeAngle, radToDeg, rotateVector } from '../../lib/geometry';
import { getSpeciesProfile } from '../../simulation/presets/resolveSleeperPreset';
import type { Point, Sleeper, WorldSegment } from '../../types';
import type { RefObject } from 'react';

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
      <line x1={pivot.x} y1={pivot.y} x2={target.x} y2={target.y} stroke="rgba(255, 243, 218, 0.6)" strokeDasharray="1.2 1.2" strokeWidth={0.24} />
      <circle {...bindJoint()} cx={target.x} cy={target.y} r={1.3} fill="#f6c990" stroke="#6d4120" strokeWidth={0.25} />
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

  return (
    <g {...bindDrag()} onPointerDown={onSelect}>
      {segments.map((segment) =>
        segment.kind === 'circle' ? (
          <g key={segment.segmentId}>
            <circle cx={segment.cx} cy={segment.cy} r={segment.width / 2 + 0.95} fill="rgba(21, 16, 12, 0.45)" />
            <circle cx={segment.cx} cy={segment.cy} r={segment.width / 2} fill={sleeper.color} stroke={selected ? '#fff4de' : 'rgba(40, 26, 17, 0.65)'} strokeWidth={selected ? 0.65 : 0.4} />
          </g>
        ) : (
          <g key={segment.segmentId}>
            <line x1={segment.x1} y1={segment.y1} x2={segment.x2} y2={segment.y2} stroke="rgba(21, 16, 12, 0.42)" strokeWidth={segment.width + 1.25} strokeLinecap="round" />
            <line x1={segment.x1} y1={segment.y1} x2={segment.x2} y2={segment.y2} stroke={sleeper.color} strokeWidth={segment.width} strokeLinecap="round" />
            {selected ? (
              <line x1={segment.x1} y1={segment.y1} x2={segment.x2} y2={segment.y2} stroke="rgba(255, 244, 222, 0.95)" strokeWidth={0.45} strokeLinecap="round" />
            ) : null}
          </g>
        ),
      )}

      <text
        x={centroid.x}
        y={centroid.y - 8.4}
        textAnchor="middle"
        className="pointer-events-none font-mono text-[3.3px] font-semibold uppercase tracking-[0.7px]"
        fill={selected ? '#fff9ed' : '#f3ece1'}
        stroke="rgba(7, 9, 15, 0.96)"
        strokeWidth={0.95}
        paintOrder="stroke"
      >
        {sleeper.name}
      </text>

      {selected ? (
        <>
          <circle cx={centroid.x} cy={centroid.y} r={8.8} fill="none" stroke="rgba(255, 243, 218, 0.68)" strokeDasharray="1.8 1.8" strokeWidth={0.34} />
          <line x1={centroid.x} y1={centroid.y} x2={rotationHandle.x} y2={rotationHandle.y} stroke="rgba(255, 243, 218, 0.9)" strokeDasharray="1.4 1.4" strokeWidth={0.32} />
          <circle {...bindRotate()} cx={rotationHandle.x} cy={rotationHandle.y} r={1.8} fill="#fff4de" stroke="#7d4c21" strokeWidth={0.35} />
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
