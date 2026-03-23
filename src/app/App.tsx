import { useEffect, useRef, useState } from 'react';
import { AppShell } from './AppShell';
import { SleeperIntakeModal, type SleeperIntakePayload } from '../components/controls/SleeperIntakeModal';
import { getSleeperColor } from '../features/sleepers/sleeperColors';
import { exportStageImage } from '../features/sharing/exportStageImage';
import { useSimulation } from '../hooks/useSimulation';
import { useAppStore } from '../store/appStore';
import type { SleeperType } from '../types';

export default function App() {
  const bedSizeId = useAppStore((state) => state.bedSizeId);
  const environment = useAppStore((state) => state.environment);
  const sleepers = useAppStore((state) => state.sleepers);
  const selectedSleeperId = useAppStore((state) => state.selectedSleeperId);
  const addSleeper = useAppStore((state) => state.addSleeper);
  const removeSleeper = useAppStore((state) => state.removeSleeper);
  const selectSleeper = useAppStore((state) => state.selectSleeper);
  const setBedSizeId = useAppStore((state) => state.setBedSizeId);
  const setRoomTempF = useAppStore((state) => state.setRoomTempF);
  const setBlanketId = useAppStore((state) => state.setBlanketId);
  const setUnit = useAppStore((state) => state.setUnit);
  const updateSleeperBasics = useAppStore((state) => state.updateSleeperBasics);
  const setSleeperType = useAppStore((state) => state.setSleeperType);
  const setSleeperBreed = useAppStore((state) => state.setSleeperBreed);
  const setSleeperColor = useAppStore((state) => state.setSleeperColor);
  const applyPosePreset = useAppStore((state) => state.applyPosePreset);
  const setSegmentAngle = useAppStore((state) => state.setSegmentAngle);
  const setSleeperPosition = useAppStore((state) => state.setSleeperPosition);
  const setSleeperRotation = useAppStore((state) => state.setSleeperRotation);
  const resetDemo = useAppStore((state) => state.resetDemo);

  const selectedSleeper =
    sleepers.find((sleeper) => sleeper.id === selectedSleeperId) ?? sleepers[0];
  const captureRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [intakeType, setIntakeType] = useState<SleeperType | null>(null);

  useEffect(() => {
    if (!selectedSleeperId && sleepers[0]) {
      selectSleeper(sleepers[0].id);
    }
  }, [selectSleeper, selectedSleeperId, sleepers]);

  const simulation = useSimulation({
    sleepers,
    bedSizeId,
    roomTempF: environment.roomTempF,
    blanketId: environment.blanketId,
  });

  const handleExport = async () => {
    if (!captureRef.current) return;
    setIsExporting(true);
    try {
      await exportStageImage(captureRef.current);
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenIntake = (type: SleeperType) => {
    setIntakeType(type);
  };

  const handleConfirmIntake = ({ type, name, weightLb, thermalTendency, breedId, presentation }: SleeperIntakePayload) => {
    addSleeper(type);

    const nextState = useAppStore.getState();
    const nextSleeperId =
      nextState.selectedSleeperId ?? nextState.sleepers[nextState.sleepers.length - 1]?.id;

    if (!nextSleeperId) {
      setIntakeType(null);
      return;
    }

    updateSleeperBasics(nextSleeperId, { name, weightLb, thermalTendency });

    if (breedId && (type === 'dog' || type === 'cat')) {
      setSleeperBreed(nextSleeperId, breedId);
    }

    if (presentation && (type === 'adult' || type === 'child')) {
      setSleeperColor(nextSleeperId, getSleeperColor(type, presentation));
    }

    setIntakeType(null);
  };

  return (
    <>
      <AppShell
        captureRef={captureRef}
        svgRef={svgRef}
        bedSizeId={bedSizeId}
        blanketId={environment.blanketId}
        unit={environment.unit}
        sleepers={sleepers}
        selectedSleeper={selectedSleeper}
        selectedSleeperId={selectedSleeperId}
        worldSegmentsBySleeper={simulation.worldSegmentsBySleeper}
        heatField={simulation.heatField}
        insights={simulation.insights}
        isExporting={isExporting}
        environment={environment}
        onSetBedSizeId={setBedSizeId}
        onSetRoomTempF={setRoomTempF}
        onSetBlanketId={setBlanketId}
        onSetUnit={setUnit}
        onExport={handleExport}
        onReset={resetDemo}
        onSelectSleeper={selectSleeper}
        onAddSleeper={handleOpenIntake}
        onRemoveSleeper={removeSleeper}
        onUpdateBasics={updateSleeperBasics}
        onSetType={setSleeperType}
        onSetBreed={setSleeperBreed}
        onApplyPosePreset={applyPosePreset}
        onSetRotation={setSleeperRotation}
        onSetSegmentAngle={setSegmentAngle}
        onMoveSleeper={setSleeperPosition}
        onRotateSleeper={setSleeperRotation}
      />

      {intakeType ? (
        <SleeperIntakeModal
          type={intakeType}
          onClose={() => setIntakeType(null)}
          onConfirm={handleConfirmIntake}
        />
      ) : null}
    </>
  );
}
