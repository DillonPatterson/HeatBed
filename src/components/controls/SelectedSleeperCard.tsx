import { getBreedOptions, getPosePreset, getSpeciesProfile } from '../../simulation/presets/resolveSleeperPreset';
import { Panel } from '../shared/Panel';
import type { Sleeper, SleeperType } from '../../types';

interface SelectedSleeperCardProps {
  sleeper?: Sleeper;
  onUpdateBasics: (id: string, patch: Partial<Pick<Sleeper, 'name' | 'weightLb' | 'thermalTendency' | 'blanketCoverage'>>) => void;
  onSetType: (id: string, type: SleeperType) => void;
  onSetBreed: (id: string, breedId?: string) => void;
  onApplyPosePreset: (id: string, posePresetId: string) => void;
  onSetRotation: (id: string, rotationDeg: number) => void;
  onSetSegmentAngle: (id: string, segmentId: string, angle: number) => void;
}

const tendencyStyles: Record<string, { bg: string; color: string; border: string }> = {
  cold: { bg: 'rgba(46,184,255,0.1)', color: 'var(--accent-cool)', border: 'rgba(46,184,255,0.3)' },
  neutral: { bg: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: 'var(--border)' },
  warm: { bg: 'rgba(255,170,68,0.1)', color: 'var(--accent-warm)', border: 'rgba(255,170,68,0.3)' },
  hot: { bg: 'rgba(255,94,26,0.12)', color: 'var(--accent-hot)', border: 'rgba(255,94,26,0.35)' },
};

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
      <Panel title="Editor" eyebrow="Selected" accent="neutral">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            color: 'var(--text-muted)',
            textAlign: 'center',
            padding: '1.5rem 0',
            letterSpacing: '0.06em',
          }}
        >
          Select a sleeper to edit
        </div>
      </Panel>
    );
  }

  const species = getSpeciesProfile(sleeper.type);
  const breedOptions = getBreedOptions(sleeper.type);
  const editableSegments = species.rig.segments.filter((s) =>
    species.rig.editableSegments.includes(s.id),
  );

  return (
    <Panel title={sleeper.name} eyebrow="Editor" accent="hot">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>

        {/* Name */}
        <label style={{ display: 'block' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.3rem' }}>
            Name
          </div>
          <input
            value={sleeper.name}
            onChange={(e) => onUpdateBasics(sleeper.id, { name: e.target.value })}
            className="field"
          />
        </label>

        {/* Type + Blanket coverage */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <label style={{ display: 'block' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.3rem' }}>
              Type
            </div>
            <select value={sleeper.type} onChange={(e) => onSetType(sleeper.id, e.target.value as SleeperType)} className="field">
              <option value="adult">Adult</option>
              <option value="child">Child</option>
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
            </select>
          </label>
          <label style={{ display: 'block' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.3rem' }}>
              Blanket
            </div>
            <select
              value={sleeper.blanketCoverage}
              onChange={(e) => onUpdateBasics(sleeper.id, { blanketCoverage: e.target.value as Sleeper['blanketCoverage'] })}
              className="field"
            >
              <option value="none">None</option>
              <option value="partial">Partial</option>
              <option value="full">Full</option>
            </select>
          </label>
        </div>

        {/* Breed preset */}
        {breedOptions.length > 0 && (
          <label style={{ display: 'block' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.3rem' }}>
              {sleeper.type === 'dog' ? 'Breed' : 'Preset'}
            </div>
            <select value={sleeper.breedId} onChange={(e) => onSetBreed(sleeper.id, e.target.value)} className="field">
              {breedOptions.map((breed) => (
                <option key={breed.id} value={breed.id}>
                  {breed.label} · {breed.defaultWeightLb}lb
                </option>
              ))}
            </select>
          </label>
        )}

        {/* Weight */}
        <label style={{ display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Weight</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-warm)' }}>
              {Math.round(sleeper.weightLb)} lb
            </span>
          </div>
          <input
            type="range"
            min={species.weightRange[0]}
            max={species.weightRange[1]}
            value={sleeper.weightLb}
            onChange={(e) => onUpdateBasics(sleeper.id, { weightLb: Number(e.target.value) })}
          />
        </label>

        {/* Thermal tendency */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.4rem' }}>
            Thermal tendency
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4 }}>
            {(['cold', 'neutral', 'warm', 'hot'] as const).map((tendency) => {
              const active = sleeper.thermalTendency === tendency;
              const s = tendencyStyles[tendency];
              return (
                <button
                  key={tendency}
                  type="button"
                  onClick={() => onUpdateBasics(sleeper.id, { thermalTendency: tendency })}
                  style={{
                    borderRadius: 6,
                    padding: '0.4rem 0.2rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    border: `1px solid ${active ? s.border : 'var(--border)'}`,
                    background: active ? s.bg : 'transparent',
                    color: active ? s.color : 'var(--text-muted)',
                    transition: 'all 120ms',
                  }}
                >
                  {tendency}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pose presets */}
        <div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.4rem' }}>
            Pose preset
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {species.posePresets.map((pose) => {
              const active = sleeper.posePresetId === pose.id;
              return (
                <button
                  key={pose.id}
                  type="button"
                  onClick={() => onApplyPosePreset(sleeper.id, pose.id)}
                  title={pose.description}
                  style={{
                    borderRadius: 6,
                    padding: '0.35rem 0.65rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.62rem',
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    border: `1px solid ${active ? 'rgba(255,170,68,0.5)' : 'var(--border)'}`,
                    background: active ? 'rgba(255,170,68,0.12)' : 'transparent',
                    color: active ? 'var(--accent-warm)' : 'var(--text-secondary)',
                    transition: 'all 120ms',
                    boxShadow: active ? '0 0 8px rgba(255,170,68,0.2)' : 'none',
                  }}
                >
                  {pose.label}
                </button>
              );
            })}
          </div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: '0.4rem', lineHeight: 1.4 }}>
            {getPosePreset(sleeper.type, sleeper.posePresetId).description}
          </div>
        </div>

        {/* Rotation */}
        <label style={{ display: 'block' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em' }}>Rotation</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              {Math.round(sleeper.rotationDeg)}°
            </span>
          </div>
          <input
            type="range"
            min={-180}
            max={180}
            value={sleeper.rotationDeg}
            onChange={(e) => onSetRotation(sleeper.id, Number(e.target.value))}
          />
        </label>

        {/* Joint sliders */}
        {editableSegments.length > 0 && (
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.18em', marginBottom: '0.5rem' }}>
              Joint tweaks
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {editableSegments.map((segment) => (
                <label key={segment.id} style={{ display: 'block' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {segment.label}
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', color: 'var(--text-secondary)' }}>
                      {Math.round(sleeper.poseState[segment.id] ?? 0)}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={segment.jointLimits[0]}
                    max={segment.jointLimits[1]}
                    value={sleeper.poseState[segment.id] ?? 0}
                    onChange={(e) => onSetSegmentAngle(sleeper.id, segment.id, Number(e.target.value))}
                  />
                </label>
              ))}
            </div>
          </div>
        )}
      </div>
    </Panel>
  );
};
