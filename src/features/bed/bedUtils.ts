import { bedSizes } from '../../data/beds/bedSizes';
import { clampPointToBed } from '../../lib/geometry';
import type { BedSize, BedSizeId, Point } from '../../types';

export const getBedSize = (bedSizeId: BedSizeId): BedSize =>
  bedSizes.find((bed) => bed.id === bedSizeId) ?? bedSizes[2];

export const clampRootToBed = (point: Point, bedSizeId: BedSizeId, margin = 2.5) =>
  clampPointToBed(point, getBedSize(bedSizeId), margin);

export const zoneLabelFromPoint = (point: Point, bed: BedSize) => {
  const x = point.x / bed.widthIn;
  const y = point.y / bed.lengthIn;

  const horizontal =
    x < 0.2 ? 'left edge' : x < 0.42 ? 'left side' : x > 0.8 ? 'right edge' : x > 0.58 ? 'right side' : 'center';
  const vertical =
    y < 0.18 ? 'head of the bed' : y > 0.82 ? 'foot of the bed' : y < 0.4 ? 'upper middle' : y > 0.6 ? 'lower middle' : 'middle';

  if (vertical === 'middle') return horizontal === 'center' ? 'center of the bed' : `${horizontal} near the middle`;
  if (horizontal === 'center') return vertical;
  return `${vertical} on the ${horizontal}`;
};
