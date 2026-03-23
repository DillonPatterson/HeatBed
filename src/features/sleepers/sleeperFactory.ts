import { defaultBedSizeId } from '../environment/defaults';
import { getBedSize } from '../bed/bedUtils';
import { getSleeperColor } from './sleeperColors';
import { getDefaultBreedId, getPosePreset, getSpeciesProfile } from '../../simulation/presets/resolveSleeperPreset';
import type { BedSizeId, Sleeper, SleeperType } from '../../types';

const namePools: Record<SleeperType, string[]> = {
  adult: ['Riley', 'Jamie', 'Alex', 'Morgan', 'Taylor', 'Jordan'],
  child: ['Milo', 'Avery', 'Parker', 'Remy', 'Sage', 'Ellis'],
  dog: ['Bean', 'Poppy', 'Waffles', 'Moose', 'Maple', 'Tuna'],
  cat: ['Pebble', 'Olive', 'Fig', 'Miso', 'Nori', 'Biscuit'],
};

const slotPosition = (bedSizeId: BedSizeId, index: number) => {
  const bed = getBedSize(bedSizeId);
  const layout = [
    { x: bed.widthIn * 0.3, y: bed.lengthIn * 0.26, rotationDeg: 0 },
    { x: bed.widthIn * 0.68, y: bed.lengthIn * 0.26, rotationDeg: 0 },
    { x: bed.widthIn * 0.38, y: bed.lengthIn * 0.56, rotationDeg: -10 },
    { x: bed.widthIn * 0.68, y: bed.lengthIn * 0.62, rotationDeg: 14 },
    { x: bed.widthIn * 0.2, y: bed.lengthIn * 0.68, rotationDeg: 34 },
    { x: bed.widthIn * 0.8, y: bed.lengthIn * 0.72, rotationDeg: -28 },
    { x: bed.widthIn * 0.5, y: bed.lengthIn * 0.82, rotationDeg: 90 },
    { x: bed.widthIn * 0.12, y: bed.lengthIn * 0.18, rotationDeg: 48 },
  ];
  return layout[index % layout.length];
};

export const createSleeper = (
  type: SleeperType,
  index: number,
  bedSizeId: BedSizeId = defaultBedSizeId,
  overrides: Partial<Sleeper> = {},
): Sleeper => {
  const species = getSpeciesProfile(type);
  const pose = getPosePreset(type, species.defaultPosePresetId);
  const position = slotPosition(bedSizeId, index);
  return {
    id: crypto.randomUUID(),
    name: overrides.name ?? namePools[type][index % namePools[type].length],
    type,
    presetId: species.defaultPosePresetId,
    breedId: overrides.breedId ?? getDefaultBreedId(type),
    weightLb: overrides.weightLb ?? species.defaultWeightLb,
    thermalTendency: overrides.thermalTendency ?? 'neutral',
    posePresetId: overrides.posePresetId ?? pose.id,
    poseState: overrides.poseState ?? { ...pose.segmentAngles },
    root: overrides.root ?? { x: position.x, y: position.y },
    rotationDeg: overrides.rotationDeg ?? position.rotationDeg,
    blanketCoverage: overrides.blanketCoverage ?? species.defaultBlanketCoverage,
    color: overrides.color ?? getSleeperColor(type),
  };
};

export const createDefaultSleepers = () => [
  createSleeper('adult', 0, defaultBedSizeId, { name: 'Riley', thermalTendency: 'warm', weightLb: 175 }),
  createSleeper('adult', 1, defaultBedSizeId, { name: 'Jordan', thermalTendency: 'neutral', weightLb: 160 }),
  createSleeper('dog', 2, defaultBedSizeId, { name: 'Bean', breedId: 'labrador', weightLb: 68, thermalTendency: 'warm', rotationDeg: 22 }),
  createSleeper('dog', 3, defaultBedSizeId, { name: 'Poppy', breedId: 'french-bulldog', weightLb: 25, thermalTendency: 'hot', rotationDeg: -18 }),
];
