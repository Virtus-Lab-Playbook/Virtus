'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '../../components/button';
import { FormField } from '../../components/form-field';
import { SectionHeader } from '../../components/section-header';
import { StatusMessage } from '../../components/status-message';
import { parseServicesQuery, slugToName } from '../../data/site';

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

const STORAGE_KEY = 'virtusLabsDemoLeads';
const SELECTION_KEY = 'virtusLabsSelectedServices';

function getStoredLeads(): Lead[] {
  try {
    return JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]') as Lead[];
  } catch {
    return [];
  }
}

function persistSelection(slugs: string[]): void {
  try {
    window.localStorage.setItem(SELECTION_KEY, JSON.stringify(slugs));
  } catch {
    // Selection persistence is best-effort.
  }
}

export function InquiryForm() {
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>(() =>
    parseServicesQuery(searchParams.get('services')),
  );
  const [submitted, setSubmitted] = useState(false);
  const [lastSubmitted, setLastSubmitted] = useState<string[]>([]);

  useEffect(() => {
    const carried = searchParams.get('services');
    if (carried) {
      const slugs = parseServicesQuery(carried);
      if (slugs.length) {
        setSelected(slugs);
        persistSelection(slugs);
      }
      return;
    }
    try {
      const stored = JSON.parse(window.localStorage.getItem(SELECTION_KEY) ?? '[]') as unknown;
      if (Array.isArray(stored)) {
        const slugs = parseServicesQuery(stored.map((item) => String(item ?? '')).join(','));
        if (slugs.length) setSelected(slugs);
      }
    } catch {
      // Corrupt persisted selection is ignored; selection stays manual.
    }
    // Run once on mount: the form owns selection state after init.
  }, []);

  useEffect(() => {
    persistSelection(selected);
  }, [selected]);

  const removeService = (slug: string) => {
    setSelected((current) => current.filter((item) => item !== slug));
  };

  const submitInquiry = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const serviceNames = selected.map(slugToName);
    let id: string;
    try {
      id = crypto.randomUUID();
    } catch {
      id = `lead-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    }
    const lead: Lead = {
      id,
      createdAt: new Date().toISOString(),
      services: serviceNames,
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      company: String(data.get('company') ?? ''),
      budget: String(data.get('budget') ?? 'Not sure yet'),
      brief: String(data.get('brief') ?? ''),
    };
    const nextLeads = [lead, ...getStoredLeads()];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLeads));
    setLastSubmitted(serviceNames);
    setSubmitted(true);
    event.currentTarget.reset();
  };

  return (
    <div>
      <SectionHeader
        layout="stacked"
        eyebrow="Project inquiry"
        title={
          <>
            Tell us what <span className="italic text-[#C8A96B]">you&apos;re building.</span>
          </>
        }
        lead="Pick a service on any service page first, or describe the outcome below — submissions land in the demo admin inbox."
      />

      <div className="mt-10 rounded-[1.75rem] border border-[#C8A96B]/20 bg-[#111111] p-6 shadow-2xl md:p-8">
        {submitted ? (
          <div className="py-4 text-center md:py-6">
            <div className="mx-auto mb-5 grid size-14 place-items-center rounded-full border border-[#C8A96B]/30 bg-[#C8A96B]/10 text-2xl text-[#C8A96B]">
              ✓
            </div>
            <h2 className="display text-4xl">Inquiry captured.</h2>
            {lastSubmitted.length > 0 && (
              <div className="mx-auto mt-4 flex max-w-md flex-wrap justify-center gap-2">
                {lastSubmitted.map((name) => (
                  <span
                    key={name}
                    className="rounded-full border border-[#C8A96B]/20 bg-[#C8A96B]/10 px-3 py-1.5 text-xs text-[#E0C789]"
                  >
                    {name}
                  </span>
                ))}
              </div>
            )}
            <div className="mx-auto mt-6 max-w-md text-left">
              <StatusMessage tone="success" title="Saved to the demo inbox">
                This demo saved the lead locally. In production, Virtus Labs can route it to the
                admin dashboard, email, CRM, or automation workflow.
              </StatusMessage>
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setLastSubmitted([]);
                  setSubmitted(false);
                }}
              >
                Submit another inquiry
              </Button>
              <Button href="/" variant="ghost">
                Back to site
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={submitInquiry} className="grid gap-6">
            <div>
              <span className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-[.14em] text-[#A5A098]">
                <span>Selected services{selected.length ? ` · ${selected.length}` : ''}</span>
                <a
                  href="/#services"
                  className="rounded-full text-[11px] tracking-[.1em] text-[#C8A96B] hover:text-[#F0D9A1] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C8A96B]"
                >
                  Browse services →
                </a>
              </span>
              <div className="flex min-h-11 flex-wrap items-center gap-2 rounded-xl border border-white/[.07] bg-white/[.02] p-3 text-sm text-[#A5A098]">
                {selected.length ? (
                  selected.map((slug) => (
                    <span
                      key={slug}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#C8A96B]/20 bg-[#C8A96B]/10 py-1 pl-3 pr-1.5 text-xs text-[#E0C789]"
                    >
                      {slugToName(slug)}
                      <button
                        type="button"
                        onClick={() => removeService(slug)}
                        aria-label={`Remove ${slugToName(slug)} from inquiry`}
                        className="grid size-5 place-items-center rounded-full text-[#A5A098] transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[#C8A96B]"
                      >
                        <span aria-hidden="true">×</span>
                      </button>
                    </span>
                  ))
                ) : (
                  <>No services selected yet.</>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Name" name="name" required placeholder="Your name" />
              <FormField
                label="Email"
                name="email"
                type="email"
                required
                placeholder="you@company.com"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Company / Brand" name="company" placeholder="Optional" />
              <FormField
                label="Budget range"
                name="budget"
                kind="select"
                defaultValue="Not sure yet"
                options={['Not sure yet', 'Starter', 'Growth', 'Custom', 'Enterprise']}
              />
            </div>

            <FormField
              label="What do you need?"
              name="brief"
              kind="textarea"
              required
              rows={5}
              placeholder="Tell us the outcome you want, current problem, deadline, or anything useful."
            />

            <label className="flex items-start gap-3 text-xs leading-5 text-[#77736D]">
              <input required type="checkbox" name="consent" className="mt-1 accent-[#C8A96B]" /> I
              agree to be contacted about this project inquiry.
            </label>

            <Button type="submit" className="w-full">
              Submit inquiry →
            </Button>
            <p className="text-center text-[11px] leading-5 text-[#615E59]">
              Prototype behavior: submissions are stored only in this browser for the demo admin
              dashboard. Production should connect this form to an API with authenticated admin
              tooling.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
