const heatStops = [
  { stop: 0.0, color: [0, 0, 0, 0] },
  { stop: 0.12, color: [10, 20, 60, 0.25] },
  { stop: 0.28, color: [20, 80, 160, 0.55] },
  { stop: 0.46, color: [60, 140, 220, 0.75] },
  { stop: 0.6, color: [220, 170, 40, 0.88] },
  { stop: 0.74, color: [255, 110, 20, 0.94] },
  { stop: 0.88, color: [255, 50, 10, 0.97] },
  { stop: 1.0, color: [255, 240, 220, 1] },
] as const;

export const heatColorAt = (t: number): [number, number, number, number] => {
  const clamped = Math.max(0, Math.min(1, t));
  const upperIndex = heatStops.findIndex((stop) => stop.stop >= clamped);

  if (upperIndex <= 0) {
    const [r, g, b, a] = heatStops[0].color;
    return [r, g, b, a];
  }

  const lower = heatStops[upperIndex - 1];
  const upper = heatStops[upperIndex];
  const localT = (clamped - lower.stop) / (upper.stop - lower.stop || 1);

  return [
    Math.round(lower.color[0] + (upper.color[0] - lower.color[0]) * localT),
    Math.round(lower.color[1] + (upper.color[1] - lower.color[1]) * localT),
    Math.round(lower.color[2] + (upper.color[2] - lower.color[2]) * localT),
    lower.color[3] + (upper.color[3] - lower.color[3]) * localT,
  ];
};
