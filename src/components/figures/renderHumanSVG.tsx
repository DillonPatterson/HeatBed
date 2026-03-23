import { resolveSleeperPreset } from '../../simulation/presets/resolveSleeperPreset';
import type { Sleeper, WorldSegment } from '../../types';
import { capsulePath, darkenHex, polarOffset, segmentById } from './figureSvgUtils';

export const renderHumanSVG = (
  segments: WorldSegment[],
  sleeper: Sleeper,
  selected: boolean,
  bedWidthIn: number,
  bedLengthIn: number,
) => {
  const torso = segmentById(segments, 'torso');
  const head = segmentById(segments, 'head');
  const leftArm = segmentById(segments, 'leftArm');
  const rightArm = segmentById(segments, 'rightArm');
  const leftLeg = segmentById(segments, 'leftLeg');
  const rightLeg = segmentById(segments, 'rightLeg');

  if (!torso || !head) {
    return null;
  }

  const resolved = resolveSleeperPreset(sleeper);
  const widthScale = Math.sqrt(resolved.species.widthScale * resolved.widthMultiplier);
  const lengthScale = Math.sqrt(resolved.species.lengthScale * resolved.lengthMultiplier);
  const bedScale = Math.min(bedWidthIn / 60, bedLengthIn / 80);
  const stroke = darkenHex(sleeper.color, 0.15);
  const shadowId = `figure-shadow-${sleeper.id}`;
  const haloId = `figure-halo-${sleeper.id}`;
  const bodyAngle = torso.angleDeg;
  const sizeScale = Math.min(1.08, Math.max(0.72, bedScale * Math.sqrt(lengthScale)));
  const torsoWidth = 6.1 * widthScale * sizeScale;
  const shoulderWidth = torsoWidth * 0.95;
  const waistWidth = torsoWidth * 0.64;
  const hipWidth = torsoWidth * 0.7;
  const bodyTop = -5.9 * sizeScale;
  const shoulderY = -4.2 * sizeScale;
  const waistY = 0.8 * sizeScale;
  const hipY = 5.3 * sizeScale;
  const bodyBottom = 8.5 * sizeScale;
  const headCy = -8.35 * sizeScale;
  const headRx = 1.85 * widthScale * sizeScale;
  const headRy = 1.65 * sizeScale;
  const torsoPath = [
    `M ${-shoulderWidth / 2} ${bodyTop + 0.9 * sizeScale}`,
    `Q ${-shoulderWidth * 0.62} ${shoulderY} ${-waistWidth / 2} ${waistY}`,
    `Q ${-hipWidth / 2} ${hipY} ${-1.55 * sizeScale} ${bodyBottom}`,
    `Q 0 ${bodyBottom + 0.65 * sizeScale} ${1.55 * sizeScale} ${bodyBottom}`,
    `Q ${hipWidth / 2} ${hipY} ${waistWidth / 2} ${waistY}`,
    `Q ${shoulderWidth * 0.62} ${shoulderY} ${shoulderWidth / 2} ${bodyTop + 0.9 * sizeScale}`,
    `Q ${2.05 * sizeScale} ${bodyTop - 1.15 * sizeScale} 0 ${bodyTop - 1.15 * sizeScale}`,
    `Q ${-2.05 * sizeScale} ${bodyTop - 1.15 * sizeScale} ${-shoulderWidth / 2} ${bodyTop + 0.9 * sizeScale}`,
    'Z',
  ].join(' ');

  const leftArmAngle = (leftArm?.angleDeg ?? bodyAngle + 118) - bodyAngle;
  const rightArmAngle = (rightArm?.angleDeg ?? bodyAngle + 62) - bodyAngle;
  const leftLegAngle = (leftLeg?.angleDeg ?? bodyAngle + 112) - bodyAngle;
  const rightLegAngle = (rightLeg?.angleDeg ?? bodyAngle + 68) - bodyAngle;
  const armLength = 6.3 * lengthScale * sizeScale;
  const armWidth = 1.6 * widthScale * sizeScale;
  const legLength = 7.2 * lengthScale * sizeScale;
  const legWidth = 1.85 * widthScale * sizeScale;
  const leftShoulder = { x: -shoulderWidth * 0.44, y: shoulderY + 0.55 * sizeScale };
  const rightShoulder = { x: shoulderWidth * 0.44, y: shoulderY + 0.55 * sizeScale };
  const leftHip = { x: -hipWidth * 0.22, y: hipY - 0.2 * sizeScale };
  const rightHip = { x: hipWidth * 0.22, y: hipY - 0.2 * sizeScale };
  const leftArmCenter = polarOffset(leftShoulder, armLength / 2, leftArmAngle);
  const rightArmCenter = polarOffset(rightShoulder, armLength / 2, rightArmAngle);
  const leftLegCenter = polarOffset(leftHip, legLength / 2, leftLegAngle);
  const rightLegCenter = polarOffset(rightHip, legLength / 2, rightLegAngle);

  return (
    <g>
      <defs>
        <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0.12" stdDeviation="0.2" floodColor="#000000" floodOpacity="0.3" />
        </filter>
        <filter id={haloId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation={0.28 * bedScale} />
        </filter>
      </defs>

      {selected ? (
        <ellipse
          cx={torso.cx}
          cy={torso.cy + 0.7 * sizeScale}
          rx={torsoWidth * 1.08}
          ry={8.8 * sizeScale}
          fill={sleeper.color}
          opacity={0.35}
          filter={`url(#${haloId})`}
          transform={`rotate(${bodyAngle} ${torso.cx} ${torso.cy + 0.7 * sizeScale})`}
        />
      ) : null}

      <g filter={`url(#${shadowId})`} transform={`translate(${torso.cx} ${torso.cy}) rotate(${bodyAngle})`}>
        <path d={torsoPath} fill={sleeper.color} stroke={stroke} strokeWidth={0.48} />

        <path
          d={capsulePath(leftArmCenter, armLength, armWidth, leftArmAngle)}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.4}
        />
        <path
          d={capsulePath(rightArmCenter, armLength, armWidth, rightArmAngle)}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.4}
        />
        <path
          d={capsulePath(leftLegCenter, legLength, legWidth, leftLegAngle)}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.42}
        />
        <path
          d={capsulePath(rightLegCenter, legLength, legWidth, rightLegAngle)}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.42}
        />

        <ellipse
          cx={0}
          cy={headCy}
          rx={headRx}
          ry={headRy}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.42}
        />
        <path
          d={`M ${-headRx * 0.74} ${headCy + headRy * 0.15} Q 0 ${headCy - headRy * 0.18} ${headRx * 0.74} ${headCy + headRy * 0.15}`}
          fill="none"
          stroke={stroke}
          strokeOpacity={0.3}
          strokeWidth={0.18}
        />
      </g>
    </g>
  );
};
