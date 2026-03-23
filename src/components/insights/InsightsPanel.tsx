import { formatDeltaRange, formatDualRange } from '../../lib/units';
import { Panel } from '../shared/Panel';
import type { HeatField, UnitSystem } from '../../types';

interface InsightsPanelProps {
  heatField: HeatField;
  insights: string[];
  unit: UnitSystem;
}

export const InsightsPanel = ({ heatField, insights, unit }: InsightsPanelProps) => (
  <Panel title="The verdict" eyebrow="quick read" accent="cool">
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
      <div className="stat-grid">
        <div className="stat-box">
          <div className="tiny-label">Warmest</div>
          <div className="stat-value hot">{formatDualRange(heatField.summary.hotspot.absoluteRangeF, unit)}</div>
          <div className="helper-line">{heatField.summary.hotspot.zoneLabel}</div>
        </div>

        <div className="stat-box">
          <div className="tiny-label">Coolest</div>
          <div className="stat-value cool">{formatDualRange(heatField.summary.coolspot.absoluteRangeF, unit)}</div>
          <div className="helper-line">{heatField.summary.coolspot.zoneLabel}</div>
        </div>

        <div className="stat-box">
          <div className="tiny-label">Contact</div>
          <div className="stat-value">{Math.round(heatField.summary.overlapCount)} boosts</div>
          <div className="helper-line">{formatDeltaRange(heatField.summary.hotspot.deltaRangeF, unit)}</div>
        </div>
      </div>

      <div className="insight-list">
        {insights.map((insight, index) => (
          <div key={insight} className="insight-item">
            <div className="mini-tag">{String(index + 1).padStart(2, '0')}</div>
            <div style={{ lineHeight: 1.45 }}>{insight}</div>
          </div>
        ))}
      </div>

      <div className="helper-line">
        Drag first. Fine tune later. Screenshot it when the layout starts looking incriminating.
      </div>
    </div>
  </Panel>
);
