import type { RefObject } from 'react';
import { blanketProfiles } from '../../data/blankets/blankets';
import { bedSizes } from '../../data/beds/bedSizes';
import { formatDualRange } from '../../lib/units';
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
  poseEditing: boolean;
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
  poseEditing,
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
      <div className="stage-header">
        <div className="stage-badges">
          <div className="badge">{bed.label}</div>
          <div className="badge">{blanket.label}</div>
          <div className="badge">
            {sleepers.length} sleeper{sleepers.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      <div className="stage-scene">
        <div className="bed-wrap" style={{ width: 'min(100%, 960px)', maxHeight: '100%' }}>
          <div className="bed-headboard" aria-hidden="true">
            <div className="headboard-post" />
            <div className="headboard-post" />
            <div className="headboard-post" />
          </div>

          <div className="bed-mattress" style={{ aspectRatio: `${bed.widthIn} / ${bed.lengthIn}` }}>
            <div className="bed-pillows" aria-hidden="true">
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
                zIndex: 3,
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
                  poseEditing={selectedSleeperId === sleeper.id && poseEditing}
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

      <div className="stage-strip">
        <div className="strip-card">
          <div className="stat-label">Warmest zone</div>
          <div className="stat-value hot">est. {formatDualRange(heatField.summary.hotspot.absoluteRangeF, unit)}</div>
          <div className="stat-note">{heatField.summary.hotspot.zoneLabel}</div>
        </div>

        <div className="strip-card">
          <div className="stat-label">Coolest zone</div>
          <div className="stat-value cool">est. {formatDualRange(heatField.summary.coolspot.absoluteRangeF, unit)}</div>
          <div className="stat-note">{heatField.summary.coolspot.zoneLabel}</div>
        </div>

        <div className="strip-card">
          <div className="stat-label">Contact</div>
          <div className="stat-value">{Math.round(heatField.summary.overlapCount)} boosts</div>
          <div className="stat-note">
            {selectedSleeper && poseEditing
              ? `${selectedSleeper.name} is in pose mode. Drag the small joint dots to tweak limbs.`
              : selectedSleeper
                ? `${selectedSleeper.name} is selected. Drag to move and use the top handle to rotate.`
              : `${Math.round(heatField.summary.overlapCount)} overlap boosts are stacking extra heat in the pile.`}
          </div>
        </div>
      </div>
    </div>
  );
};
