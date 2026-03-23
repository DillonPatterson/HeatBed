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
  const bed = bedSizes.find((c) => c.id === bedSizeId) ?? bedSizes[2];
  const blanket = blanketProfiles.find((c) => c.id === blanketId) ?? blanketProfiles[0];

  const hotF = heatField.summary.hotspot.absoluteRangeF;
  const hotIntensity = Math.min(1, heatField.summary.overlapCount / 10);

  return (
    <div
      ref={captureRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        height: '100%',
      }}
    >
      {/* Stage header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 2 }}>
            Live thermal field
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-primary)' }}>
            {bed.label} · {bed.marketName}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          <div
            className="tag"
            style={{
              background: 'rgba(255,94,26,0.1)',
              border: '1px solid rgba(255,94,26,0.25)',
              color: 'var(--accent-hot)',
              boxShadow: hotIntensity > 0.3 ? '0 0 10px rgba(255,94,26,0.2)' : 'none',
            }}
          >
            🔥 {formatDualRange(hotF, unit)}
          </div>
          <div
            className="tag"
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              color: 'var(--text-secondary)',
            }}
          >
            {blanket.label}
          </div>
          <div
            className="tag"
            style={{
              background: 'var(--bg-raised)',
              border: '1px solid var(--border)',
              color: 'var(--text-muted)',
            }}
          >
            {sleepers.length} sleeper{sleepers.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Bed canvas */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          background: 'rgba(0,0,0,0.3)',
          borderRadius: 16,
          border: '1px solid rgba(255,255,255,0.05)',
          position: 'relative',
          overflow: 'hidden',
          minHeight: 0,
        }}
      >
        {/* Corner tick marks */}
        {['tl', 'tr', 'bl', 'br'].map((corner) => (
          <div
            key={corner}
            style={{
              position: 'absolute',
              width: 12,
              height: 12,
              borderTop: corner.includes('t') ? '1px solid rgba(255,170,68,0.3)' : 'none',
              borderBottom: corner.includes('b') ? '1px solid rgba(255,170,68,0.3)' : 'none',
              borderLeft: corner.includes('l') ? '1px solid rgba(255,170,68,0.3)' : 'none',
              borderRight: corner.includes('r') ? '1px solid rgba(255,170,68,0.3)' : 'none',
              top: corner.includes('t') ? 8 : undefined,
              bottom: corner.includes('b') ? 8 : undefined,
              left: corner.includes('l') ? 8 : undefined,
              right: corner.includes('r') ? 8 : undefined,
            }}
          />
        ))}

        {/* Bed mattress */}
        <div
          style={{
            position: 'relative',
            maxWidth: '100%',
            maxHeight: '100%',
          }}
        >
          <div
            style={{
              aspectRatio: `${bed.widthIn} / ${bed.lengthIn}`,
              maxWidth: '100%',
              maxHeight: 'calc(100vh - 280px)',
              position: 'relative',
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: `
                0 0 0 2px rgba(255,255,255,0.06),
                0 0 40px rgba(0,0,0,0.6),
                0 0 80px rgba(255,94,26,${hotIntensity * 0.15})
              `,
            }}
          >
            {/* Mattress base */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(180deg, #1a1420 0%, #100e18 100%)',
                borderRadius: 'inherit',
              }}
            />

            {/* Grid lines */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
                `,
                backgroundSize: `${100 / 8}% ${100 / 10}%`,
                borderRadius: 'inherit',
              }}
            />

            {/* Heat map canvas */}
            <HeatMapCanvas heatField={heatField} blanket={blanket} />

            {/* SVG figure layer */}
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

            {/* Bed size label */}
            <div
              style={{
                position: 'absolute',
                bottom: 8,
                right: 10,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.55rem',
                color: 'rgba(255,255,255,0.2)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                pointerEvents: 'none',
              }}
            >
              {bed.widthIn}" × {bed.lengthIn}"
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          padding: '0.6rem 0.85rem',
          background: 'var(--bg-surface)',
          borderRadius: 10,
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
            Warmest:
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-hot)' }}>
            {formatDualRange(hotF, unit)}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'rgba(255,170,68,0.6)' }}>
            {formatDeltaRange(heatField.summary.hotspot.deltaRangeF, unit)}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            @ {heatField.summary.hotspot.zoneLabel}
          </span>
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', letterSpacing: '0.08em', flexShrink: 0 }}>
          Modeled estimate · not a measurement
        </div>
      </div>
    </div>
  );
};
