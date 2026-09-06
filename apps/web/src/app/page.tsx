'use client';

import { useEffect, useState } from 'react';
import type {
  FormEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react';
import { HeroCanvas } from './hero-canvas';

type Service = {
  name: string;
  description: string;
  tags: string[];
};

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

const services: Service[] = [
  {
    name: 'Web Development',
    description:
      'Fast, responsive, conversion-focused websites and web applications built around your business goals.',
    tags: ['Landing Pages', 'Web Apps', 'E-commerce'],
  },
  {
    name: 'UI/UX Design',
    description:
      'Interfaces designed for clarity, confidence, usability, and a visual identity people remember.',
    tags: ['Wireframes', 'Design Systems', 'Prototypes'],
  },
  {
    name: 'Brand Identity',
    description:
      'Strategic identity systems that give your company a coherent visual language across every touchpoint.',
    tags: ['Logo', 'Visual System', 'Guidelines'],
  },
  {
    name: 'AI & Automation',
    description:
      'Automate repetitive work, connect tools, and integrate practical AI workflows into your operations.',
    tags: ['Workflows', 'AI Tools', 'Integrations'],
  },
  {
    name: 'Digital Products',
    description:
      'Templates, toolkits, prompts, systems, and ready-to-use assets designed to move faster.',
    tags: ['Templates', 'Toolkits', 'Prompt Systems'],
  },
  {
    name: 'Creative Consulting',
    description:
      'A focused partner for positioning, product ideas, digital strategy, and creative problem solving.',
    tags: ['Strategy', 'Direction', 'Audit'],
  },
];

const products = [
  {
    number: '01',
    type: 'Website system',
    name: 'Launch Kit',
    price: 'From $—',
    description:
      'A high-quality website starter system with sections, design tokens, and launch checklist.',
    visual:
      'bg-[radial-gradient(circle_at_60%_35%,rgba(200,169,107,.25),transparent_18%),linear-gradient(145deg,#1e1b16,#0c0c0c)]',
  },
  {
    number: '02',
    type: 'AI workflow',
    name: 'Prompt OS',
    price: 'From $—',
    description:
      'A structured library for reusable AI workflows, role prompts, and production-ready prompt systems.',
    visual:
      'bg-[radial-gradient(circle_at_35%_45%,rgba(200,169,107,.19),transparent_20%),linear-gradient(145deg,#171717,#0b0b0b)]',
  },
  {
    number: '03',
    type: 'Operations',
    name: 'Freelance Toolkit',
    price: 'From $—',
    description:
      'Templates for proposals, scopes, project handoffs, client intake, and delivery workflows.',
    visual:
      'bg-[radial-gradient(circle_at_50%_50%,rgba(142,109,63,.23),transparent_22%),linear-gradient(145deg,#1b1813,#0a0a0a)]',
  },
];

const processSteps = [
  [
    '01',
    'Choose',
    "Select the services or products that fit the outcome you're trying to achieve.",
  ],
  [
    '02',
    'Scope',
    'We turn your request into deliverables, priorities, timeline, assumptions, and a clear engagement plan.',
  ],
  [
    '03',
    'Build',
    'Design and development happen in visible milestones with decisions captured along the way.',
  ],
  [
    '04',
    'Deliver',
    'You receive a polished result, handoff materials, and a clean path for support or future expansion.',
  ],
];

const marqueeWords = [
  'Web Development',
  'UI / UX Design',
  'Brand Identity',
  'AI Automation',
  'Digital Products',
  'Creative Consulting',
];

const STORAGE_KEY = 'virtusLabsDemoLeads';

function getStoredLeads(): Lead[] {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as Lead[];
  } catch {
    return [];
  }
}

