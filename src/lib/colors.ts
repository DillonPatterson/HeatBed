const heatStops = [
  { stop: 0, color: [37, 46, 63] },
  { stop: 0.22, color: [71, 112, 161] },
  { stop: 0.42, color: [130, 170, 200] },
  { stop: 0.62, color: [245, 190, 112] },
  { stop: 0.8, color: [242, 126, 58] },
  { stop: 1, color: [198, 48, 29] },
];

export const heatColorAt = (t: number) => {
  const clamped = Math.max(0, Math.min(1, t));
  const upperIndex = heatStops.findIndex((stop) => stop.stop >= clamped);
  if (upperIndex <= 0) {
    const [r, g, b] = heatStops[0].color;
    return `rgba(${r}, ${g}, ${b}, 0)`;
  }

  const lower = heatStops[upperIndex - 1];
  const upper = heatStops[upperIndex];
  const localT = (clamped - lower.stop) / (upper.stop - lower.stop || 1);
  const mixed = lower.color.map((component, index) =>
    Math.round(component + (upper.color[index] - component) * localT),
  );
  const alpha = clamped < 0.08 ? 0 : 0.08 + clamped * 0.9;
  return `rgba(${mixed[0]}, ${mixed[1]}, ${mixed[2]}, ${alpha})`;
};
