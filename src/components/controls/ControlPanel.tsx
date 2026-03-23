import { BedEnvironmentCard } from './BedEnvironmentCard';
import { SelectedSleeperCard } from './SelectedSleeperCard';
import { SleeperListCard } from './SleeperListCard';
import type {
  BedSizeId,
  EnvironmentState,
  Sleeper,
  SleeperType,
  TemperatureRangeF,
  UnitSystem,
} from '../../types';

interface ControlPanelProps {
  environment: EnvironmentState;
  bedSizeId: BedSizeId;
  sleepers: Sleeper[];
  selectedSleeper?: Sleeper;
  selectedSleeperId: string | null;
  hotspotRangeF: TemperatureRangeF;
  onSetBedSizeId: (id: BedSizeId) => void;
  onSetRoomTempF: (roomTempF: number) => void;
  onSetBlanketId: (blanketId: string) => void;
  onSetUnit: (unit: UnitSystem) => void;
  onExport: () => void;
  onReset: () => void;
  isExporting: boolean;
  onSelectSleeper: (id: string) => void;
  onAddSleeper: (type: SleeperType) => void;
  onRemoveSleeper: (id: string) => void;
  onUpdateBasics: (
    id: string,
    patch: Partial<Pick<Sleeper, 'name' | 'weightLb' | 'thermalTendency' | 'blanketCoverage'>>,
  ) => void;
  onSetType: (id: string, type: SleeperType) => void;
  onSetBreed: (id: string, breedId?: string) => void;
  onApplyPosePreset: (id: string, posePresetId: string) => void;
  onSetRotation: (id: string, rotationDeg: number) => void;
  onSetSegmentAngle: (id: string, segmentId: string, angle: number) => void;
}

export const ControlPanel = (props: ControlPanelProps) => (
  <div className="control-stack">
    <div className="control-top-grid">
      <BedEnvironmentCard
        environment={props.environment}
        bedSizeId={props.bedSizeId}
        hotspotRangeF={props.hotspotRangeF}
        onSetBedSizeId={props.onSetBedSizeId}
        onSetRoomTempF={props.onSetRoomTempF}
        onSetBlanketId={props.onSetBlanketId}
        onSetUnit={props.onSetUnit}
        onExport={props.onExport}
        onReset={props.onReset}
        isExporting={props.isExporting}
      />

      <SleeperListCard
        sleepers={props.sleepers}
        selectedSleeperId={props.selectedSleeperId}
        onSelectSleeper={props.onSelectSleeper}
        onAddSleeper={props.onAddSleeper}
        onRemoveSleeper={props.onRemoveSleeper}
      />
    </div>

    <SelectedSleeperCard
      sleeper={props.selectedSleeper}
      onUpdateBasics={props.onUpdateBasics}
      onSetType={props.onSetType}
      onSetBreed={props.onSetBreed}
      onApplyPosePreset={props.onApplyPosePreset}
      onSetRotation={props.onSetRotation}
      onSetSegmentAngle={props.onSetSegmentAngle}
    />
  </div>
);
