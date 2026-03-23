import { clamp } from '../../lib/geometry';
import { resolveSleeperPreset } from '../../simulation/presets/resolveSleeperPreset';
import type { Sleeper, WorldSegment } from '../../types';
import { capsulePath, darkenHex, polarOffset, segmentById } from './figureSvgUtils';

export const renderDogSVG = (
  segments: WorldSegment[],
  sleeper: Sleeper,
  selected: boolean,
  bedWidthIn: number,
  bedLengthIn: number,
) => {
  const spine = segmentById(segments, 'spine');
  const head = segmentById(segments, 'head');
  const neck = segmentById(segments, 'neck');
  const frontLeftLeg = segmentById(segments, 'frontLeftLeg');
  const frontRightLeg = segmentById(segments, 'frontRightLeg');
  const hindLeftLeg = segmentById(segments, 'hindLeftLeg');
  const hindRightLeg = segmentById(segments, 'hindRightLeg');
  const tail = segmentById(segments, 'tail');

  if (!spine || !head) {
    return null;
  }

  const resolved = resolveSleeperPreset(sleeper);
  const scale = clamp(Math.pow(sleeper.weightLb / resolved.defaultWeightLb, 0.5), 0.55, 1.6);
  const bodyScale = Math.min(scale * Math.min(bedWidthIn / 60, bedLengthIn / 80), scale * 1.04);
  const stroke = darkenHex(sleeper.color, 0.15);
  const shadowId = `figure-shadow-${sleeper.id}`;
  const haloId = `figure-halo-${sleeper.id}`;
  const bodyPath = capsulePath(
    { x: spine.cx, y: spine.cy },
    spine.length * 1.16 * bodyScale,
    spine.width * 1.02 * bodyScale,
    spine.angleDeg,
  );
  const chestCenter = polarOffset({ x: spine.cx, y: spine.cy }, spine.length * 0.12, spine.angleDeg + 180);
  const hipCenter = polarOffset({ x: spine.cx, y: spine.cy }, spine.length * 0.18, spine.angleDeg);
  const frontAngle = neck?.angleDeg ?? Math.atan2(head.cy - spine.cy, head.cx - spine.cx) * (180 / Math.PI);
  const snoutBase = polarOffset({ x: head.cx, y: head.cy }, head.width * 0.15 * scale, frontAngle + 180);
  const snoutTip = polarOffset({ x: head.cx, y: head.cy }, head.width * 0.42 * scale, frontAngle);
  const snoutTop = polarOffset(snoutBase, head.width * 0.18 * scale, frontAngle - 90);
  const snoutBottom = polarOffset(snoutBase, head.width * 0.18 * scale, frontAngle + 90);
  const tailStart = { x: tail?.x1 ?? spine.x2, y: tail?.y1 ?? spine.y2 };
  const tailMid = polarOffset(tailStart, 3.2 * scale, (tail?.angleDeg ?? spine.angleDeg) - 20);
  const tailTip = polarOffset(tailStart, 6.1 * scale, tail?.angleDeg ?? spine.angleDeg);

  const legNodes = [frontLeftLeg, frontRightLeg, hindLeftLeg, hindRightLeg].filter(
    (segment): segment is WorldSegment => Boolean(segment),
  );

  return (
    <g>
      <defs>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0.12" stdDeviation="0.2" floodColor="#000000" floodOpacity="0.3" />
        </filter>
        <filter id={haloId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.28" />
        </filter>
      </defs>

      {selected ? (
        <ellipse
          cx={spine.cx}
          cy={spine.cy}
          rx={spine.length * 0.48 * bodyScale}
          ry={spine.width * 0.82 * bodyScale}
          fill={sleeper.color}
          opacity={0.35}
          filter={`url(#${haloId})`}
          transform={`rotate(${spine.angleDeg} ${spine.cx} ${spine.cy})`}
        />
      ) : null}

      <g filter={`url(#${shadowId})`}>
        <path d={bodyPath} fill={sleeper.color} stroke={stroke} strokeWidth={0.46} />
        <ellipse
          cx={chestCenter.x}
          cy={chestCenter.y}
          rx={spine.width * 0.34 * bodyScale}
          ry={spine.width * 0.42 * bodyScale}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.34}
          transform={`rotate(${spine.angleDeg} ${chestCenter.x} ${chestCenter.y})`}
        />
        <ellipse
          cx={hipCenter.x}
          cy={hipCenter.y}
          rx={spine.width * 0.3 * bodyScale}
          ry={spine.width * 0.36 * bodyScale}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.34}
          transform={`rotate(${spine.angleDeg} ${hipCenter.x} ${hipCenter.y})`}
        />

        {legNodes.map((segment) => (
          <ellipse
            key={segment.segmentId}
            cx={segment.cx}
            cy={segment.cy}
            rx={Math.max(0.8, segment.width * 0.45 * scale)}
            ry={Math.max(1.5, segment.length * 0.2 * scale)}
            fill={sleeper.color}
            stroke={stroke}
            strokeWidth={0.3}
            transform={`rotate(${segment.angleDeg} ${segment.cx} ${segment.cy})`}
          />
        ))}

        <ellipse
          cx={head.cx}
          cy={head.cy}
          rx={head.width * 0.34 * scale}
          ry={head.width * 0.28 * scale}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.34}
          transform={`rotate(${frontAngle} ${head.cx} ${head.cy})`}
        />
        <path
          d={`M ${snoutTop.x} ${snoutTop.y} L ${snoutTip.x} ${snoutTip.y} L ${snoutBottom.x} ${snoutBottom.y} Q ${snoutBase.x} ${snoutBase.y} ${snoutTop.x} ${snoutTop.y} Z`}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.26}
        />
        <path
          d={`M ${tailStart.x} ${tailStart.y} Q ${tailMid.x} ${tailMid.y} ${tailTip.x} ${tailTip.y}`}
          fill="none"
          stroke={stroke}
          strokeLinecap="round"
          strokeWidth={Math.max(0.42, 0.9 * scale)}
        />
      </g>
    </g>
  );
};