export default function HomePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [adminMode, setAdminMode] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [year, setYear] = useState('');

  useEffect(() => {
    const syncRoute = () => {
      const admin = window.location.hash === '#admin';
      setAdminMode(admin);
      if (admin) {
        setLeads(getStoredLeads());
        window.scrollTo(0, 0);
      }
    };

    setYear(String(new Date().getFullYear()));
    syncRoute();
    window.addEventListener('hashchange', syncRoute);
    return () => window.removeEventListener('hashchange', syncRoute);
  }, []);

  useEffect(() => {
    document.body.style.overflow = modalOpen ? 'hidden' : '';
    if (modalOpen) {
      const timer = window.setTimeout(() => {
        document.querySelector<HTMLInputElement>('#inquiry-form input[name="name"]')?.focus();
      }, 250);
      return () => {
        window.clearTimeout(timer);
        document.body.style.overflow = '';
      };
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [modalOpen]);

  useEffect(() => {
    if (!modalOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setModalOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [modalOpen]);

  useEffect(() => {
    const revealItems = document.querySelectorAll<HTMLElement>('.reveal');
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('is-visible');
        }),
      { threshold: 0.12 },
    );
    revealItems.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [adminMode]);

  const toggleService = (name: string) => {
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    );
  };

  const trackPointer = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty(
      '--mx',
      `${((event.clientX - bounds.left) / bounds.width) * 100}%`,
    );
    event.currentTarget.style.setProperty(
      '--my',
      `${((event.clientY - bounds.top) / bounds.height) * 100}%`,
    );
  };

  const openInquiry = () => {
    setSubmitted(false);
    setModalOpen(true);
  };

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lead: Lead = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      services: selected,
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      company: String(data.get('company') ?? ''),
      budget: String(data.get('budget') ?? 'Not sure yet'),
      brief: String(data.get('brief') ?? ''),
    };
    const nextLeads = [lead, ...getStoredLeads()];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLeads));
    setLeads(nextLeads);
    setSubmitted(true);
    event.currentTarget.reset();
  };

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
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-8 md:pt-6">
        <nav
          className="nav-shell glass mx-auto flex max-w-7xl items-center justify-between rounded-full px-5 py-3.5 md:px-6"
          aria-label="Main navigation"
        >
          <a href="#top" className="flex items-center gap-3" aria-label="Virtus Labs home">
            <span className="grid size-9 place-items-center rounded-full border border-[#C8A96B]/30 bg-[#C8A96B]/5">
              <svg viewBox="0 0 40 40" className="size-5" aria-hidden="true">
                <path d="M7 8h7l6 17L26 8h7L22.5 33h-5z" fill="#C8A96B" />
              </svg>
            </span>
            <span className="text-sm font-semibold tracking-[.24em]">
              VIRTUS <span className="text-[#C8A96B]">LABS</span>
            </span>
          </a>

          <div className="hidden items-center gap-7 text-xs font-medium uppercase tracking-[.18em] text-[#A5A098] md:flex">
            <a href="#services" className="transition hover:text-[#F2EFE7]">
              Services
            </a>
            <a href="#products" className="transition hover:text-[#F2EFE7]">
              Products
            </a>
            <a href="#process" className="transition hover:text-[#F2EFE7]">
              Process
            </a>
            <a href="#about" className="transition hover:text-[#F2EFE7]">
              About
            </a>
          </div>

          <button
            onClick={openInquiry}
            className="rounded-full border border-[#C8A96B]/35 bg-[#C8A96B]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-[#F0D9A1] transition hover:border-[#C8A96B]/70 hover:bg-[#C8A96B]/20"
          >
            Start a project
          </button>
        </nav>
      </header>

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
                Premium digital products and freelance expertise for businesses that need more than
                a template. Choose the service you need. We design the path, build the system, and
                deliver the result.
              </p>

              <div className="reveal mt-10 flex flex-wrap items-center gap-3">
                <a
                  href="#services"
                  className="group inline-flex items-center gap-3 rounded-full bg-[#C8A96B] px-6 py-3.5 text-sm font-bold text-[#090909] transition hover:bg-[#E0C789]"
                >
                  Explore services
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </a>
                <a
                  href="#products"
                  className="rounded-full border border-white/10 bg-white/[.03] px-6 py-3.5 text-sm font-semibold text-[#F2EFE7] transition hover:border-[#C8A96B]/35 hover:bg-white/[.05]"
                >
                  Browse digital products
                </a>
              </div>
            </div>

            <div className="relative hidden h-full min-h-[580px] lg:block" aria-hidden="true" />
          </div>

          <div className="relative z-10 mx-auto flex max-w-7xl items-end justify-between border-t border-white/[.07] pt-6">
            <div className="grid grid-cols-3 gap-8 text-xs uppercase tracking-[.14em] text-[#77736D]">
              <div>
                <span className="block text-lg font-semibold tracking-normal text-[#F2EFE7]">
                  6+
                </span>{' '}
                Core services
              </div>
              <div>
                <span className="block text-lg font-semibold tracking-normal text-[#F2EFE7]">
                  1:1
                </span>{' '}
                Client focus
              </div>
              <div>
                <span className="block text-lg font-semibold tracking-normal text-[#F2EFE7]">
                  ∞
                </span>{' '}
                Built to scale
              </div>
            </div>
            <div className="scroll-indicator hidden text-center text-[10px] uppercase tracking-[.25em] text-[#77736D] md:block">
              Scroll
            </div>
          </div>
        </section>

        {/* MARQUEE */}
        <section className="overflow-hidden border-y border-white/[.06] bg-[#111111] py-4">
          <div className="ticker-track flex whitespace-nowrap text-sm font-semibold uppercase tracking-[.16em] text-[#A5A098]">
            {[...marqueeWords, ...marqueeWords].map((word, index) => (
              <span key={`${word}-${index}`} className="marquee-word">
                {word}
              </span>
            ))}
          </div>
        </section>

        {/* SERVICES */}
        <section id="services" className="px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mb-14 grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
              <div className="reveal">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[.25em] text-[#C8A96B]">
                  01 — Services
                </p>
                <h2 className="display text-5xl leading-none md:text-7xl">
                  Choose what
                  <br />
                  <span className="italic text-[#C8A96B]">you need.</span>
                </h2>
              </div>
              <p className="reveal max-w-xl justify-self-end text-sm leading-7 text-[#A5A098] md:text-base">
                Select one or combine several. Your choices will be carried into the project inquiry
                so you don&apos;t have to explain everything twice.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => {
                const isSelected = selected.includes(service.name);
                return (
                  <article
                    key={service.name}
                    className={`service-card reveal cursor-pointer rounded-[1.7rem] border border-white/[.08] bg-[#151515] p-6 md:p-7 ${isSelected ? 'selected' : ''}`}
                    data-service={service.name}
                    onPointerMove={trackPointer}
                    onClick={() => toggleService(service.name)}
                  >
                    <div className="mb-16 flex items-start justify-between">
                      <span className="text-xs font-semibold tracking-[.16em] text-[#77736D]">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <button
                        className="select-mark grid size-9 place-items-center rounded-full border border-white/10 text-[#A5A098] transition"
                        aria-label={`Select ${service.name}`}
                        onClick={(event) => {
                          event.stopPropagation();
                          toggleService(service.name);
                        }}
                      >
                        {isSelected ? '✓' : '+'}
                      </button>
                    </div>
                    <h3 className="mb-3 text-2xl font-semibold">{service.name}</h3>
                    <p className="text-sm leading-6 text-[#A5A098]">{service.description}</p>
                    <div className="mt-7 flex flex-wrap gap-2 text-[10px] uppercase tracking-[.12em] text-[#77736D]">
                      {service.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>

            <div
              className={`glass sticky bottom-4 z-30 mx-auto mt-8 flex max-w-3xl items-center justify-between rounded-full px-5 py-3 shadow-2xl transition-all duration-500 ${
                selected.length
                  ? 'translate-y-0 opacity-100'
                  : 'pointer-events-none translate-y-24 opacity-0'
              }`}
              aria-hidden={selected.length === 0}
            >
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[.2em] text-[#77736D]">
                  Selected services
                </p>
                <p className="truncate text-sm font-medium text-[#F2EFE7]">
                  {selected.length
                    ? `${selected.length} selected — ${selected.join(', ')}`
                    : 'None selected'}
                </p>
              </div>
              <button
                onClick={openInquiry}
                className="ml-4 shrink-0 rounded-full bg-[#C8A96B] px-5 py-2.5 text-xs font-bold uppercase tracking-[.12em] text-[#090909]"
              >
                Continue →
              </button>
            </div>
          </div>
        </section>

        {/* PRODUCTS */}
        <section
          id="products"
          className="border-y border-white/[.06] bg-[#111111] px-5 py-24 md:px-8 md:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="reveal mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[.25em] text-[#C8A96B]">
                  02 — Digital products
                </p>
                <h2 className="display text-5xl md:text-7xl">
                  Ready when <span className="italic text-[#C8A96B]">you are.</span>
                </h2>
              </div>
              <p className="max-w-lg text-sm leading-7 text-[#A5A098]">
                For clients who need a proven starting point instead of a fully custom engagement.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product.name}
                  className="reveal group rounded-[1.7rem] border border-white/[.07] bg-[#151515] p-5 transition hover:border-[#C8A96B]/30"
                >
                  <div
                    className={`mb-8 aspect-[4/3] rounded-[1.25rem] border border-white/[.06] p-5 ${product.visual}`}
                  >
                    <div className="grid h-full place-items-center rounded-xl border border-[#C8A96B]/15">
                      <span className="display text-5xl italic text-[#C8A96B]">
                        {product.number}
                      </span>
                    </div>
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
        <section id="process" className="px-5 py-24 md:px-8 md:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr]">
              <div className="reveal lg:sticky lg:top-32 lg:self-start">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[.25em] text-[#C8A96B]">
                  03 — Process
                </p>
                <h2 className="display text-5xl leading-[.95] md:text-7xl">
                  Clear from
                  <br />
                  <span className="italic text-[#C8A96B]">day one.</span>
                </h2>
                <p className="mt-6 max-w-md text-sm leading-7 text-[#A5A098]">
                  No mystery process. Every project moves through a simple system designed to keep
                  expectations, scope, and decisions visible.
                </p>
              </div>

              <div className="divide-y divide-white/[.08] border-y border-white/[.08]">
                {processSteps.map(([number, title, description]) => (
                  <div
                    key={number}
                    className="reveal grid gap-6 py-8 md:grid-cols-[80px_1fr] md:py-10"
                  >
                    <span className="text-xs font-semibold text-[#C8A96B]">{number}</span>
                    <div>
                      <h3 className="mb-2 text-2xl font-semibold">{title}</h3>
                      <p className="max-w-xl text-sm leading-7 text-[#A5A098]">{description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT / CTA */}
        <section id="about" className="px-5 pb-8 md:px-8 md:pb-10">
          <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-[#C8A96B]/20 bg-[#151515] px-6 py-16 md:px-12 md:py-24">
            <div className="absolute -right-20 -top-20 size-80 rounded-full bg-[#C8A96B]/[.08] blur-3xl" />
            <div className="gold-line absolute inset-x-0 top-0 h-px" />
            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.3fr_.7fr] lg:items-end">
              <div className="reveal">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[.25em] text-[#C8A96B]">
                  VIRTUS LABS
                </p>
                <h2 className="display max-w-4xl text-5xl leading-[.94] md:text-7xl lg:text-8xl">
                  Digital work should create <span className="gold-text italic">leverage.</span>
                </h2>
              </div>
              <div className="reveal lg:pb-2">
                <p className="mb-7 text-sm leading-7 text-[#A5A098]">
                  Virtus Labs combines digital products with focused freelance services so clients
                  can buy what they need without entering a bloated agency process.
                </p>
                <button
                  onClick={openInquiry}
                  className="w-full rounded-full bg-[#C8A96B] px-6 py-4 text-sm font-bold text-[#090909] transition hover:bg-[#E0C789]"
                >
                  Tell us what you need →
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="px-5 py-8 md:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/[.07] pt-8 text-xs text-[#77736D] md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-semibold tracking-[.18em] text-[#F2EFE7]">
              VIRTUS <span className="text-[#C8A96B]">LABS</span>
            </span>
            <span className="ml-3">© {year}</span>
          </div>
          <div className="flex flex-wrap gap-5 uppercase tracking-[.14em]">
            <a href="#services" className="hover:text-[#C8A96B]">
              Services
            </a>
            <a href="#products" className="hover:text-[#C8A96B]">
              Products
            </a>
            <a href="mailto:hello@virtuslabs.example" className="hover:text-[#C8A96B]">
              Email
            </a>
            <a href="#admin" className="hover:text-[#C8A96B]">
              Admin demo
            </a>
          </div>
        </div>
      </footer>

      {/* INQUIRY MODAL */}
      <div
        className={`modal-backdrop fixed inset-0 z-[100] grid place-items-center bg-black/75 p-3 backdrop-blur-sm ${modalOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="inquiry-title"
        onMouseDown={(event: ReactMouseEvent<HTMLDivElement>) => {
          if (event.target === event.currentTarget) setModalOpen(false);
        }}
      >
        <div className="modal-panel max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-[1.75rem] border border-[#C8A96B]/20 bg-[#111111] shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/[.07] px-6 py-5 md:px-8">
            <div>
              <p className="text-[10px] uppercase tracking-[.2em] text-[#C8A96B]">
                Project inquiry
              </p>
              <h2 id="inquiry-title" className="mt-1 text-xl font-semibold">
                Tell us what you&apos;re building.
              </h2>
            </div>
            <button
              onClick={() => setModalOpen(false)}
              className="grid size-10 place-items-center rounded-full border border-white/10 text-xl text-[#A5A098] hover:text-white"
              aria-label="Close inquiry"
            >
              ×
            </button>
          </div>

          {submitted ? (
            <div className="p-10 text-center md:p-14">
              <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full border border-[#C8A96B]/30 bg-[#C8A96B]/10 text-2xl text-[#C8A96B]">
                ✓
              </div>
              <h3 className="display text-4xl">Inquiry captured.</h3>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#A5A098]">
                This demo saved the lead locally. In production, Virtus Labs can route it to the
                admin dashboard, email, CRM, or automation workflow.
              </p>
              <button
                onClick={() => setModalOpen(false)}
                className="mt-7 rounded-full border border-white/10 px-5 py-3 text-sm hover:border-[#C8A96B]/30"
              >
                Back to site
              </button>
            </div>
          ) : (
            <form onSubmit={submitInquiry} className="grid gap-6 p-6 md:p-8">
              <div>
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[.14em] text-[#A5A098]">
                  Selected services
                </span>
                <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-white/[.07] bg-white/[.02] p-3 text-sm text-[#A5A098]">
                  {selected.length ? (
                    selected.map((name) => (
                      <span
                        key={name}
                        className="rounded-full border border-[#C8A96B]/20 bg-[#C8A96B]/10 px-3 py-1.5 text-xs text-[#E0C789]"
                      >
                        {name}
                      </span>
                    ))
                  ) : (
                    <>No services selected yet.</>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[#A5A098]">
                  Name
                  <input
                    required
                    name="name"
                    className="rounded-xl border border-white/[.09] bg-[#090909] px-4 py-3.5 text-[#F2EFE7] outline-none transition focus:border-[#C8A96B]/60"
                    placeholder="Your name"
                  />
                </label>
                <label className="grid gap-2 text-sm text-[#A5A098]">
                  Email
                  <input
                    required
                    type="email"
                    name="email"
                    className="rounded-xl border border-white/[.09] bg-[#090909] px-4 py-3.5 text-[#F2EFE7] outline-none transition focus:border-[#C8A96B]/60"
                    placeholder="you@company.com"
                  />
                </label>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="grid gap-2 text-sm text-[#A5A098]">
                  Company / Brand
                  <input
                    name="company"
                    className="rounded-xl border border-white/[.09] bg-[#090909] px-4 py-3.5 text-[#F2EFE7] outline-none transition focus:border-[#C8A96B]/60"
                    placeholder="Optional"
                  />
                </label>
                <label className="grid gap-2 text-sm text-[#A5A098]">
                  Budget range
                  <select
                    name="budget"
                    defaultValue="Not sure yet"
                    className="rounded-xl border border-white/[.09] bg-[#090909] px-4 py-3.5 text-[#F2EFE7] outline-none transition focus:border-[#C8A96B]/60"
                  >
                    <option value="Not sure yet">Not sure yet</option>
                    <option>Starter</option>
                    <option>Growth</option>
                    <option>Custom / Enterprise</option>
                  </select>
                </label>
              </div>

              <label className="grid gap-2 text-sm text-[#A5A098]">
                What do you need?
                <textarea
                  required
                  name="brief"
                  rows={5}
                  className="resize-none rounded-xl border border-white/[.09] bg-[#090909] px-4 py-3.5 text-[#F2EFE7] outline-none transition focus:border-[#C8A96B]/60"
                  placeholder="Tell us the outcome you want, current problem, deadline, or anything useful."
                />
              </label>

              <label className="flex items-start gap-3 text-xs leading-5 text-[#77736D]">
                <input required type="checkbox" className="mt-1 accent-[#C8A96B]" /> I agree to be
                contacted about this project inquiry.
              </label>

              <button
                type="submit"
                className="rounded-full bg-[#C8A96B] px-6 py-4 text-sm font-bold text-[#090909] transition hover:bg-[#E0C789]"
              >
                Submit inquiry →
              </button>
              <p className="text-center text-[11px] leading-5 text-[#615E59]">
                Prototype behavior: submissions are stored only in this browser for the demo admin
                dashboard. Production should connect this form to an API with authenticated admin
                tooling.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
