import { dogBreeds } from '../../data/breeds/dogBreeds';
import { catPresets } from '../../data/species/catPresets';
import { speciesProfiles } from '../../data/species/speciesProfiles';
import type { BreedProfile, PosePreset, ResolvedSleeperProfile, Sleeper, SleeperType, SpeciesProfile } from '../../types';

export const getSpeciesProfile = (type: SleeperType): SpeciesProfile => speciesProfiles[type];

export const getBreedOptions = (type: SleeperType): BreedProfile[] => {
  if (type === 'dog') return dogBreeds;
  if (type === 'cat') return catPresets;
  return [];
};

export const getDefaultBreedId = (type: SleeperType) => {
  if (type === 'dog') return dogBreeds.find((breed) => breed.id === 'mixed-medium')?.id ?? dogBreeds[0]?.id;
  if (type === 'cat') return catPresets.find((preset) => preset.id === 'medium-shorthair')?.id ?? catPresets[0]?.id;
  return undefined;
};

export const getPosePreset = (type: SleeperType, posePresetId: string): PosePreset => {
  const species = getSpeciesProfile(type);
  return (
    species.posePresets.find((pose) => pose.id === posePresetId) ??
    species.posePresets.find((pose) => pose.id === species.defaultPosePresetId) ??
    species.posePresets[0]
  );
};

export const resolveSleeperPreset = (sleeper: Sleeper): ResolvedSleeperProfile => {
  const species = getSpeciesProfile(sleeper.type);
  const breed = getBreedOptions(sleeper.type).find((candidate) => candidate.id === sleeper.breedId);

  return {
    species,
    breed,
    lengthMultiplier: breed?.lengthMultiplier ?? 1,
    widthMultiplier: breed?.widthMultiplier ?? 1,
    heatMultiplier: breed?.heatMultiplier ?? 1,
    spreadMultiplier: breed?.spreadMultiplier ?? 1,
    defaultWeightLb: breed?.defaultWeightLb ?? species.defaultWeightLb,
  };
};
