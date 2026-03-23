import { getBreedOptions, getPosePreset, getSpeciesProfile } from '../../simulation/presets/resolveSleeperPreset';
import { Panel } from '../shared/Panel';
import type { Sleeper, SleeperType } from '../../types';

interface SelectedSleeperCardProps {
  sleeper?: Sleeper;
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

export const SelectedSleeperCard = ({
  sleeper,
  onUpdateBasics,
  onSetType,
  onSetBreed,
  onApplyPosePreset,
  onSetRotation,
  onSetSegmentAngle,
}: SelectedSleeperCardProps) => {
  if (!sleeper) {
    return (
      <Panel title="Selected Sleeper" eyebrow="Editor">
        <p className="text-sm text-stone-600">Select a sleeper to rename them, change presets, or tune their pose.</p>
      </Panel>
    );
  }

  const species = getSpeciesProfile(sleeper.type);
  const breedOptions = getBreedOptions(sleeper.type);
  const editableSegments = species.rig.segments.filter((segment) =>
    species.rig.editableSegments.includes(segment.id),
  );

  return (
    <Panel title={sleeper.name} eyebrow="Editor">
      <div className="space-y-4 text-sm text-stone-700">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Name</span>
          <input value={sleeper.name} onChange={(event) => onUpdateBasics(sleeper.id, { name: event.target.value })} className="field" />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Type</span>
            <select value={sleeper.type} onChange={(event) => onSetType(sleeper.id, event.target.value as SleeperType)} className="field">
              <option value="adult">Adult</option>
              <option value="child">Child</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Blanket coverage</span>
            <select value={sleeper.blanketCoverage} onChange={(event) => onUpdateBasics(sleeper.id, { blanketCoverage: event.target.value as Sleeper['blanketCoverage'] })} className="field">
              <option value="none">None</option>
              <option value="partial">Partial</option>
              <option value="full">Full</option>
            </select>
          </label>
        </div>

        {breedOptions.length ? (
          <label className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              {sleeper.type === 'dog' ? 'Breed preset' : 'Cat preset'}
            </span>
            <select value={sleeper.breedId} onChange={(event) => onSetBreed(sleeper.id, event.target.value)} className="field">
              {breedOptions.map((breed) => (
                <option key={breed.id} value={breed.id}>
                  {breed.label} · {breed.defaultWeightLb} lb default · {breed.blurb}
                </option>
              ))}
            </select>
          </label>
        ) : null}

        <label className="block">
          <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            <span>Weight</span>
            <span>{Math.round(sleeper.weightLb)} lb</span>
          </div>
          <input
            type="range"
            min={species.weightRange[0]}
            max={species.weightRange[1]}
            value={sleeper.weightLb}
            onChange={(event) => onUpdateBasics(sleeper.id, { weightLb: Number(event.target.value) })}
            className="w-full accent-amber-700"
          />
        </label>

        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Thermal tendency</span>
          <div className="grid grid-cols-4 gap-2">
            {(['cold', 'neutral', 'warm', 'hot'] as const).map((tendency) => (
              <button
                key={tendency}
                type="button"
                onClick={() => onUpdateBasics(sleeper.id, { thermalTendency: tendency })}
                className={`action-btn ${sleeper.thermalTendency === tendency ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-700'}`}
              >
                {tendency}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Pose preset</span>
          <div className="flex flex-wrap gap-2">
            {species.posePresets.map((pose) => (
              <button
                key={pose.id}
                type="button"
                onClick={() => onApplyPosePreset(sleeper.id, pose.id)}
                title={pose.description}
                className={`rounded-full px-3 py-2 text-xs font-semibold transition ${sleeper.posePresetId === pose.id ? 'bg-amber-700 text-white' : 'bg-stone-100 text-stone-700'}`}
              >
                {pose.label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-stone-500">{getPosePreset(sleeper.type, sleeper.posePresetId).description}</p>
        </div>

        <label className="block">
          <div className="mb-1 flex items-center justify-between text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
            <span>Rotation</span>
            <span>{Math.round(sleeper.rotationDeg)}°</span>
          </div>
          <input type="range" min={-180} max={180} value={sleeper.rotationDeg} onChange={(event) => onSetRotation(sleeper.id, Number(event.target.value))} className="w-full accent-amber-700" />
        </label>

        <div className="space-y-3">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">Joint tweaks</div>
          {editableSegments.map((segment) => (
            <label key={segment.id} className="block">
              <div className="mb-1 flex items-center justify-between text-xs text-stone-500">
                <span>{segment.label}</span>
                <span>{Math.round(sleeper.poseState[segment.id] ?? 0)}°</span>
              </div>
              <input
                type="range"
                min={segment.jointLimits[0]}
                max={segment.jointLimits[1]}
                value={sleeper.poseState[segment.id] ?? 0}
                onChange={(event) => onSetSegmentAngle(sleeper.id, segment.id, Number(event.target.value))}
                className="w-full accent-amber-700"
              />
            </label>
          ))}
        </div>
      </div>
    </Panel>
  );
};
