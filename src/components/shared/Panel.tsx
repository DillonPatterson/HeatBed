import type { PropsWithChildren, ReactNode } from 'react';

interface PanelProps extends PropsWithChildren {
  title: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
}

export const Panel = ({ title, eyebrow, actions, className = '', children }: PanelProps) => (
  <section className={`panel-shell ${className}`}>
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? <div className="text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-stone-500">{eyebrow}</div> : null}
        <h2 className="font-display text-[1.15rem] text-stone-900">{title}</h2>
      </div>
      {actions}
    </div>
    {children}
  </section>
);
