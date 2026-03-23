import { formatDeltaRange, formatDualRange } from '../../lib/units';
import { Panel } from '../shared/Panel';
import type { HeatField, UnitSystem } from '../../types';

interface InsightsPanelProps {
  heatField: HeatField;
  insights: string[];
  unit: UnitSystem;
}

export const InsightsPanel = ({ heatField, insights, unit }: InsightsPanelProps) => (
  <div className="space-y-4">
    <Panel title="What The Bed Is Saying" eyebrow="Insights">
      <div className="space-y-3">
        {insights.map((insight) => (
          <div key={insight} className="rounded-[1.1rem] bg-stone-100 px-4 py-3 text-sm leading-6 text-stone-700">
            {insight}
          </div>
        ))}
      </div>
    </Panel>

    <Panel title="Thermal Summary" eyebrow="Output">
      <div className="grid gap-3">
        <div className="rounded-[1.1rem] bg-stone-950 px-4 py-4 text-white">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-400">Warmest zone</div>
          <div className="mt-1 font-display text-xl">{formatDualRange(heatField.summary.hotspot.absoluteRangeF, unit)}</div>
          <div className="mt-1 text-sm text-stone-300">{formatDeltaRange(heatField.summary.hotspot.deltaRangeF, unit)}</div>
        </div>
        <div className="rounded-[1.1rem] bg-white/80 px-4 py-4 text-stone-800">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Coolest zone</div>
          <div className="mt-1 font-display text-xl">{formatDualRange(heatField.summary.coolspot.absoluteRangeF, unit)}</div>
          <div className="mt-1 text-sm text-stone-600">{heatField.summary.coolspot.zoneLabel}</div>
        </div>
        <div className="rounded-[1.1rem] bg-amber-50 px-4 py-4 text-stone-800">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Average lift</div>
          <div className="mt-1 font-display text-xl">~{heatField.summary.averageDeltaF}°F above ambient</div>
          <div className="mt-1 text-sm text-stone-600">{Math.round(heatField.summary.overlapCount)} contact boosts detected.</div>
        </div>
      </div>
    </Panel>
  </div>
);
