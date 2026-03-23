export type SleeperType = 'adult' | 'child' | 'dog' | 'cat';
export type ThermalTendency = 'cold' | 'neutral' | 'warm' | 'hot';
export type BlanketCoverage = 'none' | 'partial' | 'full';
export type UnitSystem = 'F' | 'C';
export type SegmentKind = 'capsule' | 'circle';
export type BedSizeId = 'twin' | 'full' | 'queen' | 'king' | 'calKing';

export interface Point {
  x: number;
  y: number;
}

export interface BedSize {
  id: BedSizeId;
  label: string;
  widthIn: number;
  lengthIn: number;
  marketName: string;
}

export interface BlanketProfile {
  id: string;
  label: string;
  retention: number;
  airflow: number;
  stageTint: string;
  note: string;
}

export interface PosePreset {
  id: string;
  label: string;
  description: string;
  segmentAngles: Record<string, number>;
}

export interface SegmentDefinition {
  id: string;
  label: string;
  parentId?: string;
  attachOffset?: number;
  lateralOffset?: number;
  rootOffset?: Point;
  length: number;
  width: number;
  baseAngle: number;
  jointLimits: [number, number];
  kind: SegmentKind;
  heatWeight: number;
  sampleCount: number;
}

export interface RigDefinition {
  rootSegmentId: string;
  editableSegments: string[];
  segments: SegmentDefinition[];
}

export interface SpeciesProfile {
  type: SleeperType;
  label: string;
  blurb: string;
  defaultWeightLb: number;
  weightRange: [number, number];
  baseHeat: number;
  baseSpread: number;
  lengthScale: number;
  widthScale: number;
  defaultBlanketCoverage: BlanketCoverage;
  defaultPosePresetId: string;
  posePresets: PosePreset[];
  rig: RigDefinition;
  palette: {
    body: string;
    accent: string;
    label: string;
  };
}

export interface BreedProfile {
  id: string;
  label: string;
  defaultWeightLb: number;
  heatMultiplier: number;
  spreadMultiplier: number;
  lengthMultiplier: number;
  widthMultiplier: number;
  blurb: string;
}

export interface Sleeper {
  id: string;
  name: string;
  type: SleeperType;
  presetId?: string;
  breedId?: string;
  weightLb: number;
  thermalTendency: ThermalTendency;
  posePresetId: string;
  poseState: Record<string, number>;
  root: Point;
  rotationDeg: number;
  blanketCoverage: BlanketCoverage;
  color: string;
}

export interface EnvironmentState {
  roomTempF: number;
  blanketId: string;
  unit: UnitSystem;
}

export interface ResolvedSleeperProfile {
  species: SpeciesProfile;
  breed?: BreedProfile;
  lengthMultiplier: number;
  widthMultiplier: number;
  heatMultiplier: number;
  spreadMultiplier: number;
  defaultWeightLb: number;
}

export interface WorldSegment {
  sleeperId: string;
  segmentId: string;
  label: string;
  kind: SegmentKind;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  cx: number;
  cy: number;
  length: number;
  width: number;
  angleDeg: number;
  heatWeight: number;
}

export interface HeatSplat {
  sleeperId: string;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  intensity: number;
  segmentId: string;
}

export interface ContactBoost {
  x: number;
  y: number;
  intensity: number;
  sleeperIds: [string, string];
}

export interface TemperatureRangeF {
  minF: number;
  maxF: number;
}

export interface HeatZoneSummary {
  x: number;
  y: number;
  zoneLabel: string;
  dominantSleeperIds: string[];
  deltaRangeF: TemperatureRangeF;
  absoluteRangeF: TemperatureRangeF;
}

export interface HeatSummary {
  hotspot: HeatZoneSummary;
  coolspot: HeatZoneSummary;
  ambientF: number;
  peakDeltaF: number;
  averageDeltaF: number;
  overlapCount: number;
}

export interface HeatField {
  cols: number;
  rows: number;
  field: Float32Array;
  maxValue: number;
  splats: HeatSplat[];
  contacts: ContactBoost[];
  contributorFields: Record<string, Float32Array>;
  summary: HeatSummary;
}

export interface SimulationResult {
  worldSegmentsBySleeper: Record<string, WorldSegment[]>;
  heatField: HeatField;
  insights: string[];
}
