import { blanketProfiles } from '../../data/blankets/blankets';
import { bedSizes } from '../../data/beds/bedSizes';
import { formatDeltaRange, formatDualRange } from '../../lib/units';
import type { BedSizeId, HeatField, Sleeper, UnitSystem, WorldSegment } from '../../types';
import { SleeperFigure } from '../figures/SleeperFigure';
import { HeatMapCanvas } from './HeatMapCanvas';
import type { RefObject } from 'react';

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

  return (
    <div ref={captureRef} className="panel-shell overflow-hidden">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-stone-500">Live Stage</div>
          <h2 className="font-display text-[1.3rem] text-stone-900">Bed Heat Simulator</h2>
          <p className="max-w-2xl text-sm text-stone-600">
            Modeled estimate based on sleeper size, pose, contact, room temperature, and blanket retention.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold text-stone-700">
          <span className="rounded-full bg-stone-100 px-3 py-1.5">{bed.label}</span>
          <span className="rounded-full bg-orange-100 px-3 py-1.5">{blanket.label}</span>
          <span className="rounded-full bg-red-100 px-3 py-1.5">
            Warmest: {formatDualRange(heatField.summary.hotspot.absoluteRangeF, unit)}
          </span>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="rounded-[2rem] bg-[linear-gradient(180deg,rgba(130,92,54,0.16),rgba(58,42,28,0.06))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
          <div
            className="relative mx-auto overflow-hidden rounded-[1.75rem] border border-stone-300/80 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.82),rgba(230,212,191,0.96))] shadow-[inset_0_0_0_10px_rgba(88,58,37,0.07),0_30px_80px_rgba(77,51,29,0.22)]"
            style={{ aspectRatio: `${bed.widthIn} / ${bed.lengthIn}` }}
          >
            <div className="absolute inset-0 rounded-[1.75rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.18),transparent_35%,rgba(154,112,67,0.08)_100%)]" />
            <HeatMapCanvas heatField={heatField} blanket={blanket} />
            <svg
              ref={svgRef}
              viewBox={`0 0 ${bed.widthIn} ${bed.lengthIn}`}
              className="absolute inset-0 h-full w-full"
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
          </div>
        </div>

        <aside className="space-y-3">
          <div className="rounded-[1.4rem] bg-stone-950 px-4 py-4 text-stone-100">
            <div className="text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-stone-400">Hotspot</div>
            <div className="mt-1 font-display text-xl">{formatDualRange(heatField.summary.hotspot.absoluteRangeF, unit)}</div>
            <div className="mt-2 text-sm text-stone-300">{formatDeltaRange(heatField.summary.hotspot.deltaRangeF, unit)}</div>
            <div className="mt-2 text-xs uppercase tracking-[0.16em] text-amber-300">{heatField.summary.hotspot.zoneLabel}</div>
          </div>

          <div className="rounded-[1.4rem] bg-[#eef4fa] px-4 py-4 text-stone-800">
            <div className="text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-stone-500">Cool pocket</div>
            <div className="mt-1 font-display text-xl">{formatDualRange(heatField.summary.coolspot.absoluteRangeF, unit)}</div>
            <div className="mt-2 text-sm text-stone-600">{heatField.summary.coolspot.zoneLabel}</div>
          </div>

          <div className="rounded-[1.4rem] border border-stone-200 bg-white/80 px-4 py-4 text-sm text-stone-700">
            <div className="mb-2 text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-stone-500">Interaction</div>
            <p>Drag bodies to move them. Pull the top handle to rotate. Pull the little joint dots to tweak limbs.</p>
          </div>
        </aside>
      </div>
    </div>
  );
};
