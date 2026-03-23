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
}

export const BedEnvironmentCard = ({
  environment,
  bedSizeId,
  hotspotRangeF,
  onSetBedSizeId,
  onSetRoomTempF,
  onSetBlanketId,
  onSetUnit,
}: BedEnvironmentCardProps) => (
  <Panel
    title="Setup"
    eyebrow="quick setup"
    accent="hot"
    actions={<div className="badge badge-hot">est. {formatRange(hotspotRangeF, environment.unit)}</div>}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div className="helper-line">Pick the mattress, pick the blanket, then start dropping bodies.</div>

      <div className="mini-grid">
        <label>
          <div className="tiny-label">Bed</div>
          <select value={bedSizeId} onChange={(event) => onSetBedSizeId(event.target.value as BedSizeId)} className="field">
            {bedSizes.map((bed) => (
              <option key={bed.id} value={bed.id}>
                {bed.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          <div className="tiny-label">Blanket</div>
          <select value={environment.blanketId} onChange={(event) => onSetBlanketId(event.target.value)} className="field">
            {blanketProfiles.map((blanket) => (
              <option key={blanket.id} value={blanket.id}>
                {blanket.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <details className="details-shell">
        <summary>Room temp and units</summary>
        <div className="details-body">
          <label style={{ display: 'block' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.4rem' }}>
              <span className="tiny-label">Room temp</span>
              <span className="helper-line">
                {Math.round(environment.roomTempF)}F / {Math.round(toCelsius(environment.roomTempF))}C
              </span>
            </div>
            <input
              type="range"
              min={58}
              max={78}
              value={environment.roomTempF}
              onChange={(event) => onSetRoomTempF(Number(event.target.value))}
            />
          </label>

          <div>
            <div className="tiny-label" style={{ marginBottom: '0.45rem' }}>
              Unit
            </div>
            <div className="segmented">
              {(['F', 'C'] as const).map((nextUnit) => (
                <button
                  key={nextUnit}
                  type="button"
                  className={environment.unit === nextUnit ? 'is-active' : ''}
                  onClick={() => onSetUnit(nextUnit)}
                >
                  {nextUnit}
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>
    </div>
  </Panel>
);
