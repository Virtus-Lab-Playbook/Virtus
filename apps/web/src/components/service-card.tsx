import type { ReactNode } from 'react';
import type { Service } from '../data/site';

type ServiceCardProps = {
  service: Service;
  index: number;
  className?: string;
};

const ICONS: Record<string, ReactNode> = {
  'web-development': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className="size-5"
    >
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M3 9h18M7 7h2" />
    </svg>
  ),
  'creative-graphics': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className="size-5"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" opacity=".25" />
    </svg>
  ),
  'video-media': (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className="size-5"
    >
      <rect x="3" y="6" width="18" height="12" rx="3" />
      <path d="M10.5 9.8v4.4L14.5 12Z" />
    </svg>
  ),
  automation: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className="size-5"
    >
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M6 6l2 2M16 16l2 2M18 6l-2 2M8 16l-2 2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  default: (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
      className="size-5"
    >
      <circle cx="12" cy="12" r="8" />
      <path d="M12 4a8 8 0 0 1 0 16Z" fill="currentColor" opacity=".25" />
    </svg>
  ),
};

/** Selectable-offer card linking to the dedicated service detail page. */
export function ServiceCard({ service, index, className }: ServiceCardProps) {
  return (
    <a
      href={`/services/${service.slug}`}
      aria-labelledby={`service-title-${service.slug}`}
      className={`service-card reveal group block overflow-hidden rounded-[1.7rem] border border-white/[.08] bg-[#151515] select-none transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_60px_-20px_rgba(200,169,107,.25)] ${className ?? ''}`}
    >
      <div
        aria-hidden="true"
        className="relative h-28 overflow-hidden border-b border-white/[.06] bg-[radial-gradient(circle_at_70%_20%,rgba(200,169,107,.22),transparent_55%),linear-gradient(145deg,#1e1b16,#0c0c0c)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(rgba(242,239,231,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(242,239,231,.06)_1px,transparent_1px)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_70%_80%_at_50%_0%,black,transparent)]" />
        <div className="absolute bottom-3 left-5 flex items-center gap-3 text-[#C8A96B]">
          {ICONS[service.slug] ?? ICONS['default']}
          <span className="text-xs font-semibold tracking-[.16em] text-[#77736D]">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
        <span className="absolute right-4 top-4 grid size-9 place-items-center rounded-full border border-white/10 text-[#A5A098] transition group-hover:border-[#C8A96B]/50 group-hover:text-[#F0D9A1]">
          →
        </span>
      </div>
      <div className="p-6 md:p-7">
        <h3 id={`service-title-${service.slug}`} className="mb-3 text-2xl font-semibold">
          {service.name}
        </h3>
        <p className="line-clamp-2 text-sm leading-6 text-[#A5A098]">{service.description}</p>
        <div className="mt-7 flex flex-wrap gap-2 text-[10px] uppercase tracking-[.12em] text-[#77736D]">
          {service.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/10 bg-white/[.02] px-3 py-1"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="mt-7 text-xs font-semibold uppercase tracking-[.16em] text-[#C8A96B]">
          View service + work →
        </p>
      </div>
    </a>
  );
}
