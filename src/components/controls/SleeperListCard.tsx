import { Panel } from '../shared/Panel';
import type { Sleeper, SleeperType } from '../../types';

interface SleeperListCardProps {
  sleepers: Sleeper[];
  selectedSleeperId: string | null;
  onSelectSleeper: (id: string) => void;
  onAddSleeper: (type: SleeperType) => void;
  onRemoveSleeper: (id: string) => void;
}

const typeLabels: Record<SleeperType, string> = {
  adult: 'Adult',
  child: 'Kid',
  dog: 'Dog',
  cat: 'Cat',
};

const tendencyLabels: Record<string, string> = {
  cold: 'runs cold',
  neutral: 'neutral',
  warm: 'runs warm',
  hot: 'radiator',
};

export const SleeperListCard = ({
  sleepers,
  selectedSleeperId,
  onSelectSleeper,
  onAddSleeper,
  onRemoveSleeper,
}: SleeperListCardProps) => (
  <Panel
    title="Who is in bed?"
    eyebrow="scene"
    accent="cool"
    actions={<div className="hero-badge">{sleepers.length}/8 in the pile</div>}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      <div className="add-row">
        {(['adult', 'child', 'dog', 'cat'] as const).map((type) => (
          <button
            key={type}
            type="button"
            className="add-btn"
            disabled={sleepers.length >= 8}
            onClick={() => onAddSleeper(type)}
          >
            + {typeLabels[type]}
          </button>
        ))}
      </div>

      <div className="sleeper-grid">
        {sleepers.map((sleeper) => {
          const isActive = sleeper.id === selectedSleeperId;

          return (
            <div
              key={sleeper.id}
              className={`sleeper-card ${isActive ? 'is-active' : ''}`.trim()}
              style={
                {
                  '--sleeper-accent': sleeper.color,
                } as React.CSSProperties
              }
            >
              <button type="button" className="sleeper-card-hit" onClick={() => onSelectSleeper(sleeper.id)}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div>
                    <div className="tiny-label">{typeLabels[sleeper.type]}</div>
                    <div className="sleeper-name">{sleeper.name}</div>
                  </div>
                  {isActive ? <div className="mini-tag">active</div> : null}
                </div>

                <div className="helper-line" style={{ marginTop: '0.35rem' }}>
                  {Math.round(sleeper.weightLb)} lb, {tendencyLabels[sleeper.thermalTendency]}
                </div>
              </button>

              {isActive ? (
                <button type="button" className="remove-btn" onClick={() => onRemoveSleeper(sleeper.id)}>
                  Remove
                </button>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  </Panel>
);
