import { clamp } from '../../lib/geometry';
import type { TemperatureRangeF } from '../../types';

export const createTemperatureRange = (
  normalizedValue: number,
  ambientF: number,
  peakDeltaF: number,
): { deltaRangeF: TemperatureRangeF; absoluteRangeF: TemperatureRangeF } => {
  const local = clamp(normalizedValue, 0, 1);
  const centerDelta = 0.6 + local * peakDeltaF;
  const spread = 1.4 + (1 - local) * 0.7;
  const minDelta = Math.max(0, centerDelta - spread);
  const maxDelta = centerDelta + spread;

  return {
    deltaRangeF: { minF: Math.round(minDelta), maxF: Math.round(maxDelta) },
    absoluteRangeF: { minF: Math.round(ambientF + minDelta), maxF: Math.round(ambientF + maxDelta) },
  };
};
