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
  onUpdateBasics: (id: string, patch: Partial<Pick<Sleeper, 'name' | 'weightLb' | 'thermalTendency' | 'blanketCoverage'>>) => void;
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
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
    }}
  >
    {/* ── TOP BAR ── */}
    <header
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(12,14,20,0.9)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        gap: '1rem',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Hot icon */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #ff5e1a, #ff8c3a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            boxShadow: '0 0 16px rgba(255,94,26,0.5)',
            flexShrink: 0,
          }}
        >
          🔥
        </div>
        <div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.6rem',
              fontWeight: 900,
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              lineHeight: 1,
              color: 'var(--text-primary)',
            }}
          >
            Bed Heat Simulator
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', letterSpacing: '0.18em', textTransform: 'uppercase', marginTop: 2 }}>
            Thermal field active <span className="blink" style={{ color: 'var(--accent-hot)' }}>■</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        {/* Hotspot readout */}
        <div
          style={{
            background: 'rgba(255,94,26,0.08)',
            border: '1px solid rgba(255,94,26,0.25)',
            borderRadius: 8,
            padding: '0.4rem 0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>Hotspot</span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-hot)' }}>
            {heatField.summary.hotspot.absoluteRangeF.minF}–{heatField.summary.hotspot.absoluteRangeF.maxF}°{actions.environment.unit}
          </span>
        </div>

        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 8,
            padding: '0.4rem 0.85rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.68rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.08em',
          }}
        >
          Modeled estimate · not lab data
        </div>
      </div>
    </header>

    {/* ── MAIN CONTENT ── */}
    <main
      style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '280px minmax(0,1fr) 280px',
        gap: '1px',
        background: 'rgba(255,255,255,0.04)',
        overflow: 'hidden',
      }}
    >
      {/* Left column */}
      <div
        style={{
          background: 'var(--bg-surface)',
          overflowY: 'auto',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
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
      </div>

      {/* Center: Bed stage */}
      <div
        style={{
          background: 'var(--bg-base)',
          display: 'flex',
          flexDirection: 'column',
          padding: '1.25rem',
          gap: '1rem',
        }}
      >
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
      </div>

      {/* Right column */}
      <div
        style={{
          background: 'var(--bg-surface)',
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        <InsightsPanel heatField={heatField} insights={insights} unit={unit} />
      </div>
    </main>
  </div>
);
