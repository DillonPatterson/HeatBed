import type { PropsWithChildren, ReactNode } from 'react';

interface PanelProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
  accent?: 'hot' | 'cool' | 'neutral';
  noPad?: boolean;
}

const accentColors = {
  hot: 'var(--accent-hot)',
  cool: 'var(--accent-cool)',
  neutral: 'var(--text-muted)',
};

export const Panel = ({ title, eyebrow, actions, className = '', children, accent = 'neutral', noPad }: PanelProps) => (
  <section
    className={className}
    style={{
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      padding: noPad ? 0 : '1rem',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: children ? '0.85rem' : 0,
        paddingLeft: noPad ? '1rem' : 0,
        paddingRight: noPad ? '1rem' : 0,
        paddingTop: noPad ? '0.85rem' : 0,
      }}
    >
      <div>
        {eyebrow && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              fontWeight: 700,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: accentColors[accent],
              marginBottom: '0.2rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: 4,
                height: 4,
                borderRadius: '50%',
                background: accentColors[accent],
                boxShadow: accent === 'hot' ? '0 0 6px var(--accent-hot)' : accent === 'cool' ? '0 0 6px var(--accent-cool)' : 'none',
              }}
            />
            {eyebrow}
          </div>
        )}
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            lineHeight: 1.1,
          }}
        >
          {title}
        </h2>
      </div>
      {actions}
    </div>
    {children && (
      <div style={noPad ? { padding: '0 1rem 1rem' } : {}}>
        {children}
      </div>
    )}
  </section>
);
