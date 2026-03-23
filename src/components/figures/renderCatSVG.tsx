import { clamp } from '../../lib/geometry';
import { resolveSleeperPreset } from '../../simulation/presets/resolveSleeperPreset';
import type { Sleeper, WorldSegment } from '../../types';
import { capsulePath, darkenHex, polarOffset, segmentById } from './figureSvgUtils';

export const renderCatSVG = (
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
  const bodyScale = scale * Math.min(bedWidthIn / 60, bedLengthIn / 80);
  const stroke = darkenHex(sleeper.color, 0.15);
  const shadowId = `figure-shadow-${sleeper.id}`;
  const haloId = `figure-halo-${sleeper.id}`;
  const bodyAngle = spine.angleDeg;
  const lengthScale = Math.sqrt(resolved.species.lengthScale * resolved.lengthMultiplier) * bodyScale;
  const widthScale = Math.sqrt(resolved.species.widthScale * resolved.widthMultiplier) * bodyScale;
  const bodyLength = 9.8 * lengthScale;
  const bodyWidth = 4.65 * widthScale;
  const frontAngle = (neck?.angleDeg ?? head.angleDeg ?? bodyAngle) - bodyAngle;
  const frontLeftAngle = (frontLeftLeg?.angleDeg ?? bodyAngle + 122) - bodyAngle;
  const frontRightAngle = (frontRightLeg?.angleDeg ?? bodyAngle + 58) - bodyAngle;
  const hindLeftAngle = (hindLeftLeg?.angleDeg ?? bodyAngle + 126) - bodyAngle;
  const hindRightAngle = (hindRightLeg?.angleDeg ?? bodyAngle + 54) - bodyAngle;
  const tailAngle = (tail?.angleDeg ?? bodyAngle + 28) - bodyAngle;
  const bodyPath = capsulePath({ x: 0, y: 0 }, bodyLength, bodyWidth, 0);
  const headCenter = polarOffset({ x: -bodyLength * 0.48, y: 0 }, 0.7 * widthScale, frontAngle);
  const headRadius = 1.62 * widthScale;
  const earBaseLeft = polarOffset(headCenter, headRadius * 0.42, frontAngle - 146);
  const earTipLeft = polarOffset(headCenter, headRadius * 1.05, frontAngle - 120);
  const earBaseRight = polarOffset(headCenter, headRadius * 0.42, frontAngle + 146);
  const earTipRight = polarOffset(headCenter, headRadius * 1.05, frontAngle + 120);
  const tailStart = { x: bodyLength * 0.32, y: bodyWidth * 0.08 };
  const tailMid = polarOffset(tailStart, 3.2 * widthScale, tailAngle + 46);
  const tailTip = polarOffset(tailMid, 3.1 * widthScale, tailAngle + 104);
  const legLength = 2.45 * lengthScale;
  const legWidth = 0.88 * widthScale;
  const frontLeftCenter = polarOffset({ x: -bodyLength * 0.18, y: -bodyWidth * 0.24 }, legLength / 2, frontLeftAngle);
  const frontRightCenter = polarOffset({ x: -bodyLength * 0.08, y: bodyWidth * 0.24 }, legLength / 2, frontRightAngle);
  const hindLeftCenter = polarOffset({ x: bodyLength * 0.18, y: -bodyWidth * 0.2 }, legLength / 2, hindLeftAngle);
  const hindRightCenter = polarOffset({ x: bodyLength * 0.24, y: bodyWidth * 0.22 }, legLength / 2, hindRightAngle);

  return (
    <g>
      <defs>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0.12" stdDeviation="0.18" floodColor="#000000" floodOpacity="0.3" />
        </filter>
        <filter id={haloId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="0.28" />
        </filter>
      </defs>

      {selected ? (
        <ellipse
          cx={spine.cx}
          cy={spine.cy}
          rx={bodyLength * 0.58}
          ry={bodyWidth * 0.92}
          fill={sleeper.color}
          opacity={0.35}
          filter={`url(#${haloId})`}
          transform={`rotate(${bodyAngle} ${spine.cx} ${spine.cy})`}
        />
      ) : null}

      <g filter={`url(#${shadowId})`} transform={`translate(${spine.cx} ${spine.cy}) rotate(${bodyAngle})`}>
        <path d={bodyPath} fill={sleeper.color} stroke={stroke} strokeWidth={0.4} />
        <ellipse
          cx={-bodyLength * 0.12}
          cy={0}
          rx={bodyWidth * 0.32}
          ry={bodyWidth * 0.4}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.28}
        />
        <ellipse
          cx={headCenter.x}
          cy={headCenter.y}
          rx={headRadius}
          ry={headRadius * 0.88}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.3}
          transform={`rotate(${frontAngle} ${headCenter.x} ${headCenter.y})`}
        />
        <path
          d={`M ${earBaseLeft.x} ${earBaseLeft.y} L ${earTipLeft.x} ${earTipLeft.y} L ${headCenter.x} ${headCenter.y} Z`}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.18}
        />
        <path
          d={`M ${earBaseRight.x} ${earBaseRight.y} L ${earTipRight.x} ${earTipRight.y} L ${headCenter.x} ${headCenter.y} Z`}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.18}
        />
        <path d={capsulePath(frontLeftCenter, legLength, legWidth, frontLeftAngle)} fill={sleeper.color} stroke={stroke} strokeWidth={0.22} />
        <path d={capsulePath(frontRightCenter, legLength, legWidth, frontRightAngle)} fill={sleeper.color} stroke={stroke} strokeWidth={0.22} />
        <path d={capsulePath(hindLeftCenter, legLength, legWidth, hindLeftAngle)} fill={sleeper.color} stroke={stroke} strokeWidth={0.22} />
        <path d={capsulePath(hindRightCenter, legLength, legWidth, hindRightAngle)} fill={sleeper.color} stroke={stroke} strokeWidth={0.22} />

        <path
          d={`M ${tailStart.x} ${tailStart.y} Q ${tailMid.x} ${tailMid.y} ${tailTip.x} ${tailTip.y}`}
          fill="none"
          stroke={stroke}
          strokeLinecap="round"
          strokeWidth={Math.max(0.28, 0.58 * widthScale)}
        />
      </g>
    </g>
  );
};
