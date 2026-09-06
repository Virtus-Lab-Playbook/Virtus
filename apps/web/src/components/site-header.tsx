'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { normalizeToSlug, primaryNav } from '../data/site';
import { VirtusMark, Wordmark } from './brand';

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Preserve service context: on a service detail page the inquiry CTA
  // carries that service into the dedicated start-project page.
  const serviceSlug = pathname?.startsWith('/services/')
    ? normalizeToSlug(pathname.split('/')[2] ?? '')
    : undefined;
  const inquiryHref = serviceSlug ? `/start-project?services=${serviceSlug}` : '/start-project';

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-6">
      <nav
        aria-label="Main navigation"
        className="nav-shell glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3.5 md:px-6"
      >
        <a href="/" className="flex items-center gap-3" aria-label="Virtus Labs home">
          <span className="grid size-9 place-items-center rounded-full border border-[#C8A96B]/30 bg-[#C8A96B]/5">
            <VirtusMark />
          </span>
          <Wordmark />
        </a>

        <div className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[.18em] text-[#A5A098] md:flex">
          {primaryNav.map((link) => (
            <a key={link.href} href={link.href} className="transition hover:text-[#F2EFE7]">
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={inquiryHref}
            className="hidden rounded-full border border-[#C8A96B]/35 bg-[#C8A96B]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-[#F0D9A1] transition hover:border-[#C8A96B]/70 hover:bg-[#C8A96B]/20 sm:block"
          >
            Start a project
          </a>
          <button
            type="button"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            onClick={() => setMenuOpen((open) => !open)}
            className="grid size-10 place-items-center rounded-full border border-white/10 text-lg text-[#F2EFE7] transition hover:border-[#C8A96B]/50 md:hidden"
          >
            <span aria-hidden="true">{menuOpen ? '×' : '≡'}</span>
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div
          id="mobile-nav"
          className="glass mx-auto mt-2 max-w-7xl rounded-3xl px-5 py-4 md:hidden"
        >
          <ul className="grid gap-1 text-sm font-semibold uppercase tracking-[.16em] text-[#A5A098]">
            {primaryNav.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-2xl px-3 py-3 transition hover:bg-white/[.04] hover:text-[#F2EFE7]"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={inquiryHref}
                className="mt-1 block w-full rounded-full border border-[#C8A96B]/35 bg-[#C8A96B]/10 px-4 py-3 text-center text-xs font-semibold uppercase tracking-[.16em] text-[#F0D9A1]"
              >
                Start a project
              </a>
            </li>
          </ul>
        </div>
      ) : null}
    </header>
  );
}
