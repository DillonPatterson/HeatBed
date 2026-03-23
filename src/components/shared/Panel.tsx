import type { PropsWithChildren, ReactNode } from 'react';

interface PanelProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
  accent?: 'hot' | 'cool' | 'neutral';
}

const accentColors = {
  hot: 'var(--accent-hot)',
  cool: 'var(--accent-cool)',
  neutral: 'var(--accent-warm)',
};

export const Panel = ({
  title,
  eyebrow,
  actions,
  className = '',
  children,
  accent = 'neutral',
}: PanelProps) => (
  <section className={`panel-shell ${className}`.trim()}>
    <div className="panel-head">
      <div>
        {eyebrow ? (
          <div className="panel-eyebrow" style={{ color: accentColors[accent] }}>
            <span
              className="panel-dot"
              style={{
                backgroundColor: accentColors[accent],
                boxShadow: `0 0 12px ${accentColors[accent]}`,
              }}
            />
            {eyebrow}
          </div>
        ) : null}
        <h2 className="panel-title">{title}</h2>
      </div>
      {actions}
    </div>

    {children ? <div className="panel-body">{children}</div> : null}
  </section>
);
