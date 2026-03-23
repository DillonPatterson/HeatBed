import { formatDeltaRange, formatDualRange } from '../../lib/units';
import { Panel } from '../shared/Panel';
import type { HeatField, UnitSystem } from '../../types';

interface InsightsPanelProps {
  heatField: HeatField;
  insights: string[];
  unit: UnitSystem;
}

export const InsightsPanel = ({ heatField, insights, unit }: InsightsPanelProps) => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>

    {/* Thermal summary */}
    <Panel title="Thermal Readout" eyebrow="Output" accent="hot">

      {/* Hotspot */}
      <div
        style={{
          borderRadius: 10,
          background: 'var(--bg-base)',
          border: '1px solid rgba(255,94,26,0.25)',
          padding: '0.9rem',
          marginBottom: '0.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: 2,
            background: 'linear-gradient(90deg, var(--accent-hot), var(--accent-warm))',
          }}
        />
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.3rem' }}>
          🔴 Warmest zone
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 900, letterSpacing: '0.02em', color: 'var(--accent-hot)', lineHeight: 1, textTransform: 'uppercase' }}>
          {formatDualRange(heatField.summary.hotspot.absoluteRangeF, unit)}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.68rem', color: 'rgba(255,170,68,0.8)', marginTop: '0.3rem' }}>
          {formatDeltaRange(heatField.summary.hotspot.deltaRangeF, unit)}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.3rem' }}>
          {heatField.summary.hotspot.zoneLabel}
        </div>
      </div>

      {/* Coolspot */}
      <div
        style={{
          borderRadius: 10,
          background: 'var(--bg-base)',
          border: '1px solid rgba(46,184,255,0.18)',
          padding: '0.9rem',
          marginBottom: '0.5rem',
        }}
      >
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '0.3rem' }}>
          🔵 Coolest zone
        </div>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '0.02em', color: 'var(--accent-cold)', lineHeight: 1, textTransform: 'uppercase' }}>
          {formatDualRange(heatField.summary.coolspot.absoluteRangeF, unit)}
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: '0.3rem' }}>
          {heatField.summary.coolspot.zoneLabel}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
        <div
          style={{
            borderRadius: 8,
            background: 'var(--bg-base)',
            border: '1px solid var(--border)',
            padding: '0.65rem',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 2 }}>
            Avg lift
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-warm)' }}>
            +{heatField.summary.averageDeltaF}°F
          </div>
        </div>
        <div
          style={{
            borderRadius: 8,
            background: heatField.summary.overlapCount > 0 ? 'rgba(255,94,26,0.06)' : 'var(--bg-base)',
            border: `1px solid ${heatField.summary.overlapCount > 4 ? 'rgba(255,94,26,0.3)' : 'var(--border)'}`,
            padding: '0.65rem',
          }}
        >
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em', marginBottom: 2 }}>
            Contacts
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.95rem', fontWeight: 700, color: heatField.summary.overlapCount > 4 ? 'var(--accent-hot)' : 'var(--text-secondary)' }}>
            {Math.round(heatField.summary.overlapCount)}
          </div>
        </div>
      </div>
    </Panel>

    {/* Insights */}
    <Panel title="Analysis" eyebrow="Insights" accent="cool">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {insights.map((insight, i) => (
          <div
            key={insight}
            style={{
              borderRadius: 8,
              background: 'var(--bg-base)',
              border: '1px solid var(--border)',
              padding: '0.75rem',
              display: 'flex',
              gap: '0.6rem',
              alignItems: 'flex-start',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.62rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                marginTop: 1,
                flexShrink: 0,
              }}
            >
              {String(i + 1).padStart(2, '0')}
            </div>
            <div
              style={{
                fontSize: '0.8rem',
                lineHeight: 1.5,
                color: 'var(--text-secondary)',
              }}
            >
              {insight}
            </div>
          </div>
        ))}
      </div>
    </Panel>

    {/* Interaction hints */}
    <Panel title="Controls" eyebrow="How to use" accent="neutral">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {[
          ['Drag body', 'Move sleeper on the bed'],
          ['Top handle', 'Rotate the entire figure'],
          ['Joint dots', 'Bend individual limbs'],
          ['Pose presets', 'Quick position snap'],
        ].map(([action, desc]) => (
          <div key={action} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                fontWeight: 700,
                color: 'var(--accent-warm)',
                background: 'rgba(255,170,68,0.08)',
                border: '1px solid rgba(255,170,68,0.2)',
                borderRadius: 5,
                padding: '0.15rem 0.45rem',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                flexShrink: 0,
              }}
            >
              {action}
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)' }}>
              {desc}
            </div>
          </div>
        ))}
      </div>
    </Panel>
  </div>
);
