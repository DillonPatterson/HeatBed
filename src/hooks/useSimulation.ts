import { useMemo } from 'react';
import { blanketProfiles } from '../data/blankets/blankets';
import { generateInsights } from '../simulation/insights/generateInsights';
import { buildWorldSegments } from '../simulation/kinematics/forwardKinematics';
import { resolveSleeperPreset } from '../simulation/presets/resolveSleeperPreset';
import { runHeatSimulation } from '../simulation/thermal/heatEngine';
import type { BedSizeId, SimulationResult, Sleeper } from '../types';

export const useSimulation = ({
  sleepers,
  bedSizeId,
  roomTempF,
  blanketId,
}: {
  sleepers: Sleeper[];
  bedSizeId: BedSizeId;
  roomTempF: number;
  blanketId: string;
}): SimulationResult =>
  useMemo(() => {
    const worldSegmentsBySleeper = Object.fromEntries(
      sleepers.map((sleeper) => {
        const resolved = resolveSleeperPreset(sleeper);
        return [sleeper.id, buildWorldSegments(sleeper, resolved)];
      }),
    );

    const heatField = runHeatSimulation({
      sleepers,
      bedSizeId,
      roomTempF,
      blanketId,
      worldSegmentsBySleeper,
    });
    const blanket = blanketProfiles.find((candidate) => candidate.id === blanketId) ?? blanketProfiles[0];

    return {
      worldSegmentsBySleeper,
      heatField,
      insights: generateInsights({ sleepers, heatField, blanket }),
    };
  }, [bedSizeId, blanketId, roomTempF, sleepers]);
