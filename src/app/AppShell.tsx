import type { RefObject } from 'react';
import { ControlPanel } from '../components/controls/ControlPanel';
import { InsightsPanel } from '../components/insights/InsightsPanel';
import { BedStage } from '../components/stage/BedStage';
import { formatRange, toCelsius } from '../lib/units';
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
  sleepers,
  selectedSleeper,
  selectedSleeperId,
  worldSegmentsBySleeper,
  heatField,
  insights,
  isExporting,
  ...actions
}: AppShellProps) => {
  const ambientLabel =
    actions.environment.unit === 'F'
      ? `${Math.round(actions.environment.roomTempF)}F`
      : `${Math.round(toCelsius(actions.environment.roomTempF))}C`;

  return (
    <div className="app-shell">
      <header className="app-hero">
        <div>
          <div className="hero-kicker">shared bed drama, visualized</div>
          <h1 className="hero-title">Bed Heat Simulator</h1>
          <p className="hero-copy">
            Build the whole sleep mess, drag everybody into place, and watch the mattress reveal
            who is turning the bed into a furnace.
          </p>
        </div>

        <div className="hero-badges">
          <div className="hero-badge hero-badge-hot">
            Hot side {formatRange(heatField.summary.hotspot.absoluteRangeF, unit)}
          </div>
          <div className="hero-badge">Room {ambientLabel}</div>
          <div className="hero-badge">
            {sleepers.length} sleeper{sleepers.length === 1 ? '' : 's'}
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="stage-hero">
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
        </section>

        <section className="secondary-grid">
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

          <InsightsPanel heatField={heatField} insights={insights} unit={unit} />
        </section>
      </main>
    </div>
  );
};
