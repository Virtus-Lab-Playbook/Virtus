import type { ReactNode } from 'react';

type SectionHeaderProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  /** Split renders title left / lead right; stacked renders a vertical block. */
  layout?: 'split' | 'stacked';
};

export function SectionHeader({ eyebrow, title, lead, layout = 'split' }: SectionHeaderProps) {
  if (layout === 'stacked') {
    return (
      <div className="reveal">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.25em] text-[#C8A96B]">
          {eyebrow}
        </p>
        <h2 className="display text-5xl leading-[.95] md:text-7xl">{title}</h2>
        {lead ? (
          <p className="mt-6 max-w-xl text-sm leading-7 text-[#A5A098] md:text-base">{lead}</p>
        ) : null}
      </div>
    );
  }

  return (
    <div className="mb-14 grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
      <div className="reveal">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.25em] text-[#C8A96B]">
          {eyebrow}
        </p>
        <h2 className="display text-5xl leading-none md:text-7xl">{title}</h2>
      </div>
      {lead ? (
        <p className="reveal max-w-xl justify-self-end text-sm leading-7 text-[#A5A098] md:text-base">
          {lead}
        </p>
      ) : null}
    </div>
  );
}
