import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { defaultBedSizeId, defaultEnvironment } from '../features/environment/defaults';
import { getBedSize } from '../features/bed/bedUtils';
import { createDefaultSleepers, createSleeper } from '../features/sleepers/sleeperFactory';
import { clamp } from '../lib/geometry';
import { getDefaultBreedId, getPosePreset, getSpeciesProfile } from '../simulation/presets/resolveSleeperPreset';
import type { BedSizeId, Point, Sleeper, SleeperType, UnitSystem } from '../types';

interface AppState {
  bedSizeId: BedSizeId;
  environment: ReturnType<typeof defaultEnvironment>;
  sleepers: Sleeper[];
  selectedSleeperId: string | null;
  addSleeper: (type: SleeperType) => void;
  removeSleeper: (id: string) => void;
  selectSleeper: (id: string | null) => void;
  setBedSizeId: (bedSizeId: BedSizeId) => void;
  setRoomTempF: (value: number) => void;
  setBlanketId: (blanketId: string) => void;
  setUnit: (unit: UnitSystem) => void;
  updateSleeperBasics: (
    id: string,
    patch: Partial<Pick<Sleeper, 'name' | 'weightLb' | 'thermalTendency' | 'blanketCoverage'>>,
  ) => void;
  setSleeperType: (id: string, type: SleeperType) => void;
  setSleeperBreed: (id: string, breedId?: string) => void;
  applyPosePreset: (id: string, posePresetId: string) => void;
  setSegmentAngle: (id: string, segmentId: string, angle: number) => void;
  setSleeperPosition: (id: string, root: Point) => void;
  setSleeperRotation: (id: string, rotationDeg: number) => void;
  resetDemo: () => void;
}

const clampSleeperWeight = (weightLb: number, type: SleeperType) => {
  const profile = getSpeciesProfile(type);
  return clamp(weightLb, profile.weightRange[0], profile.weightRange[1]);
};

const buildDefaultState = () => ({
  bedSizeId: defaultBedSizeId,
  environment: defaultEnvironment(),
  sleepers: createDefaultSleepers(),
  selectedSleeperId: null as string | null,
});

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      ...buildDefaultState(),
      addSleeper: (type) =>
        set((state) => {
          if (state.sleepers.length >= 8) return state;
          const sleeper = createSleeper(type, state.sleepers.length, state.bedSizeId);
          return {
            ...state,
            sleepers: [...state.sleepers, sleeper],
            selectedSleeperId: sleeper.id,
          };
        }),
      removeSleeper: (id) =>
        set((state) => {
          const sleepers = state.sleepers.filter((sleeper) => sleeper.id !== id);
          return {
            ...state,
            sleepers,
            selectedSleeperId:
              state.selectedSleeperId === id ? sleepers[0]?.id ?? null : state.selectedSleeperId,
          };
        }),
      selectSleeper: (id) => set((state) => ({ ...state, selectedSleeperId: id })),
      setBedSizeId: (bedSizeId) =>
        set((state) => {
          const bed = getBedSize(bedSizeId);
          return {
            ...state,
            bedSizeId,
            sleepers: state.sleepers.map((sleeper) => ({
              ...sleeper,
              root: {
                x: clamp(sleeper.root.x, 2.5, bed.widthIn - 2.5),
                y: clamp(sleeper.root.y, 2.5, bed.lengthIn - 2.5),
              },
            })),
          };
        }),
      setRoomTempF: (value) =>
        set((state) => ({ ...state, environment: { ...state.environment, roomTempF: value } })),
      setBlanketId: (blanketId) =>
        set((state) => ({ ...state, environment: { ...state.environment, blanketId } })),
      setUnit: (unit) =>
        set((state) => ({ ...state, environment: { ...state.environment, unit } })),
      updateSleeperBasics: (id, patch) =>
        set((state) => ({
          ...state,
          sleepers: state.sleepers.map((sleeper) =>
            sleeper.id === id
              ? {
                  ...sleeper,
                  ...patch,
                  weightLb:
                    patch.weightLb !== undefined
                      ? clampSleeperWeight(patch.weightLb, sleeper.type)
                      : sleeper.weightLb,
                }
              : sleeper,
          ),
        })),
      setSleeperType: (id, type) =>
        set((state) => ({
          ...state,
          sleepers: state.sleepers.map((sleeper) => {
            if (sleeper.id !== id) return sleeper;
            const species = getSpeciesProfile(type);
            const pose = getPosePreset(type, species.defaultPosePresetId);
            return {
              ...sleeper,
              type,
              breedId: getDefaultBreedId(type),
              weightLb: clampSleeperWeight(species.defaultWeightLb, type),
              blanketCoverage: species.defaultBlanketCoverage,
              posePresetId: pose.id,
              poseState: { ...pose.segmentAngles },
              color: species.palette.body,
            };
          }),
        })),
      setSleeperBreed: (id, breedId) =>
        set((state) => ({
          ...state,
          sleepers: state.sleepers.map((sleeper) =>
            sleeper.id === id ? { ...sleeper, breedId: breedId ?? sleeper.breedId } : sleeper,
          ),
        })),
      applyPosePreset: (id, posePresetId) =>
        set((state) => ({
          ...state,
          sleepers: state.sleepers.map((sleeper) =>
            sleeper.id === id
              ? {
                  ...sleeper,
                  posePresetId,
                  poseState: { ...getPosePreset(sleeper.type, posePresetId).segmentAngles },
                }
              : sleeper,
          ),
        })),
      setSegmentAngle: (id, segmentId, angle) =>
        set((state) => ({
          ...state,
          sleepers: state.sleepers.map((sleeper) =>
            sleeper.id === id
              ? {
                  ...sleeper,
                  poseState: {
                    ...sleeper.poseState,
                    [segmentId]: angle,
                  },
                }
              : sleeper,
          ),
        })),
      setSleeperPosition: (id, root) =>
        set((state) => {
          const bed = getBedSize(state.bedSizeId);
          return {
            ...state,
            sleepers: state.sleepers.map((sleeper) =>
              sleeper.id === id
                ? {
                    ...sleeper,
                    root: {
                      x: clamp(root.x, 2.5, bed.widthIn - 2.5),
                      y: clamp(root.y, 2.5, bed.lengthIn - 2.5),
                    },
                  }
                : sleeper,
            ),
          };
        }),
      setSleeperRotation: (id, rotationDeg) =>
        set((state) => ({
          ...state,
          sleepers: state.sleepers.map((sleeper) =>
            sleeper.id === id ? { ...sleeper, rotationDeg } : sleeper,
          ),
        })),
      resetDemo: () =>
        set(() => {
          const defaults = buildDefaultState();
          return { ...defaults, selectedSleeperId: defaults.sleepers[0]?.id ?? null };
        }),
    }),
    {
      name: 'bed-heat-simulator',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        bedSizeId: state.bedSizeId,
        environment: state.environment,
        sleepers: state.sleepers,
        selectedSleeperId: state.selectedSleeperId,
      }),
    },
  ),
);
