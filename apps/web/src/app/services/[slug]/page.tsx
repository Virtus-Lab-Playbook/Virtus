import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Button } from '../../../components/button';
import { CtaSection } from '../../../components/cta-section';
import { Entrance } from '../../../components/entrance';
import { Faq } from '../../../components/faq';
import { ProcessSteps } from '../../../components/process-steps';
import { SectionHeader } from '../../../components/section-header';
import { ServiceVisual } from '../../../components/service-visual';
import { normalizeToSlug, processSteps, serviceFaq, services } from '../../../data/site';
import { worksForService } from '../../../data/works';

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((item) => item.slug === normalizeToSlug(slug));
  if (!service) return { title: 'Service | Virtus Labs' };
  return {
    title: `${service.name} | Virtus Labs`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === normalizeToSlug(slug));
  if (!service) notFound();

  const index = services.indexOf(service);
  const related = worksForService(service.slug);
  const inquiryHref = `/start-project?services=${service.slug}`;

  return (
    <>
      <section className="relative overflow-hidden px-5 pb-16 pt-32 md:px-8 md:pt-44">
        <ServiceVisual index={index} />
        <div className="relative z-10 mx-auto max-w-7xl">
          <Entrance>
            <nav
              aria-label="Breadcrumb"
              className="text-xs uppercase tracking-[.18em] text-[#77736D]"
            >
              <a href="/" className="transition hover:text-[#F2EFE7]">
                Home
              </a>
              <span aria-hidden="true" className="mx-2 text-[#C8A96B]">
                /
              </span>
              <a href="/#services" className="transition hover:text-[#F2EFE7]">
                Services
              </a>
              <span aria-hidden="true" className="mx-2 text-[#C8A96B]">
                /
              </span>
              <span aria-current="page" className="text-[#A5A098]">
                {service.name}
              </span>
            </nav>
          </Entrance>

          <Entrance delay={0.08} className="pointer-events-none mt-10 select-none">
            <span
              aria-hidden="true"
              className="display block text-[clamp(5rem,18vw,15rem)] italic leading-none text-transparent [-webkit-text-stroke:1px_rgba(200,169,107,.28)]"
            >
              {String(index + 1).padStart(2, '0')}
            </span>
          </Entrance>

          <Entrance delay={0.16}>
            <h1 className="display -mt-6 text-5xl leading-[.92] md:-mt-12 md:text-7xl lg:text-8xl">
              {service.name}
              <span className="gold-text italic">.</span>
            </h1>
          </Entrance>

          <Entrance delay={0.24}>
            <p className="mt-6 max-w-2xl text-base leading-8 text-[#A5A098] md:text-lg">
              {service.description}
            </p>
          </Entrance>

          <Entrance delay={0.32}>
            <div className="mt-7 flex flex-wrap gap-2 text-[11px] uppercase tracking-[.12em]">
              {service.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#C8A96B]/25 bg-[#C8A96B]/10 px-3.5 py-1.5 text-[#E0C789]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </Entrance>

          <Entrance delay={0.4}>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button href={inquiryHref}>Start a project →</Button>
              <Button href="#work" variant="secondary">
                See the work
              </Button>
            </div>
          </Entrance>
        </div>
      </section>

      <div
        aria-label={`${service.name} highlights`}
        className="overflow-hidden border-y border-white/[.06] bg-[#111111] py-4"
      >
        <div className="ticker-track flex whitespace-nowrap text-sm font-semibold uppercase tracking-[.16em] text-[#A5A098]">
          {service.tags.map((tag, tagIndex) => (
            <span key={`${tag}-${tagIndex}`} className="marquee-word">
              {tag}
            </span>
          ))}
          <span aria-hidden="true" className="flex whitespace-nowrap">
            {[...service.tags, ...service.tags, ...service.tags].map((tag, tagIndex) => (
              <span key={`${tag}-dup-${tagIndex}`} className="marquee-word">
                {tag}
              </span>
            ))}
          </span>
        </div>
      </div>

      <main className="px-5 pb-8 md:px-8">
        <section id="work" className="mx-auto max-w-7xl scroll-mt-28 py-24 md:py-32">
          <SectionHeader
            eyebrow="Selected work"
            title={
              <>
                Proof, not <span className="italic text-[#C8A96B]">promises.</span>
              </>
            }
            lead={`Work delivered under ${service.name}. Every entry is a real engagement with a real outcome.`}
          />
          {related.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {related.map((work) => (
                <article
                  key={work.slug}
                  className="reveal rounded-[1.7rem] border border-white/[.07] bg-[#151515] p-6 transition hover:border-[#C8A96B]/30 md:p-7"
                >
                  <p className="mb-2 text-[10px] uppercase tracking-[.18em] text-[#77736D]">
                    {work.client} · {work.sector}
                  </p>
                  <h3 className="mb-3 text-2xl font-semibold">{work.title}</h3>
                  <p className="text-sm leading-6 text-[#C8A96B]">{work.outcome}</p>
                  <p className="mt-3 text-sm leading-6 text-[#A5A098]">{work.summary}</p>
                </article>
              ))}
            </div>
          ) : (
            <div className="reveal rounded-[1.7rem] border border-dashed border-[#C8A96B]/30 bg-[#C8A96B]/[.03] p-8 text-center md:p-12">
              <p className="display text-3xl md:text-4xl">
                Case studies <span className="italic text-[#C8A96B]">in production.</span>
              </p>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#A5A098]">
                No published case studies for {service.name} yet — we don&apos;t invent results.
                Your project could be the first one listed here.
              </p>
              <div className="mt-7">
                <Button href={inquiryHref}>Start a project →</Button>
              </div>
            </div>
          )}
        </section>

        <section className="mx-auto max-w-7xl pb-24 md:pb-32">
          <div className="mb-14">
            <SectionHeader
              layout="stacked"
              eyebrow="How we work"
              title={
                <>
                  Same system, <span className="italic text-[#C8A96B]">every time.</span>
                </>
              }
            />
          </div>
          <ProcessSteps steps={processSteps} />
        </section>

        <section className="mx-auto max-w-7xl pb-24 md:pb-32">
          <div className="mb-12">
            <SectionHeader
              layout="stacked"
              eyebrow="Questions"
              title={
                <>
                  Before you <span className="italic text-[#C8A96B]">ask.</span>
                </>
              }
            />
          </div>
          <Faq items={serviceFaq} />
        </section>

        <CtaSection
          eyebrow={service.name}
          title={
            <>
              Need this <span className="gold-text italic">done right?</span>
            </>
          }
          copy="Tell us the outcome you want and we will scope the path from inquiry to delivery."
        >
          <Button href={inquiryHref} className="w-full">
            Start a project →
          </Button>
        </CtaSection>
      </main>
    </>
  );
}
