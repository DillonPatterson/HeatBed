import { resolveSleeperPreset } from '../../simulation/presets/resolveSleeperPreset';
import type { Sleeper, WorldSegment } from '../../types';
import { capsulePath, darkenHex, limbEllipse, midpoint, polarOffset, segmentById } from './figureSvgUtils';

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
  const torsoPath = capsulePath(
    { x: torso.cx, y: torso.cy },
    torso.length * 0.96 * lengthScale,
    torso.width * 1.02 * widthScale,
    torso.angleDeg,
  );
  const shoulderCenter = midpoint({ x: torso.x1, y: torso.y1 }, { x: torso.cx, y: torso.cy });
  const hipCenter = midpoint({ x: torso.cx, y: torso.cy }, { x: torso.x2, y: torso.y2 });
  const bodyAngle = torso.angleDeg;
  const foreheadLeft = polarOffset({ x: head.cx, y: head.cy }, head.width * 0.12, bodyAngle - 90);
  const foreheadRight = polarOffset({ x: head.cx, y: head.cy }, head.width * 0.12, bodyAngle + 90);

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
          cy={torso.cy}
          rx={torso.width * 1.15}
          ry={torso.length * 0.54}
          fill={sleeper.color}
          opacity={0.35}
          filter={`url(#${haloId})`}
          transform={`rotate(${bodyAngle} ${torso.cx} ${torso.cy})`}
        />
      ) : null}

      <g filter={`url(#${shadowId})`}>
        <path d={torsoPath} fill={sleeper.color} stroke={stroke} strokeWidth={0.5} />

        {leftArm ? (
          <ellipse
            {...limbEllipse(leftArm, widthScale, lengthScale)}
            fill={sleeper.color}
            stroke={stroke}
            strokeWidth={0.42}
            transform={`rotate(${leftArm.angleDeg} ${leftArm.cx} ${leftArm.cy})`}
          />
        ) : null}
        {rightArm ? (
          <ellipse
            {...limbEllipse(rightArm, widthScale, lengthScale)}
            fill={sleeper.color}
            stroke={stroke}
            strokeWidth={0.42}
            transform={`rotate(${rightArm.angleDeg} ${rightArm.cx} ${rightArm.cy})`}
          />
        ) : null}
        {leftLeg ? (
          <ellipse
            {...limbEllipse(leftLeg, widthScale, lengthScale)}
            fill={sleeper.color}
            stroke={stroke}
            strokeWidth={0.44}
            transform={`rotate(${leftLeg.angleDeg} ${leftLeg.cx} ${leftLeg.cy})`}
          />
        ) : null}
        {rightLeg ? (
          <ellipse
            {...limbEllipse(rightLeg, widthScale, lengthScale)}
            fill={sleeper.color}
            stroke={stroke}
            strokeWidth={0.44}
            transform={`rotate(${rightLeg.angleDeg} ${rightLeg.cx} ${rightLeg.cy})`}
          />
        ) : null}

        <ellipse
          cx={head.cx}
          cy={head.cy}
          rx={(head.width * 0.48 * widthScale) / 2}
          ry={(head.width * 0.57 * lengthScale) / 2}
          fill={sleeper.color}
          stroke={stroke}
          strokeWidth={0.42}
          transform={`rotate(${bodyAngle} ${head.cx} ${head.cy})`}
        />

        <circle cx={shoulderCenter.x} cy={shoulderCenter.y} r={torso.width * 0.18} fill={sleeper.color} />
        <circle cx={hipCenter.x} cy={hipCenter.y} r={torso.width * 0.18} fill={sleeper.color} />
        <path
          d={`M ${foreheadLeft.x} ${foreheadLeft.y}
             Q ${head.cx} ${head.cy - head.width * 0.1} ${foreheadRight.x} ${foreheadRight.y}`}
          fill="none"
          stroke={stroke}
          strokeOpacity={0.35}
          strokeWidth={0.22}
        />
      </g>
    </g>
  );
};
