import { degToRad, lerp } from '../../lib/geometry';
import type { Point, ResolvedSleeperProfile, Sleeper, WorldSegment } from '../../types';

const pointAlongSegment = (start: Point, end: Point, t: number): Point => ({
  x: lerp(start.x, end.x, t),
  y: lerp(start.y, end.y, t),
});

export const buildWorldSegments = (
  sleeper: Sleeper,
  resolved: ResolvedSleeperProfile,
): WorldSegment[] => {
  const segmentMap = new Map<string, WorldSegment>();
  const weightRatio = sleeper.weightLb / resolved.defaultWeightLb;
  const lengthScale = resolved.species.lengthScale * resolved.lengthMultiplier * (1 + (weightRatio - 1) * 0.06);
  const widthScale = resolved.species.widthScale * resolved.widthMultiplier * (1 + (weightRatio - 1) * 0.14);

  for (const definition of resolved.species.rig.segments) {
    const parent = definition.parentId ? segmentMap.get(definition.parentId) : undefined;
    const baseAngle =
      (parent?.angleDeg ?? sleeper.rotationDeg) +
      definition.baseAngle +
      (sleeper.poseState[definition.id] ?? 0);

    let origin: Point;

    if (parent) {
      const attachPoint = pointAlongSegment(
        { x: parent.x1, y: parent.y1 },
        { x: parent.x2, y: parent.y2 },
        definition.attachOffset ?? 0,
      );
      const parentAngle = degToRad(parent.angleDeg + 90);
      origin = {
        x: attachPoint.x + Math.cos(parentAngle) * (definition.lateralOffset ?? 0) * widthScale,
        y: attachPoint.y + Math.sin(parentAngle) * (definition.lateralOffset ?? 0) * widthScale,
      };
    } else {
      origin = {
        x: sleeper.root.x + (definition.rootOffset?.x ?? 0),
        y: sleeper.root.y + (definition.rootOffset?.y ?? 0),
      };
    }

    const length = definition.length * lengthScale;
    const width = definition.width * widthScale;
    const angle = degToRad(baseAngle);
    const end = definition.kind === 'circle'
      ? origin
      : {
          x: origin.x + Math.cos(angle) * length,
          y: origin.y + Math.sin(angle) * length,
        };

    const segment: WorldSegment = {
      sleeperId: sleeper.id,
      segmentId: definition.id,
      label: definition.label,
      kind: definition.kind,
      x1: origin.x,
      y1: origin.y,
      x2: end.x,
      y2: end.y,
      cx: definition.kind === 'circle' ? origin.x : (origin.x + end.x) / 2,
      cy: definition.kind === 'circle' ? origin.y : (origin.y + end.y) / 2,
      length,
      width,
      angleDeg: baseAngle,
      heatWeight: definition.heatWeight,
    };

    segmentMap.set(definition.id, segment);
  }

  return Array.from(segmentMap.values());
};
