'use client';

import { useEffect, useState } from 'react';
import { HeroCanvas } from './hero-canvas';
import { Button } from '../components/button';
import { CtaSection } from '../components/cta-section';
import { ProcessSteps } from '../components/process-steps';
import { ProductMockup } from '../components/product-mockup';
import { SectionHeader } from '../components/section-header';
import { ServiceCard } from '../components/service-card';
import { parseServicesQuery, processSteps, services } from '../data/site';

type Lead = {
  id: string;
  createdAt: string;
  services: string[];
  name: string;
  email: string;
  company: string;
  budget: string;
  brief: string;
};

const products = [
  {
    kind: 'browser' as const,
    type: 'Website system',
    name: 'Launch Kit',
    price: 'From $—',
    description: 'Ship fast with sections + tokens.',
  },
  {
    kind: 'prompt' as const,
    type: 'AI workflow',
    name: 'Prompt OS',
    price: 'From $—',
    description: 'Reusable roles, production prompts.',
  },
  {
    kind: 'board' as const,
    type: 'Operations',
    name: 'Freelance Toolkit',
    price: 'From $—',
    description: 'Proposals, scopes, handoffs kit.',
  },
];

const marqueeWords = ['Web Development', 'Creative / Graphics', 'Video / Media', 'Automation'];

const STORAGE_KEY = 'virtusLabsDemoLeads';
const SELECTION_KEY = 'virtusLabsSelectedServices';

