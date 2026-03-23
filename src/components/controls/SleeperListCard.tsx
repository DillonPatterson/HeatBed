import { Panel } from '../shared/Panel';
import type { Sleeper, SleeperType } from '../../types';

interface SleeperListCardProps {
  sleepers: Sleeper[];
  selectedSleeperId: string | null;
  onSelectSleeper: (id: string) => void;
  onAddSleeper: (type: SleeperType) => void;
  onRemoveSleeper: (id: string) => void;
}

const typeEmoji: Record<SleeperType, string> = {
  adult: '🧍',
  child: '👦',
  dog: '🐕',
  cat: '🐈',
};

const typeLabels: Record<SleeperType, string> = {
  adult: 'Adult',
  child: 'Child',
  dog: 'Dog',
  cat: 'Cat',
};

const tendencyColor: Record<string, string> = {
  cold: 'var(--accent-cool)',
  neutral: 'var(--text-secondary)',
  warm: 'var(--accent-warm)',
  hot: 'var(--accent-hot)',
};

export const SleeperListCard = ({
  sleepers,
  selectedSleeperId,
  onSelectSleeper,
  onAddSleeper,
  onRemoveSleeper,
}: SleeperListCardProps) => (
  <Panel
    title="Roster"
    eyebrow="Sleepers"
    accent="neutral"
    actions={
      <div
        style={{
          background: 'var(--bg-raised)',
          border: '1px solid var(--border)',
          borderRadius: 6,
          padding: '0.2rem 0.55rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          fontWeight: 700,
          color: sleepers.length >= 8 ? 'var(--accent-hot)' : 'var(--text-muted)',
          letterSpacing: '0.1em',
        }}
      >
        {sleepers.length}/8
      </div>
    }
  >
    {/* Add buttons */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', marginBottom: '0.75rem' }}>
      {(['adult', 'child', 'dog', 'cat'] as const).map((type) => (
        <button
          key={type}
          type="button"
          onClick={() => onAddSleeper(type)}
          disabled={sleepers.length >= 8}
          style={{
            borderRadius: 8,
            padding: '0.5rem 0.6rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.06em',
            background: 'var(--bg-raised)',
            border: '1px solid var(--border)',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            transition: 'all 120ms',
            display: 'flex',
            alignItems: 'center',
            gap: '0.3rem',
            justifyContent: 'center',
          }}
          onMouseEnter={(e) => {
            if (sleepers.length < 8) {
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,170,68,0.4)';
              (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-warm)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border)';
            (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
          }}
        >
          <span>{typeEmoji[type]}</span>
          <span>+ {typeLabels[type]}</span>
        </button>
      ))}
    </div>

    {/* Sleeper list */}
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
      {sleepers.map((sleeper) => {
        const selected = selectedSleeperId === sleeper.id;
        return (
          <div
            key={sleeper.id}
            style={{
              borderRadius: 8,
              border: selected ? `1px solid ${sleeper.color}` : '1px solid var(--border)',
              background: selected ? `${sleeper.color}14` : 'var(--bg-base)',
              transition: 'all 140ms ease',
              overflow: 'hidden',
              boxShadow: selected ? `0 0 12px ${sleeper.color}30` : 'none',
            }}
          >
            <button
              type="button"
              onClick={() => onSelectSleeper(sleeper.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0.6rem 0.75rem',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              {/* Color dot */}
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: sleeper.color,
                  boxShadow: selected ? `0 0 8px ${sleeper.color}` : 'none',
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.01em' }}>
                    {typeEmoji[sleeper.type]} {sleeper.name}
                  </span>
                </div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '0.1em', color: tendencyColor[sleeper.thermalTendency], textTransform: 'uppercase', marginTop: 1 }}>
                  {typeLabels[sleeper.type]} · {Math.round(sleeper.weightLb)}lb · {sleeper.thermalTendency}
                </div>
              </div>
              {selected && (
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.6rem',
                    color: 'var(--accent-warm)',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    flexShrink: 0,
                  }}
                >
                  ◀ ACTIVE
                </div>
              )}
            </button>
            {selected && (
              <div style={{ padding: '0 0.75rem 0.5rem' }}>
                <button
                  type="button"
                  onClick={() => onRemoveSleeper(sleeper.id)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,80,80,0.25)',
                    borderRadius: 5,
                    padding: '0.25rem 0.6rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.58rem',
                    color: 'rgba(255,80,80,0.7)',
                    cursor: 'pointer',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    transition: 'all 120ms',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255,80,80,0.1)';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgb(255,100,100)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
                    (e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,80,80,0.7)';
                  }}
                >
                  ✕ Remove
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  </Panel>
);
