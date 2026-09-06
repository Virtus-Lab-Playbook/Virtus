import type { ReactNode } from 'react';

type CtaSectionProps = {
  eyebrow: string;
  title: ReactNode;
  copy: ReactNode;
  children: ReactNode;
};

/** Full-width conversion panel: statement left, copy plus action right. */
export function CtaSection({ eyebrow, title, copy, children }: CtaSectionProps) {
  return (
    <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#C8A96B]/20 bg-[#151515] px-6 py-16 md:px-12 md:py-24">
      <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[#C8A96B]/[.08] blur-3xl" />
      <div className="gold-line absolute inset-x-0 top-0 h-px" />
      <div className="relative z-10 grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
        <div className="reveal">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[.25em] text-[#C8A96B]">
            {eyebrow}
          </p>
          <h2 className="display max-w-4xl text-5xl leading-[.94] md:text-7xl lg:text-8xl">
            {title}
          </h2>
        </div>
        <div className="reveal lg:pb-2">
          <p className="mb-7 text-sm leading-7 text-[#A5A098]">{copy}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
