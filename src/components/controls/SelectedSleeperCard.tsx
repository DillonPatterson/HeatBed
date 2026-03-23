import { getBreedOptions, getPosePreset, getSpeciesProfile } from '../../simulation/presets/resolveSleeperPreset';
import { Panel } from '../shared/Panel';
import type { Sleeper, SleeperType } from '../../types';

interface SelectedSleeperCardProps {
  sleeper?: Sleeper;
  poseEditing: boolean;
  onUpdateBasics: (
    id: string,
    patch: Partial<Pick<Sleeper, 'name' | 'weightLb' | 'thermalTendency' | 'blanketCoverage'>>,
  ) => void;
  onSetType: (id: string, type: SleeperType) => void;
  onSetBreed: (id: string, breedId?: string) => void;
  onApplyPosePreset: (id: string, posePresetId: string) => void;
  onTogglePoseEditing: () => void;
  onSetRotation: (id: string, rotationDeg: number) => void;
  onSetSegmentAngle: (id: string, segmentId: string, angle: number) => void;
}

export const SelectedSleeperCard = ({
  sleeper,
  poseEditing,
  onUpdateBasics,
  onSetType,
  onSetBreed,
  onApplyPosePreset,
  onTogglePoseEditing,
  onSetRotation,
  onSetSegmentAngle,
}: SelectedSleeperCardProps) => {
  if (!sleeper) {
    return (
      <Panel title="Selected sleeper" eyebrow="quick edits" accent="neutral">
        <div className="helper-line">Click a body on the bed to rename it, warm it up, or get picky with the pose.</div>
      </Panel>
    );
  }

  const species = getSpeciesProfile(sleeper.type);
  const breedOptions = getBreedOptions(sleeper.type);
  const activePose = getPosePreset(sleeper.type, sleeper.posePresetId);
  const editableSegments = species.rig.segments.filter((segment) =>
    species.rig.editableSegments.includes(segment.id),
  );

  return (
    <Panel
      title={sleeper.name}
      eyebrow="quick edits"
      accent="hot"
      actions={<div className="badge">{species.label}</div>}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <button
            type="button"
            className={`chip-btn ${poseEditing ? 'is-active' : ''}`.trim()}
            onClick={onTogglePoseEditing}
          >
            {poseEditing ? 'Done posing on bed' : 'Pose on bed'}
          </button>
          <div className="helper-line">
            Joint dots only show up while pose mode is on, so the stage stays clean the rest of the time.
          </div>
        </div>

        <div className="mini-grid">
          <label>
            <div className="tiny-label">Name</div>
            <input
              className="field"
              value={sleeper.name}
              onChange={(event) => onUpdateBasics(sleeper.id, { name: event.target.value })}
            />
          </label>

          <label>
            <div className="tiny-label">Type</div>
            <select
              className="field"
              value={sleeper.type}
              onChange={(event) => onSetType(sleeper.id, event.target.value as SleeperType)}
            >
              <option value="adult">Adult</option>
              <option value="child">Child</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
          </label>
        </div>

        <label style={{ display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.4rem' }}>
            <span className="tiny-label">Weight</span>
            <span className="helper-line">{Math.round(sleeper.weightLb)} lb</span>
          </div>
          <input
            type="range"
            min={species.weightRange[0]}
            max={species.weightRange[1]}
            value={sleeper.weightLb}
            onChange={(event) => onUpdateBasics(sleeper.id, { weightLb: Number(event.target.value) })}
          />
        </label>

        <div>
          <div className="tiny-label" style={{ marginBottom: '0.45rem' }}>
            Warmth
          </div>
          <div className="segmented">
            {(['cold', 'neutral', 'warm', 'hot'] as const).map((tendency) => (
              <button
                key={tendency}
                type="button"
                className={sleeper.thermalTendency === tendency ? 'is-active' : ''}
                onClick={() => onUpdateBasics(sleeper.id, { thermalTendency: tendency })}
              >
                {tendency}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="tiny-label" style={{ marginBottom: '0.45rem' }}>
            Blanket coverage
          </div>
          <div className="segmented">
            {(['none', 'partial', 'full'] as const).map((coverage) => (
              <button
                key={coverage}
                type="button"
                className={sleeper.blanketCoverage === coverage ? 'is-active' : ''}
                onClick={() => onUpdateBasics(sleeper.id, { blanketCoverage: coverage })}
              >
                {coverage}
              </button>
            ))}
          </div>
        </div>

        <details className="details-shell">
          <summary>Advanced pose and breed tweaks</summary>
          <div className="details-body">
            {breedOptions.length > 0 ? (
              <label style={{ display: 'block' }}>
                <div className="tiny-label">Breed preset</div>
                <select
                  className="field"
                  value={sleeper.breedId}
                  onChange={(event) => onSetBreed(sleeper.id, event.target.value)}
                >
                  {breedOptions.map((breed) => (
                    <option key={breed.id} value={breed.id}>
                      {breed.label} ({breed.defaultWeightLb} lb)
                    </option>
                  ))}
                </select>
              </label>
            ) : null}

            <div>
              <div className="tiny-label" style={{ marginBottom: '0.45rem' }}>
                Pose preset
              </div>
              <div className="segmented">
                {species.posePresets.map((pose) => (
                  <button
                    key={pose.id}
                    type="button"
                    className={sleeper.posePresetId === pose.id ? 'is-active' : ''}
                    onClick={() => onApplyPosePreset(sleeper.id, pose.id)}
                  >
                    {pose.label}
                  </button>
                ))}
              </div>
              <div className="helper-line" style={{ marginTop: '0.45rem' }}>
                {activePose.description}
              </div>
            </div>

            <label style={{ display: 'block' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <span className="tiny-label">Rotation</span>
                <span className="helper-line">{Math.round(sleeper.rotationDeg)} deg</span>
              </div>
              <input
                type="range"
                min={-180}
                max={180}
                value={sleeper.rotationDeg}
                onChange={(event) => onSetRotation(sleeper.id, Number(event.target.value))}
              />
            </label>

            {editableSegments.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {editableSegments.map((segment) => (
                  <label key={segment.id} style={{ display: 'block' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.25rem' }}>
                      <span className="tiny-label">{segment.label}</span>
                      <span className="helper-line">{Math.round(sleeper.poseState[segment.id] ?? 0)} deg</span>
                    </div>
                    <input
                      type="range"
                      min={segment.jointLimits[0]}
                      max={segment.jointLimits[1]}
                      value={sleeper.poseState[segment.id] ?? 0}
                      onChange={(event) =>
                        onSetSegmentAngle(sleeper.id, segment.id, Number(event.target.value))
                      }
                    />
                  </label>
                ))}
              </div>
            ) : null}
          </div>
        </details>
      </div>
    </Panel>
  );
};
