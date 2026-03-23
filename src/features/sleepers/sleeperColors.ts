import type { SleeperType } from '../../types';

export type HumanPresentation = 'male' | 'female' | 'other';

const defaultColors: Record<SleeperType, string> = {
  adult: '#5b9bd5',
  child: '#6ecfc9',
  dog: '#d4956a',
  cat: '#9ab86e',
};

const humanVariantColors: Record<'adult' | 'child', Record<HumanPresentation, string>> = {
  adult: {
    male: '#5b9bd5',
    female: '#8c86e6',
    other: '#6db7dd',
  },
  child: {
    male: '#6ecfc9',
    female: '#95b8ff',
    other: '#88ded4',
  },
};

export const getSleeperColor = (
  type: SleeperType,
  presentation: HumanPresentation = 'other',
): string => {
  if (type === 'adult' || type === 'child') {
    return humanVariantColors[type][presentation];
  }

  return defaultColors[type];
};

export const normalizeSleeperColor = (type: SleeperType, color?: string): string => {
  if (!color) {
    return getSleeperColor(type);
  }

  const allowed = new Set<string>([
    defaultColors[type],
    ...(type === 'adult' || type === 'child' ? Object.values(humanVariantColors[type]) : []),
  ]);

  return allowed.has(color) ? color : getSleeperColor(type);
};
