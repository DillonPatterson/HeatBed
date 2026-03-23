import { blanketProfiles } from '../../data/blankets/blankets';
import { bedSizes } from '../../data/beds/bedSizes';
import { formatRange, toCelsius } from '../../lib/units';
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
  <Panel title="Bed + Environment" eyebrow="Setup">
    <div className="space-y-4 text-sm text-stone-700">
      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Bed size</span>
        <select value={bedSizeId} onChange={(event) => onSetBedSizeId(event.target.value as BedSizeId)} className="field">
          {bedSizes.map((bed) => (
            <option key={bed.id} value={bed.id}>
              {bed.label} · {bed.widthIn}" x {bed.lengthIn}" · {bed.marketName}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
          <span>Room temperature</span>
          <span>{Math.round(environment.roomTempF)}°F / {Math.round(toCelsius(environment.roomTempF))}°C</span>
        </div>
        <input type="range" min={58} max={78} value={environment.roomTempF} onChange={(event) => onSetRoomTempF(Number(event.target.value))} className="w-full accent-amber-700" />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Blanket type</span>
        <select value={environment.blanketId} onChange={(event) => onSetBlanketId(event.target.value)} className="field">
          {blanketProfiles.map((blanket) => (
            <option key={blanket.id} value={blanket.id}>
              {blanket.label} · {blanket.note}
            </option>
          ))}
        </select>
      </label>

      <div>
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Display unit</span>
        <div className="inline-flex rounded-full bg-stone-100 p-1">
          {(['F', 'C'] as const).map((unit) => (
            <button
              key={unit}
              type="button"
              onClick={() => onSetUnit(unit)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${environment.unit === unit ? 'bg-stone-900 text-white' : 'text-stone-600'}`}
            >
              °{unit}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-[1.1rem] bg-amber-50 px-4 py-3 text-stone-800">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Quick read</div>
        <div className="mt-1 font-display text-lg">{formatRange(hotspotRangeF, environment.unit)}</div>
        <p className="mt-1 text-sm text-stone-600">Warmest modeled zone right now.</p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button type="button" onClick={onExport} className="action-btn bg-stone-900 text-white">
          {isExporting ? 'Exporting...' : 'Export image'}
        </button>
        <button type="button" onClick={onReset} className="action-btn bg-stone-100 text-stone-800">
          Reset demo
        </button>
      </div>
    </div>
  </Panel>
);
