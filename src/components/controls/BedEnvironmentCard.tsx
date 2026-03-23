import { blanketProfiles } from '../../data/blankets/blankets';
import { bedSizes } from '../../data/beds/bedSizes';
import { toCelsius } from '../../lib/units';
import { Panel } from '../shared/Panel';
import type { BedSizeId, EnvironmentState, TemperatureRangeF, UnitSystem } from '../../types';

interface BedEnvironmentCardProps {
  environment: EnvironmentState;
  bedSizeId: BedSizeId;
  hotspotRangeF: TemperatureRangeF;
  onSetBedSizeId: (id: BedSizeId) => void;
  onSetRoomTempF: (roomTempF: number) => void;
  onSetBlanketId: (blanketId: string) => void;
  onSetUnit: (unit: UnitSystem) => void;
  onExport: () => void;
  onReset: () => void;
  isExporting: boolean;
}

export const BedEnvironmentCard = ({
  environment,
  bedSizeId,
  hotspotRangeF,
  onSetBedSizeId,
  onSetRoomTempF,
  onSetBlanketId,
  onSetUnit,
  onExport,
  onReset,
  isExporting,
}: BedEnvironmentCardProps) => (
  <Panel title="Environment" eyebrow="Setup" accent="neutral">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>

      {/* Hotspot display */}
      <div
        style={{
          border: '1px solid rgba(255,94,26,0.3)',
          borderRadius: 10,
          background: 'rgba(255,94,26,0.06)',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.5rem',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: 2 }}>
            Hotspot est.
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.15rem', fontWeight: 700, color: 'var(--accent-hot)', letterSpacing: '0.02em' }}>
            {hotspotRangeF.minF}–{hotspotRangeF.maxF}°{environment.unit}
          </div>
        </div>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,94,26,0.6) 0%, rgba(255,94,26,0.1) 60%, transparent 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
          }}
        >
          🌡️
        </div>
      </div>

      <label style={{ display: 'block' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.35rem' }}>
          Bed size
        </div>
        <select value={bedSizeId} onChange={(e) => onSetBedSizeId(e.target.value as BedSizeId)} className="field">
          {bedSizes.map((bed) => (
            <option key={bed.id} value={bed.id}>
              {bed.label} — {bed.marketName}
            </option>
          ))}
        </select>
      </label>

      <label style={{ display: 'block' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            Room temp
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cool)' }}>
            {Math.round(environment.roomTempF)}°F / {Math.round(toCelsius(environment.roomTempF))}°C
          </span>
        </div>
        <input
          type="range"
          min={58}
          max={78}
          value={environment.roomTempF}
          onChange={(e) => onSetRoomTempF(Number(e.target.value))}
          style={{ '--range-fill': `${((environment.roomTempF - 58) / 20) * 100}%` } as React.CSSProperties}
        />
      </label>

      <label style={{ display: 'block' }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.35rem' }}>
          Blanket type
        </div>
        <select value={environment.blanketId} onChange={(e) => onSetBlanketId(e.target.value)} className="field">
          {blanketProfiles.map((blanket) => (
            <option key={blanket.id} value={blanket.id}>
              {blanket.label}
            </option>
          ))}
        </select>
      </label>

      {/* Unit toggle */}
      <div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.4rem' }}>
          Unit
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 4,
            background: 'var(--bg-base)',
            borderRadius: 8,
            padding: 4,
            border: '1px solid var(--border)',
          }}
        >
          {(['F', 'C'] as const).map((u) => (
            <button
              key={u}
              type="button"
              onClick={() => onSetUnit(u)}
              style={{
                borderRadius: 6,
                padding: '0.45rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                transition: 'all 120ms ease',
                background: environment.unit === u ? 'var(--accent-warm)' : 'transparent',
                color: environment.unit === u ? '#0c0e14' : 'var(--text-secondary)',
                border: 'none',
                cursor: 'pointer',
                boxShadow: environment.unit === u ? '0 0 12px rgba(255,170,68,0.4)' : 'none',
              }}
            >
              °{u}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', paddingTop: '0.25rem' }}>
        <button
          type="button"
          onClick={onExport}
          className="action-btn"
          style={{
            background: 'var(--accent-hot)',
            color: '#fff',
            border: 'none',
            boxShadow: '0 0 16px rgba(255,94,26,0.35)',
          }}
        >
          {isExporting ? '...' : '⬇ Export'}
        </button>
        <button
          type="button"
          onClick={onReset}
          className="action-btn"
          style={{
            background: 'var(--bg-raised)',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border)',
          }}
        >
          ↺ Reset
        </button>
      </div>
    </div>
  </Panel>
);
