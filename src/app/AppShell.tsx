import type { RefObject } from 'react';
import { BedEnvironmentCard } from '../components/controls/BedEnvironmentCard';
import { SelectedSleeperCard } from '../components/controls/SelectedSleeperCard';
import { SleeperListCard } from '../components/controls/SleeperListCard';
import { InsightsPanel } from '../components/insights/InsightsPanel';
import { BedStage } from '../components/stage/BedStage';
import { formatRange } from '../lib/units';
import type {
  BedSizeId,
  EnvironmentState,
  HeatField,
  Sleeper,
  SleeperType,
  UnitSystem,
  WorldSegment,
} from '../types';

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
  environment,
  sleepers,
  selectedSleeper,
  selectedSleeperId,
  worldSegmentsBySleeper,
  heatField,
  insights,
  isExporting,
  onSetBedSizeId,
  onSetRoomTempF,
  onSetBlanketId,
  onSetUnit,
  onExport,
  onReset,
  onSelectSleeper,
  onAddSleeper,
  onRemoveSleeper,
  onUpdateBasics,
  onSetType,
  onSetBreed,
  onApplyPosePreset,
  onSetRotation,
  onSetSegmentAngle,
  onMoveSleeper,
  onRotateSleeper,
}: AppShellProps) => (
  <div className="app-shell">
    <header className="app-header">
      <div className="app-logo">
        <div className="app-logo-icon">~</div>
        <div>
          <div className="app-logo-name">Bed Heat Simulator</div>
          <div className="app-logo-sub">build the overheated bed</div>
        </div>
      </div>

      <div className="header-right">
        <div className="badge badge-hot">
          hotspot {formatRange(heatField.summary.hotspot.absoluteRangeF, unit)}
        </div>
        <div className="unit-toggle">
          {(['F', 'C'] as const).map((nextUnit) => (
            <button
              key={nextUnit}
              type="button"
              className={unit === nextUnit ? 'is-active' : ''}
              onClick={() => onSetUnit(nextUnit)}
            >
              {nextUnit}
            </button>
          ))}
        </div>
        <button type="button" className="btn btn-ghost" onClick={onExport}>
          {isExporting ? 'Exporting' : 'Export'}
        </button>
        <button type="button" className="btn btn-ghost" onClick={onReset}>
          Reset
        </button>
      </div>
    </header>

    <aside className="app-sidebar">
      <BedEnvironmentCard
        environment={environment}
        bedSizeId={bedSizeId}
        hotspotRangeF={heatField.summary.hotspot.absoluteRangeF}
        onSetBedSizeId={onSetBedSizeId}
        onSetRoomTempF={onSetRoomTempF}
        onSetBlanketId={onSetBlanketId}
        onSetUnit={onSetUnit}
      />
      <SleeperListCard
        sleepers={sleepers}
        selectedSleeperId={selectedSleeperId}
        onSelectSleeper={onSelectSleeper}
        onAddSleeper={onAddSleeper}
        onRemoveSleeper={onRemoveSleeper}
      />
      <SelectedSleeperCard
        sleeper={selectedSleeper}
        onUpdateBasics={onUpdateBasics}
        onSetType={onSetType}
        onSetBreed={onSetBreed}
        onApplyPosePreset={onApplyPosePreset}
        onSetRotation={onSetRotation}
        onSetSegmentAngle={onSetSegmentAngle}
      />
      <InsightsPanel heatField={heatField} insights={insights} unit={unit} />
    </aside>

    <main className="app-stage">
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
        onSelectSleeper={onSelectSleeper}
        onMoveSleeper={onMoveSleeper}
        onRotateSleeper={onRotateSleeper}
        onSegmentAngle={onSetSegmentAngle}
      />
    </main>
  </div>
);
