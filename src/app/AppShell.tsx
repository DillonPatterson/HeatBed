import { BedStage } from '../components/stage/BedStage';
import { ControlPanel } from '../components/controls/ControlPanel';
import { InsightsPanel } from '../components/insights/InsightsPanel';
import type { BedSizeId, EnvironmentState, HeatField, Sleeper, SleeperType, UnitSystem, WorldSegment } from '../types';
import type { RefObject } from 'react';

interface AppShellProps {
  captureRef: RefObject<HTMLDivElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
  bedSizeId: BedSizeId;
  blanketId: string;
  unit: UnitSystem;
  environment: EnvironmentState;
  sleepers: Sleeper[];
  selectedSleeper?: Sleeper;
  selectedSleeperId: string | null;
  worldSegmentsBySleeper: Record<string, WorldSegment[]>;
  heatField: HeatField;
  insights: string[];
  isExporting: boolean;
  onSetBedSizeId: (id: BedSizeId) => void;
  onSetRoomTempF: (value: number) => void;
  onSetBlanketId: (id: string) => void;
  onSetUnit: (unit: UnitSystem) => void;
  onExport: () => void;
  onReset: () => void;
  onSelectSleeper: (id: string) => void;
  onAddSleeper: (type: SleeperType) => void;
  onRemoveSleeper: (id: string) => void;
  onUpdateBasics: (
    id: string,
    patch: Partial<Pick<Sleeper, 'name' | 'weightLb' | 'thermalTendency' | 'blanketCoverage'>>,
  ) => void;
  onSetType: (id: string, type: SleeperType) => void;
  onSetBreed: (id: string, breedId?: string) => void;
  onApplyPosePreset: (id: string, posePresetId: string) => void;
  onSetRotation: (id: string, rotationDeg: number) => void;
  onSetSegmentAngle: (id: string, segmentId: string, angle: number) => void;
  onMoveSleeper: (id: string, point: { x: number; y: number }) => void;
  onRotateSleeper: (id: string, angleDeg: number) => void;
}

export const AppShell = ({
  captureRef,
  svgRef,
  bedSizeId,
  blanketId,
  unit,
  sleepers,
  selectedSleeper,
  selectedSleeperId,
  worldSegmentsBySleeper,
  heatField,
  insights,
  isExporting,
  ...actions
}: AppShellProps) => (
  <div className="mx-auto w-full max-w-[1800px] px-4 py-5 md:px-6 xl:px-8">
    <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="text-[0.72rem] font-semibold uppercase tracking-[0.28em] text-stone-500">Consumer MVP</div>
        <h1 className="font-display text-4xl text-stone-900 md:text-5xl">Bed Heat Simulator</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-stone-600 md:text-base">
          Build the actual household setup, drag everybody into place, and see where the bed turns into a shared toaster.
        </p>
      </div>
      <div className="rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-stone-700 shadow-sm ring-1 ring-stone-200">
        Modeled estimate, not lab instrumentation.
      </div>
    </header>

    <div className="grid gap-5 xl:grid-cols-[23rem_minmax(0,1fr)_21rem]">
      <ControlPanel
        environment={actions.environment}
        bedSizeId={bedSizeId}
        sleepers={sleepers}
        selectedSleeper={selectedSleeper}
        selectedSleeperId={selectedSleeperId}
        hotspotRangeF={heatField.summary.hotspot.absoluteRangeF}
        onSetBedSizeId={actions.onSetBedSizeId}
        onSetRoomTempF={actions.onSetRoomTempF}
        onSetBlanketId={actions.onSetBlanketId}
        onSetUnit={actions.onSetUnit}
        onExport={actions.onExport}
        onReset={actions.onReset}
        isExporting={isExporting}
        onSelectSleeper={actions.onSelectSleeper}
        onAddSleeper={actions.onAddSleeper}
        onRemoveSleeper={actions.onRemoveSleeper}
        onUpdateBasics={actions.onUpdateBasics}
        onSetType={actions.onSetType}
        onSetBreed={actions.onSetBreed}
        onApplyPosePreset={actions.onApplyPosePreset}
        onSetRotation={actions.onSetRotation}
        onSetSegmentAngle={actions.onSetSegmentAngle}
      />

      <BedStage
        captureRef={captureRef}
        svgRef={svgRef}
        bedSizeId={bedSizeId}
        blanketId={blanketId}
        unit={unit}
        sleepers={sleepers}
        selectedSleeperId={selectedSleeperId}
        worldSegmentsBySleeper={worldSegmentsBySleeper}
        heatField={heatField}
        onSelectSleeper={actions.onSelectSleeper}
        onMoveSleeper={actions.onMoveSleeper}
        onRotateSleeper={actions.onRotateSleeper}
        onSegmentAngle={actions.onSetSegmentAngle}
      />

      <InsightsPanel heatField={heatField} insights={insights} unit={unit} />
    </div>
  </div>
);
