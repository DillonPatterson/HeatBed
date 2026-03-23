import { clamp } from '../../lib/geometry';
import type { Point, WorldSegment } from '../../types';

export const segmentById = (segments: WorldSegment[], segmentId: string) =>
  segments.find((segment) => segment.segmentId === segmentId);

export const polarOffset = (point: Point, distance: number, angleDeg: number): Point => {
  const radians = (angleDeg * Math.PI) / 180;
  return {
    x: point.x + Math.cos(radians) * distance,
    y: point.y + Math.sin(radians) * distance,
  };
};

export const midpoint = (a: Point, b: Point): Point => ({
  x: (a.x + b.x) / 2,
  y: (a.y + b.y) / 2,
});

export const darkenHex = (hex: string, amount = 0.15) => {
  const value = hex.replace('#', '');
  const expanded = value.length === 3 ? value.split('').map((char) => `${char}${char}`).join('') : value;
  const channels = expanded.match(/.{1,2}/g);

  if (!channels || channels.length !== 3) {
    return hex;
  }

  return `#${channels
    .map((channel) =>
      Math.round(clamp(parseInt(channel, 16) * (1 - amount), 0, 255))
        .toString(16)
        .padStart(2, '0'),
    )
    .join('')}`;
};

export const capsulePath = (
  center: Point,
  length: number,
  width: number,
  angleDeg: number,
) => {
  const radius = width / 2;
  const start = polarOffset(center, length / 2 - radius, angleDeg + 180);
  const end = polarOffset(center, length / 2 - radius, angleDeg);
  const leftAngle = angleDeg - 90;
  const rightAngle = angleDeg + 90;
  const startLeft = polarOffset(start, radius, leftAngle);
  const startRight = polarOffset(start, radius, rightAngle);
  const endLeft = polarOffset(end, radius, leftAngle);
  const endRight = polarOffset(end, radius, rightAngle);

  return [
    `M ${startLeft.x} ${startLeft.y}`,
    `L ${endLeft.x} ${endLeft.y}`,
    `A ${radius} ${radius} 0 0 1 ${endRight.x} ${endRight.y}`,
    `L ${startRight.x} ${startRight.y}`,
    `A ${radius} ${radius} 0 0 1 ${startLeft.x} ${startLeft.y}`,
    'Z',
  ].join(' ');
};

export const limbEllipse = (segment: WorldSegment, widthScale = 1, lengthScale = 1) => ({
  cx: segment.cx,
  cy: segment.cy,
  rx: Math.max(1.1, (segment.width * 0.52 * widthScale) / 2),
  ry: Math.max(2.1, (segment.length * 0.46 * lengthScale) / 2),
});
