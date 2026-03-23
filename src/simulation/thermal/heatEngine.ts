import { blanketProfiles } from '../../data/blankets/blankets';
import { getBedSize, zoneLabelFromPoint } from '../../features/bed/bedUtils';
import { clamp, distance, lerp } from '../../lib/geometry';
import type {
  BedSizeId,
  ContactBoost,
  HeatField,
  HeatSplat,
  Point,
  Sleeper,
  ThermalTendency,
  WorldSegment,
} from '../../types';
import { createTemperatureRange } from './temperature';

const tendencyFactor: Record<ThermalTendency, number> = {
  cold: 0.88,
  neutral: 1,
  warm: 1.12,
  hot: 1.25,
};

const blanketCoverageFactor = {
  none: 0.8,
  partial: 1,
  full: 1.14,
};

// A solo 170 lb neutral adult on a queen bed with a duvet lands near this max field value.
const FIELD_CALIBRATION = 0.8;

const segmentSamples = (segment: WorldSegment, count: number): Point[] => {
  if (segment.kind === 'circle') {
    return [{ x: segment.cx, y: segment.cy }];
  }

  const samples: Point[] = [];
  for (let index = 0; index < count; index += 1) {
    const t = count === 1 ? 0.5 : index / (count - 1);
    samples.push({
      x: lerp(segment.x1, segment.x2, t),
      y: lerp(segment.y1, segment.y2, t),
    });
  }
  return samples;
};

const applySplatToField = ({
  splat,
  bedWidthIn,
  bedLengthIn,
  cols,
  rows,
  field,
  contribution,
}: {
  splat: HeatSplat;
  bedWidthIn: number;
  bedLengthIn: number;
  cols: number;
  rows: number;
  field: Float32Array;
  contribution: Float32Array;
}) => {
  const minX = Math.max(0, Math.floor(((splat.x - splat.radiusX * 2.8) / bedWidthIn) * cols));
  const maxX = Math.min(cols - 1, Math.ceil(((splat.x + splat.radiusX * 2.8) / bedWidthIn) * cols));
  const minY = Math.max(0, Math.floor(((splat.y - splat.radiusY * 2.8) / bedLengthIn) * rows));
  const maxY = Math.min(rows - 1, Math.ceil(((splat.y + splat.radiusY * 2.8) / bedLengthIn) * rows));

  for (let row = minY; row <= maxY; row += 1) {
    for (let col = minX; col <= maxX; col += 1) {
      const px = ((col + 0.5) / cols) * bedWidthIn;
      const py = ((row + 0.5) / rows) * bedLengthIn;
      const dx = (px - splat.x) / splat.radiusX;
      const dy = (py - splat.y) / splat.radiusY;
      const value = Math.exp(-0.5 * (dx * dx + dy * dy)) * splat.intensity;
      const index = row * cols + col;
      field[index] += value;
      contribution[index] += value;
    }
  }
};

