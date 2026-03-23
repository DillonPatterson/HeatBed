import { useEffect, useRef, useState } from 'react';
import { AppShell } from './AppShell';
import { exportStageImage } from '../features/sharing/exportStageImage';
import { useSimulation } from '../hooks/useSimulation';
import { useAppStore } from '../store/appStore';

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

  return (
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
      onAddSleeper={addSleeper}
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
  );
}