function getStoredLeads(): Lead[] {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as Lead[];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [adminMode, setAdminMode] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const syncRoute = () => {
      const admin = window.location.hash === '#admin';
      setAdminMode(admin);
      if (admin) {
        setLeads(getStoredLeads());
        window.scrollTo(0, 0);
      }
    };

    syncRoute();
    try {
      const params = new URLSearchParams(window.location.search);
      const slugs = parseServicesQuery(params.get('services'));
      if (slugs.length) {
        setSelected(slugs);
        try {
          window.localStorage.setItem(SELECTION_KEY, JSON.stringify(slugs));
        } catch {
          // Selection persistence is best-effort.
        }
      } else {
        try {
          const stored = JSON.parse(window.localStorage.getItem(SELECTION_KEY) ?? '[]') as unknown;
          if (Array.isArray(stored)) {
            const storedSlugs = parseServicesQuery(
              stored.map((item) => String(item ?? '')).join(','),
            );
            if (storedSlugs.length) setSelected(storedSlugs);
          }
        } catch {
          // Corrupt persisted selection is ignored; selection stays manual.
        }
      }
      if (params.get('inquiry') === '1') {
        // Legacy deep link: the inquiry modal is gone, so forward to the
        // dedicated page while preserving any carried service selection.
        const carried = params.get('services');
        window.location.replace(
          carried ? `/start-project?services=${encodeURIComponent(carried)}` : '/start-project',
        );
      }
    } catch {
      // Ignore malformed query strings; selection stays manual.
    }
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SELECTION_KEY, JSON.stringify(selected));
    } catch {
      // Selection persistence is best-effort.
    }
  }, [selected]);

  const inquiryHref = selected.length
    ? `/start-project?services=${selected.join(',')}`
    : '/start-project';

  const clearLeads = () => {
    if (!window.confirm('Clear all locally stored demo inquiries?')) return;
    window.localStorage.setItem(STORAGE_KEY, '[]');
    setLeads([]);
  };

  if (adminMode) {
    const counts = leads
      .flatMap((lead) => lead.services)
      .reduce<Record<string, number>>((result, service) => {
        result[service] = (result[service] ?? 0) + 1;
        return result;
      }, {});
    const popular = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? '—';

    return (
      <div className="min-h-screen bg-[#0B0B0B]">
        <header className="border-b border-white/[.07] bg-[#111111] px-5 py-4 md:px-8">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid size-9 place-items-center rounded-full border border-[#C8A96B]/25 bg-[#C8A96B]/5 text-sm font-bold text-[#C8A96B]">
                V
              </span>
              <div>
                <div className="text-sm font-semibold tracking-[.18em]">VIRTUS LABS</div>
                <div className="text-[10px] uppercase tracking-[.18em] text-[#77736D]">
                  Admin prototype
                </div>
              </div>
            </div>
            <a
              href="#top"
              className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-[#A5A098] hover:text-white"
            >
              ← Public site
            </a>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-8 md:px-8 md:py-10">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-xs uppercase tracking-[.18em] text-[#C8A96B]">Dashboard</p>
              <h1 className="display text-5xl">Client inquiries</h1>
            </div>
            <button
              onClick={clearLeads}
              className="self-start rounded-full border border-white/10 px-4 py-2 text-xs text-[#77736D] hover:border-red-400/30 hover:text-red-300"
            >
              Clear demo leads
            </button>
          </div>

          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/[.07] bg-[#151515] p-5">
              <p className="text-xs uppercase tracking-[.14em] text-[#77736D]">Total inquiries</p>
              <p className="mt-3 text-4xl font-semibold">{leads.length}</p>
            </div>
            <div className="rounded-2xl border border-white/[.07] bg-[#151515] p-5">
              <p className="text-xs uppercase tracking-[.14em] text-[#77736D]">Most selected</p>
              <p className="mt-3 text-xl font-semibold">{popular}</p>
            </div>
            <div className="rounded-2xl border border-white/[.07] bg-[#151515] p-5">
              <p className="text-xs uppercase tracking-[.14em] text-[#77736D]">Prototype status</p>
              <p className="mt-3 text-xl font-semibold text-[#C8A96B]">Local demo</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/[.07] bg-[#151515]">
            <div className="flex items-center justify-between border-b border-white/[.07] px-5 py-4">
              <h2 className="font-semibold">Inbox</h2>
              <span className="text-[10px] uppercase tracking-[.15em] text-[#77736D]">
                Newest first
              </span>
            </div>
            <div className="divide-y divide-white/[.06]">
              {leads.length === 0 ? (
                <div className="px-5 py-16 text-center text-sm text-[#77736D]">
                  No demo inquiries yet. Submit one from the public website to see it here.
                </div>
              ) : (
                leads.map((lead) => (
                  <article
                    key={lead.id}
                    className="grid gap-4 px-5 py-5 md:grid-cols-[1fr_auto] md:items-start"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <h3 className="font-semibold text-[#F2EFE7]">{lead.name || 'Unnamed'}</h3>
                        <span className="text-xs text-[#77736D]">{lead.company}</span>
                      </div>
                      <p className="mt-1 text-xs text-[#C8A96B]">{lead.email}</p>
                      <p className="mt-3 text-sm leading-6 text-[#A5A098]">{lead.brief}</p>
                      <p className="mt-3 text-[10px] uppercase tracking-[.12em] text-[#77736D]">
                        {`${lead.services.length ? lead.services.join(' • ') : 'No service selected'} · ${lead.budget}`}
                      </p>
                    </div>
                    <time className="text-[10px] uppercase tracking-[.12em] text-[#615E59]">
                      {new Date(lead.createdAt).toLocaleString()}
                    </time>
                  </article>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-[#C8A96B]/15 bg-[#C8A96B]/[.04] p-5 text-xs leading-6 text-[#8D877D]">
            <strong className="text-[#C8A96B]">Production note:</strong> this admin screen is
            intentionally a front-end prototype. The real build should use authenticated tooling so
            client inquiries, service listings, pricing, statuses, and admin users are stored
            securely on the server.
          </div>
        </main>
      </div>
    );
  }

  return (
    <main id="top">
      {/* HERO */}
      <section className="relative min-h-screen overflow-hidden px-5 pb-14 pt-36 md:px-8 md:pt-40">
        <HeroCanvas />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(9,9,9,.15),rgba(9,9,9,.45)_70%,#090909)]" />
        <div className="relative z-10 mx-auto grid min-h-[76vh] max-w-7xl items-center lg:grid-cols-[1.08fr_.92fr]">
          <div className="max-w-4xl">
            <div className="reveal mb-7 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[.28em] text-[#C8A96B]">
              <span className="h-px w-9 bg-[#C8A96B]/70" />
              Independent digital studio
            </div>

            <h1 className="display reveal text-[clamp(4rem,10vw,9.5rem)] font-normal leading-[.82] text-[#F2EFE7]">
              Build with
              <br />
              <span className="gold-text italic">Virtus.</span>
            </h1>

            <p className="reveal mt-8 max-w-2xl text-base leading-7 text-[#A5A098] md:text-lg md:leading-8">
              Premium builds and freelance expertise — pick a service, we design and deliver.
            </p>

            <div className="reveal mt-10 flex flex-wrap items-center gap-3">
              <Button href="#services" className="group">
                Explore services
                <span className="transition-transform group-hover:translate-x-1">→</span>
              </Button>
              <Button href="#products" variant="secondary">
                Browse digital products
              </Button>
            </div>
          </div>

          <div className="relative hidden h-full min-h-[580px] lg:block" aria-hidden="true" />
        </div>

        {/* Mobile-only hero visual — lightweight CSS glow, no 3D cost */}
        <div aria-hidden="true" className="relative z-10 mx-auto mt-10 max-w-7xl lg:hidden">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[radial-gradient(circle_at_50%_0%,rgba(200,169,107,.22),transparent_60%),linear-gradient(145deg,#1e1b16,#0c0c0c)] p-4">
            <div className="mb-2 flex gap-1.5">
              <span className="size-2 rounded-full bg-white/15" />
              <span className="size-2 rounded-full bg-white/15" />
              <span className="size-2 rounded-full bg-[#C8A96B]" />
            </div>
            <div className="h-20 rounded-lg bg-white/[.05]" />
            <div className="mt-2 h-3 w-1/2 rounded bg-white/10" />
          </div>
        </div>

        <div className="relative z-10 mx-auto flex max-w-7xl items-end justify-between border-t border-white/[.07] pt-6">
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[.14em] text-[#77736D]">
            {[
              ['4', 'Core services'],
              ['1:1', 'Client focus'],
              ['∞', 'Built to scale'],
            ].map(([value, label]) => (
              <span
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[.02] px-4 py-2"
              >
                <strong className="text-sm text-[#F2EFE7]">{value}</strong> {label}
              </span>
            ))}
          </div>
          <a
            href="#services"
            className="scroll-indicator hidden text-center text-[10px] uppercase tracking-[.25em] text-[#77736D] md:block"
          >
            Scroll
          </a>
        </div>
      </section>

      {/* MARQUEE */}
      <section
        aria-label="Capabilities"
        className="overflow-hidden border-y border-white/[.06] bg-[#111111] py-4"
      >
        <div className="ticker-track flex whitespace-nowrap text-sm font-semibold uppercase tracking-[.16em] text-[#A5A098]">
          {marqueeWords.map((word, index) => (
            <span key={`${word}-${index}`} className="marquee-word">
              {word}
            </span>
          ))}
          <span aria-hidden="true" className="flex whitespace-nowrap">
            {marqueeWords.map((word, index) => (
              <span key={`${word}-dup-${index}`} className="marquee-word">
                {word}
              </span>
            ))}
          </span>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(200,169,107,.10),transparent_50%),radial-gradient(circle_at_85%_100%,rgba(142,109,63,.08),transparent_45%)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(242,239,231,.04)_1px,transparent_1px),linear-gradient(90deg,rgba(242,239,231,.04)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,black,transparent)]"
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <SectionHeader
            eyebrow="01 — Services"
            title={
              <>
                Choose what
                <br />
                <span className="italic text-[#C8A96B]">you need.</span>
              </>
            }
            lead="Pick a visual — details live on each service page."
          />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
            {services.map((service, index) => (
              <ServiceCard
                key={service.slug}
                service={service}
                index={index}
                className={
                  index % 4 === 0
                    ? 'lg:col-span-4'
                    : index % 4 === 1
                      ? 'lg:col-span-2'
                      : index % 4 === 2
                        ? 'lg:col-span-2'
                        : 'lg:col-span-4'
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section id="products" className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(200,169,107,.09),transparent_50%),radial-gradient(circle_at_10%_90%,rgba(142,109,63,.07),transparent_45%)]"
        />
        <div className="relative z-10 mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-white/[.07] bg-[#111111] px-5 py-12 md:px-10 md:py-16">
          <div className="gold-line absolute inset-x-0 top-0 h-px" aria-hidden="true" />
          <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[.25em] text-[#C8A96B]">
                02 — Digital products
              </p>
              <h2 className="display text-5xl md:text-7xl">
                Ready when <span className="italic text-[#C8A96B]">you are.</span>
              </h2>
            </div>
            <div className="flex max-w-lg flex-wrap gap-2 text-[10px] uppercase tracking-[.15em] text-[#A5A098]">
              <span className="rounded-full border border-white/10 bg-white/[.02] px-3 py-1.5">
                Concept preview
              </span>
              <span className="rounded-full border border-white/10 bg-white/[.02] px-3 py-1.5">
                No custom scope needed
              </span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {products.map((product, productIndex) => (
              <article
                key={product.name}
                className={`reveal group rounded-[1.7rem] border border-white/[.07] bg-[#151515] p-5 transition duration-500 hover:-translate-y-1 hover:border-[#C8A96B]/40 hover:shadow-[0_20px_60px_-20px_rgba(200,169,107,.25)] ${productIndex === 1 ? 'lg:-rotate-1' : productIndex === 0 ? 'lg:rotate-1' : ''}`}
              >
                <div className="mb-8 aspect-[4/3] rounded-[1.25rem] border border-white/[.06] bg-[linear-gradient(145deg,#1a1712,#0b0b0b)] p-5">
                  <ProductMockup kind={product.kind} />
                </div>
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[.18em] text-[#77736D]">
                      {product.type}
                    </p>
                    <h3 className="text-xl font-semibold">{product.name}</h3>
                  </div>
                  <span className="text-sm text-[#C8A96B]">{product.price}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#A5A098]">{product.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="relative overflow-hidden px-5 py-24 md:px-8 md:py-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(200,169,107,.08),transparent_50%)]"
        />
        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
            <div className="lg:sticky lg:top-32 lg:self-start">
              <SectionHeader
                layout="stacked"
                eyebrow="03 — Process"
                title={
                  <>
                    Clear from
                    <br />
                    <span className="italic text-[#C8A96B]">day one.</span>
                  </>
                }
                lead="Scope, milestones, decisions."
              />
              <div
                aria-hidden="true"
                className="mt-8 hidden overflow-hidden rounded-2xl border border-white/[.07] bg-[radial-gradient(circle_at_50%_0%,rgba(200,169,107,.16),transparent_60%),linear-gradient(145deg,#1a1712,#0b0b0b)] p-5 lg:block"
              >
                <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-white/[.06]">
                  <div className="h-full w-3/4 rounded-full bg-gradient-to-r from-[#8e6d3f] via-[#C8A96B] to-[#F0D9A1]" />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {['Choose', 'Scope', 'Build', 'Deliver'].map((label, i) => (
                    <div
                      key={label}
                      className="rounded-lg border border-white/[.06] bg-[#151515] p-2 text-center"
                    >
                      <div className="mx-auto mb-1.5 grid size-6 place-items-center rounded-full border border-[#C8A96B]/30 bg-[#C8A96B]/10 text-[10px] font-bold text-[#C8A96B]">
                        {i + 1}
                      </div>
                      <div className="text-[10px] uppercase tracking-[.12em] text-[#A5A098]">
                        {label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <ProcessSteps steps={processSteps} />
          </div>
        </div>
      </section>

      {/* ABOUT / CTA */}
      <section id="about" className="px-5 pb-8 md:px-8 md:pb-10">
        <CtaSection
          eyebrow="VIRTUS LABS"
          title={
            <>
              Digital work should create <span className="gold-text italic">leverage.</span>
            </>
          }
          copy="Digital products + focused services — buy what you need, skip the bloated agency process."
        >
          <Button href={inquiryHref} className="w-full">
            Tell us what you need →
          </Button>
        </CtaSection>
      </section>
    </main>
  );
}
