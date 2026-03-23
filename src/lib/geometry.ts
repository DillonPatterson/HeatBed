import type { BedSize, Point } from '../types';

export const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const lerp = (start: number, end: number, amount: number) =>
  start + (end - start) * amount;

export const degToRad = (degrees: number) => (degrees * Math.PI) / 180;

export const radToDeg = (radians: number) => (radians * 180) / Math.PI;

export const rotateVector = (point: Point, angleDeg: number): Point => {
  const angle = degToRad(angleDeg);
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  return {
    x: point.x * cos - point.y * sin,
    y: point.x * sin + point.y * cos,
  };
};

export const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);

export const normalizeAngle = (degrees: number) => {
  let normalized = degrees % 360;
  if (normalized > 180) normalized -= 360;
  if (normalized < -180) normalized += 360;
  return normalized;
};

export const clampPointToBed = (point: Point, bed: BedSize, margin = 2) => ({
  x: clamp(point.x, margin, bed.widthIn - margin),
  y: clamp(point.y, margin, bed.lengthIn - margin),
});
