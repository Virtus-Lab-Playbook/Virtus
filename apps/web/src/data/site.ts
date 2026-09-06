export type Service = {
  slug: string;
  name: string;
  description: string;
  tags: string[];
};

export const services: Service[] = [
  {
    slug: 'web-development',
    name: 'Web Development',
    description: 'Fast, responsive sites and web apps built to convert.',
    tags: ['Websites', 'Landing Pages', 'Integrations'],
  },
  {
    slug: 'creative-graphics',
    name: 'Creative / Graphics',
    description: 'Brand visuals and campaign assets with a coherent identity.',
    tags: ['Brand Visuals', 'Campaigns', 'Social Assets'],
  },
  {
    slug: 'video-media',
    name: 'Video / Media',
    description: 'Commercial content and social video, produced end to end.',
    tags: ['Commercials', 'Social Video', 'Production'],
  },
  {
    slug: 'automation',
    name: 'Automation',
    description: 'Workflows and integrations that remove repetitive work.',
    tags: ['Workflows', 'Integrations', 'Tooling'],
  },
];

export function normalizeToSlug(value: string): string | undefined {
  const normalized = value.trim().toLowerCase();
  if (!normalized) return undefined;
  return services.find((item) => item.slug === normalized || item.name.toLowerCase() === normalized)
    ?.slug;
}

export function slugToName(slug: string): string {
  return services.find((item) => item.slug === slug)?.name ?? slug;
}

/**
 * Parses a comma-separated `?services=` query value into deduped service
 * slugs. Entries may be slugs or display names; unknowns and blanks are
 * dropped so callers can safely trust the result for chip state.
 */
export function parseServicesQuery(value: string | null): string[] {
  if (!value) return [];
  return [
    ...new Set(
      value
        .split(',')
        .map(normalizeToSlug)
        .filter((slug): slug is string => Boolean(slug)),
    ),
  ];
}

export type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Choose',
    description: "Select the services or products that fit the outcome you're trying to achieve.",
  },
  {
    number: '02',
    title: 'Scope',
    description: 'Deliverables, timeline, and assumptions — before we build.',
  },
  {
    number: '03',
    title: 'Build',
    description:
      'Design and development happen in visible milestones with decisions captured along the way.',
  },
  {
    number: '04',
    title: 'Deliver',
    description:
      'You receive a polished result, handoff materials, and a clean path for support or future expansion.',
  },
];

export type NavLink = {
  label: string;
  href: string;
};

export const primaryNav: NavLink[] = [
  { label: 'Services', href: '/#services' },
  { label: 'Products', href: '/#products' },
  { label: 'Process', href: '/#process' },
  { label: 'About', href: '/#about' },
];

export const footerNav: NavLink[] = [
  { label: 'Services', href: '/#services' },
  { label: 'Products', href: '/#products' },
  { label: 'Email', href: 'mailto:hello@virtuslabs.example' },
  { label: 'Admin demo', href: '/#admin' },
];

export type ServiceFaq = {
  question: string;
  answer: string;
};

export const serviceFaq: ServiceFaq[] = [
  {
    question: 'How does an engagement start?',
    answer:
      'Submit a project inquiry with the outcome you want. We scope it into deliverables, timeline, and assumptions before anything is built.',
  },
  {
    question: 'How do we communicate during the work?',
    answer:
      'Visible milestones with decisions captured along the way. You always know what is done, what is next, and what needs your input.',
  },
  {
    question: 'Do you publish pricing?',
    answer:
      'No fixed price list. Every engagement is scoped first, then quoted so you pay for the outcome you need and nothing else.',
  },
  {
    question: 'What do you need from us to begin?',
    answer:
      'A clear outcome, one point of contact, and timely feedback on milestones. We handle the rest.',
  },
];
