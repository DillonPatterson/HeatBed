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
  const bodyScale = scale * Math.min(bedWidthIn / 60, bedLengthIn / 80);
  const stroke = darkenHex(sleeper.color, 0.15);
  const shadowId = `figure-shadow-${sleeper.id}`;
  const haloId = `figure-halo-${sleeper.id}`;
  const bodyAngle = spine.angleDeg;
  const lengthScale = Math.sqrt(resolved.species.lengthScale * resolved.lengthMultiplier) * bodyScale;
  const widthScale = Math.sqrt(resolved.species.widthScale * resolved.widthMultiplier) * bodyScale;
  const bodyLength = 13.8 * lengthScale;
  const bodyWidth = 5.2 * widthScale;
  const frontAngle = (neck?.angleDeg ?? head.angleDeg ?? bodyAngle) - bodyAngle;
  const tailAngle = (tail?.angleDeg ?? bodyAngle + 12) - bodyAngle;
  const frontLegLeftAngle = (frontLeftLeg?.angleDeg ?? bodyAngle + 118) - bodyAngle;
  const frontLegRightAngle = (frontRightLeg?.angleDeg ?? bodyAngle + 62) - bodyAngle;
  const hindLegLeftAngle = (hindLeftLeg?.angleDeg ?? bodyAngle + 122) - bodyAngle;
  const hindLegRightAngle = (hindRightLeg?.angleDeg ?? bodyAngle + 58) - bodyAngle;
  const bodyPath = capsulePath({ x: 0, y: 0 }, bodyLength, bodyWidth, 0);
  const chestCenter = { x: -bodyLength * 0.2, y: -bodyWidth * 0.03 };
  const hipCenter = { x: bodyLength * 0.22, y: bodyWidth * 0.04 };
  const headCenter = polarOffset({ x: -bodyLength * 0.56, y: -0.1 * widthScale }, 1.1 * widthScale, frontAngle);
  const headRx = 2.15 * widthScale;
  const headRy = 1.55 * widthScale;
  const snoutBase = polarOffset(headCenter, headRx * 0.12, frontAngle);
  const snoutTip = polarOffset(headCenter, headRx * 1.35, frontAngle);
  const snoutTop = polarOffset(snoutBase, headRy * 0.65, frontAngle - 90);
  const snoutBottom = polarOffset(snoutBase, headRy * 0.65, frontAngle + 90);
  const tailStart = { x: bodyLength * 0.52, y: -bodyWidth * 0.05 };
  const tailMid = polarOffset(tailStart, 3.4 * widthScale, tailAngle - 18);
  const tailTip = polarOffset(tailMid, 3.2 * widthScale, tailAngle + 8);
  const legLength = 3.8 * lengthScale;
  const legWidth = 1.12 * widthScale;
  const frontLeftCenter = polarOffset({ x: -bodyLength * 0.22, y: -bodyWidth * 0.26 }, legLength / 2, frontLegLeftAngle);
  const frontRightCenter = polarOffset({ x: -bodyLength * 0.12, y: bodyWidth * 0.28 }, legLength / 2, frontLegRightAngle);
  const hindLeftCenter = polarOffset({ x: bodyLength * 0.22, y: -bodyWidth * 0.28 }, legLength / 2, hindLegLeftAngle);
  const hindRightCenter = polarOffset({ x: bodyLength * 0.3, y: bodyWidth * 0.28 }, legLength / 2, hindLegRightAngle);

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
          rx={bodyLength * 0.62}
          ry={bodyWidth * 0.9}
          fill={sleeper.color}
          opacity={0.35}
          filter={`url(#${haloId})`}
          transform={`rotate(${bodyAngle} ${spine.cx} ${spine.cy})`}
        />
      ) : null}

      <g filter={`url(#${shadowId})`} transform={`translate(${spine.cx} ${spine.cy}) rotate(${bodyAngle})`}>
        <path d={bodyPath} fill={sleeper.color} stroke={stroke} strokeWidth={0.52} />
        <ellipse
          cx={chestCenter.x}
          cy={chestCenter.y}
          rx={bodyWidth * 0.34}
          ry={bodyWidth * 0.4}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.34}
        />
        <ellipse
          cx={hipCenter.x}
          cy={hipCenter.y}
          rx={bodyWidth * 0.3}
          ry={bodyWidth * 0.34}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.34}
        />
        <path d={capsulePath(frontLeftCenter, legLength, legWidth, frontLegLeftAngle)} fill={sleeper.color} stroke={stroke} strokeWidth={0.28} />
        <path d={capsulePath(frontRightCenter, legLength, legWidth, frontLegRightAngle)} fill={sleeper.color} stroke={stroke} strokeWidth={0.28} />
        <path d={capsulePath(hindLeftCenter, legLength, legWidth, hindLegLeftAngle)} fill={sleeper.color} stroke={stroke} strokeWidth={0.28} />
        <path d={capsulePath(hindRightCenter, legLength, legWidth, hindLegRightAngle)} fill={sleeper.color} stroke={stroke} strokeWidth={0.28} />

        <ellipse
          cx={headCenter.x}
          cy={headCenter.y}
          rx={headRx}
          ry={headRy}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.34}
          transform={`rotate(${frontAngle} ${headCenter.x} ${headCenter.y})`}
        />
        <path
          d={`M ${snoutTop.x} ${snoutTop.y} L ${snoutTip.x} ${snoutTip.y} L ${snoutBottom.x} ${snoutBottom.y} Q ${snoutBase.x} ${snoutBase.y} ${snoutTop.x} ${snoutTop.y} Z`}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.24}
        />
        <path
          d={`M ${tailStart.x} ${tailStart.y} Q ${tailMid.x} ${tailMid.y} ${tailTip.x} ${tailTip.y}`}
          fill="none"
          stroke={stroke}
          strokeLinecap="round"
          strokeWidth={Math.max(0.42, 0.86 * widthScale)}
        />
      </g>
    </g>
  );
};
