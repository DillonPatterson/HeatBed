import type { TemperatureRangeF, UnitSystem } from '../types';

const fahrenheitCountries = new Set(['US', 'LR', 'MM', 'BS', 'BZ', 'KY', 'PW', 'FM', 'MH']);

export const toCelsius = (valueF: number) => ((valueF - 32) * 5) / 9;
export const toFahrenheit = (valueC: number) => (valueC * 9) / 5 + 32;

export const getDefaultUnit = (): UnitSystem => {
  const locale = Intl.DateTimeFormat().resolvedOptions().locale;
  const region = locale.split('-')[1]?.toUpperCase();
  return region && fahrenheitCountries.has(region) ? 'F' : 'C';
};

export const rangeToUnit = (rangeF: TemperatureRangeF, unit: UnitSystem) =>
  unit === 'F'
    ? { min: Math.round(rangeF.minF), max: Math.round(rangeF.maxF) }
    : { min: Math.round(toCelsius(rangeF.minF)), max: Math.round(toCelsius(rangeF.maxF)) };

export const formatRange = (rangeF: TemperatureRangeF, unit: UnitSystem) => {
  const range = rangeToUnit(rangeF, unit);
  return `${range.min}-${range.max}°${unit}`;
};

export const formatDeltaRange = (rangeF: TemperatureRangeF, unit: UnitSystem) => {
  const range = rangeToUnit(rangeF, unit);
  return `+${range.min}-${range.max}°${unit} above ambient`;
};

export const formatDualRange = (rangeF: TemperatureRangeF, primaryUnit: UnitSystem) => {
  const secondaryUnit: UnitSystem = primaryUnit === 'F' ? 'C' : 'F';
  return `${formatRange(rangeF, primaryUnit)} / ${formatRange(rangeF, secondaryUnit)}`;
};