export const runHeatSimulation = ({
  sleepers,
  bedSizeId,
  roomTempF,
  blanketId,
  worldSegmentsBySleeper,
}: {
  sleepers: Sleeper[];
  bedSizeId: BedSizeId;
  roomTempF: number;
  blanketId: string;
  worldSegmentsBySleeper: Record<string, WorldSegment[]>;
}): HeatField => {
  const bed = getBedSize(bedSizeId);
  const cols = Math.max(40, Math.round(bed.widthIn * 0.8));
  const rows = Math.max(48, Math.round(bed.lengthIn * 0.8));
  const field = new Float32Array(cols * rows);
  const contributorFields: Record<string, Float32Array> = Object.fromEntries(
    sleepers.map((sleeper) => [sleeper.id, new Float32Array(cols * rows)]),
  );
  const splats: HeatSplat[] = [];
  const contacts: ContactBoost[] = [];
  const blanket = blanketProfiles.find((candidate) => candidate.id === blanketId) ?? blanketProfiles[0];

  sleepers.forEach((sleeper) => {
    const segments = worldSegmentsBySleeper[sleeper.id] ?? [];
    const weightRatio = Math.pow(sleeper.weightLb / 150, 0.65);
    const tendency = tendencyFactor[sleeper.thermalTendency];
    const blanketCoverage = blanketCoverageFactor[sleeper.blanketCoverage];

    for (const segment of segments) {
      const sampleCount = segment.kind === 'circle' ? 1 : Math.max(2, Math.round(segment.length / 6));
      const samples = segmentSamples(segment, sampleCount);
      for (const sample of samples) {
        splats.push({
          sleeperId: sleeper.id,
          x: sample.x,
          y: sample.y,
          radiusX: Math.max(2.2, segment.width * 0.7 * blanket.airflow + segment.length * 0.08),
          radiusY: Math.max(2.2, segment.width * 0.64 * blanket.airflow + segment.length * 0.06),
          intensity:
            segment.heatWeight *
            tendency *
            blanket.retention *
            blanketCoverage *
            weightRatio *
            (segment.kind === 'circle' ? 1.05 : 1),
          segmentId: segment.segmentId,
        });
      }
    }
  });

  for (let sleeperIndex = 0; sleeperIndex < sleepers.length; sleeperIndex += 1) {
    const sleeper = sleepers[sleeperIndex];
    const sleeperSamples = (worldSegmentsBySleeper[sleeper.id] ?? []).flatMap((segment) =>
      segmentSamples(segment, Math.max(2, Math.round(segment.length / 8))),
    );
    for (let otherIndex = sleeperIndex + 1; otherIndex < sleepers.length; otherIndex += 1) {
      const other = sleepers[otherIndex];
      const otherSamples = (worldSegmentsBySleeper[other.id] ?? []).flatMap((segment) =>
        segmentSamples(segment, Math.max(2, Math.round(segment.length / 8))),
      );

      for (const first of sleeperSamples) {
        for (const second of otherSamples) {
          const gap = distance(first, second);
          if (gap < 5.4) {
            contacts.push({
              x: (first.x + second.x) / 2,
              y: (first.y + second.y) / 2,
              intensity: 0.26 + (5.4 - gap) * 0.05,
              sleeperIds: [sleeper.id, other.id],
            });
          }
        }
      }
    }
  }

  splats.forEach((splat) =>
    applySplatToField({
      splat,
      bedWidthIn: bed.widthIn,
      bedLengthIn: bed.lengthIn,
      cols,
      rows,
      field,
      contribution: contributorFields[splat.sleeperId],
    }),
  );

  contacts.forEach((contact) => {
    contact.sleeperIds.forEach((sleeperId) => {
      applySplatToField({
        splat: {
          sleeperId,
          x: contact.x,
          y: contact.y,
          radiusX: 5.4,
          radiusY: 5.4,
          intensity: contact.intensity * blanket.retention,
          segmentId: 'contact',
        },
        bedWidthIn: bed.widthIn,
        bedLengthIn: bed.lengthIn,
        cols,
        rows,
        field,
        contribution: contributorFields[sleeperId],
      });
    });
  });

  let maxValue = 0;
  let maxIndex = 0;
  let minValue = Number.POSITIVE_INFINITY;
  let minIndex = 0;
  let total = 0;

  for (let index = 0; index < field.length; index += 1) {
    const value = field[index];
    total += value;
    if (value > maxValue) {
      maxValue = value;
      maxIndex = index;
    }
    if (value < minValue) {
      minValue = value;
      minIndex = index;
    }
  }

  const totalThermalLoad = sleepers.reduce((sum, sleeper) => {
    const weightRatio = Math.pow(sleeper.weightLb / 150, 0.75);
    return sum + tendencyFactor[sleeper.thermalTendency] * weightRatio;
  }, 0);
  const baseDelta = 8 + blanket.retention * 4.5;
  const loadBonus = Math.min(8, totalThermalLoad * 1.2);
  const contactBonus = Math.min(5, contacts.length * 0.1);
  const peakDeltaF = baseDelta + loadBonus + contactBonus;
  const hotspotPoint = {
    x: (((maxIndex % cols) + 0.5) / cols) * bed.widthIn,
    y: ((Math.floor(maxIndex / cols) + 0.5) / rows) * bed.lengthIn,
  };
  const coolspotPoint = {
    x: (((minIndex % cols) + 0.5) / cols) * bed.widthIn,
    y: ((Math.floor(minIndex / cols) + 0.5) / rows) * bed.lengthIn,
  };

  const dominantSleeperIds = (index: number) =>
    Object.entries(contributorFields)
      .map(([id, contribution]) => ({ id, value: contribution[index] }))
      .sort((left, right) => right.value - left.value)
      .filter((item) => item.value > maxValue * 0.08)
      .slice(0, 3)
      .map((item) => item.id);

  const hotspotLocal = Math.min(1, maxValue / FIELD_CALIBRATION);
  const coolspotLocal = clamp(minValue / FIELD_CALIBRATION, 0, 0.2);
  const hotspotTemp = createTemperatureRange(hotspotLocal, roomTempF, peakDeltaF);
  const coolspotTemp = createTemperatureRange(coolspotLocal, roomTempF, peakDeltaF);

  return {
    cols,
    rows,
    field,
    maxValue,
    splats,
    contacts,
    contributorFields,
    summary: {
      hotspot: {
        ...hotspotPoint,
        zoneLabel: zoneLabelFromPoint(hotspotPoint, bed),
        dominantSleeperIds: dominantSleeperIds(maxIndex),
        deltaRangeF: hotspotTemp.deltaRangeF,
        absoluteRangeF: hotspotTemp.absoluteRangeF,
      },
      coolspot: {
        ...coolspotPoint,
        zoneLabel: zoneLabelFromPoint(coolspotPoint, bed),
        dominantSleeperIds: dominantSleeperIds(minIndex),
        deltaRangeF: coolspotTemp.deltaRangeF,
        absoluteRangeF: coolspotTemp.absoluteRangeF,
      },
      ambientF: roomTempF,
      peakDeltaF,
      averageDeltaF: Math.round((total / field.length) * (peakDeltaF / (maxValue || 1))),
      overlapCount: contacts.length,
    },
  };
};
