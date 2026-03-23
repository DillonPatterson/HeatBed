import type { RefObject } from 'react';
import { blanketProfiles } from '../../data/blankets/blankets';
import { bedSizes } from '../../data/beds/bedSizes';
import { formatDualRange, formatRange } from '../../lib/units';
import type { BedSizeId, HeatField, Sleeper, UnitSystem, WorldSegment } from '../../types';
import { SleeperFigure } from '../figures/SleeperFigure';
import { HeatMapCanvas } from './HeatMapCanvas';

interface BedStageProps {
  captureRef: RefObject<HTMLDivElement | null>;
  svgRef: RefObject<SVGSVGElement | null>;
  bedSizeId: BedSizeId;
  blanketId: string;
  unit: UnitSystem;
  sleepers: Sleeper[];
  selectedSleeperId: string | null;
  worldSegmentsBySleeper: Record<string, WorldSegment[]>;
  heatField: HeatField;
  onSelectSleeper: (id: string) => void;
  onMoveSleeper: (id: string, point: { x: number; y: number }) => void;
  onRotateSleeper: (id: string, angleDeg: number) => void;
  onSegmentAngle: (id: string, segmentId: string, angle: number) => void;
}

export const BedStage = ({
  captureRef,
  svgRef,
  bedSizeId,
  blanketId,
  unit,
  sleepers,
  selectedSleeperId,
  worldSegmentsBySleeper,
  heatField,
  onSelectSleeper,
  onMoveSleeper,
  onRotateSleeper,
  onSegmentAngle,
}: BedStageProps) => {
  const bed = bedSizes.find((candidate) => candidate.id === bedSizeId) ?? bedSizes[2];
  const blanket = blanketProfiles.find((candidate) => candidate.id === blanketId) ?? blanketProfiles[0];
  const selectedSleeper = sleepers.find((sleeper) => sleeper.id === selectedSleeperId);

  return (
    <div ref={captureRef} className="stage-shell">
      <div className="stage-top">
        <div>
          <div className="hero-kicker">build the overheated bed</div>
          <h2 className="stage-title">Drag sleepers around and watch the hot side take shape.</h2>
          <p className="stage-copy">
            People, kids, dogs, cats. Spread them out for a truce or stack them up until the bed
            starts feeling unfair.
          </p>
        </div>

        <div className="stage-chip-row">
          <div className="hero-badge hero-badge-hot">
            Hot {formatRange(heatField.summary.hotspot.absoluteRangeF, unit)}
          </div>
          <div className="hero-badge">{blanket.label}</div>
          <div className="hero-badge">
            {sleepers.length} sleeper{sleepers.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      <div className="stage-scene">
        <div className="bed-shell">
          <div style={{ width: 'min(100%, 1040px)', maxHeight: '100%' }}>
            <div className="bed-mattress" style={{ aspectRatio: `${bed.widthIn} / ${bed.lengthIn}` }}>
              <div className="bed-pillows">
                <div className="bed-pillow" />
                <div className="bed-pillow" />
              </div>

              <div className="bed-grid" />
              <HeatMapCanvas heatField={heatField} blanket={blanket} />

              <svg
                ref={svgRef}
                viewBox={`0 0 ${bed.widthIn} ${bed.lengthIn}`}
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                }}
                role="img"
                aria-label="Interactive bed stage"
              >
                {sleepers.map((sleeper) => (
                  <SleeperFigure
                    key={sleeper.id}
                    sleeper={sleeper}
                    segments={worldSegmentsBySleeper[sleeper.id] ?? []}
                    svgRef={svgRef}
                    bedWidthIn={bed.widthIn}
                    bedLengthIn={bed.lengthIn}
                    selected={selectedSleeperId === sleeper.id}
                    onSelect={() => onSelectSleeper(sleeper.id)}
                    onMove={(point) => onMoveSleeper(sleeper.id, point)}
                    onRotate={(angleDeg) => onRotateSleeper(sleeper.id, angleDeg)}
                    onSegmentAngle={(segmentId, angle) => onSegmentAngle(sleeper.id, segmentId, angle)}
                  />
                ))}
              </svg>

              <div className="bed-size-label">
                {bed.label} {bed.widthIn}" x {bed.lengthIn}"
              </div>
            </div>
          </div>
        </div>

        <div className="stage-floating">
          <div className="overlay-card">
            <div className="tiny-label">Warmest patch</div>
            <div className="mini-headline">{formatDualRange(heatField.summary.hotspot.absoluteRangeF, unit)}</div>
            <div className="helper-line">{heatField.summary.hotspot.zoneLabel}</div>
          </div>

          <div className="overlay-card overlay-card-wide">
            <div className="tiny-label">
              {selectedSleeper ? `Selected: ${selectedSleeper.name}` : 'Quick tip'}
            </div>
            <div className="helper-line">
              Drag a body to move it. Grab the top dot to rotate. Open the extra controls only when
              you want to get picky.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
