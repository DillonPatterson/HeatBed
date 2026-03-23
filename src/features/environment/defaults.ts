import { blanketProfiles } from '../../data/blankets/blankets';
import { getDefaultUnit } from '../../lib/units';
import type { BedSizeId, EnvironmentState } from '../../types';

export const defaultBedSizeId: BedSizeId = 'queen';

export const defaultEnvironment = (): EnvironmentState => ({
  roomTempF: 67,
  blanketId: blanketProfiles.find((blanket) => blanket.id === 'duvet')?.id ?? blanketProfiles[0].id,
  unit: getDefaultUnit(),
});
