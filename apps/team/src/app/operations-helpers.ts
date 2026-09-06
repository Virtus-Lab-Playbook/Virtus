export type Client = {
  id: string;
  name: string;
  type: string;
  owner: string;
  valueCents: number;
  health: string;
};

export type Project = {
  id: string;
  name: string;
  client: string;
  engine: string;
  progress: number;
  due: string;
  owner: string;
};

export type FileRecord = {
  id: string;
  name: string;
  type: string;
  owner: string;
  updated: string;
};

export type Approval = {
  id: string;
  title: string;
  context: string;
  requested: string;
  owner: string;
  engine: string;
  status: string;
};

export type Invoice = {
  id: string;
  number: string;
  client: string;
  description: string;
  amountCents: number;
  status: string;
  due: string;
};

export type DomainRecord = {
  id: string;
  domain: string;
  ip: string;
  ipv6: string;
  changed: string;
};

export type OverviewPayload = {
  metrics: { clients: number; projects: number; approvals: number; outstandingCents: number };
  engines: { name: string; count: number }[];
  projects: Project[];
  approvals: Approval[];
};

export type OperationsData = {
  overview?: OverviewPayload | undefined;
  clients?: Client[] | undefined;
  projects?: Project[] | undefined;
  files?: FileRecord[] | undefined;
  approvals?: Approval[] | undefined;
  invoices?: Invoice[] | undefined;
  domains?: DomainRecord[] | undefined;
};

export function money(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function dateLabel(value: string): string {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
    new Date(value),
  );
}

export function filterOperationsData(data: OperationsData, query: string): OperationsData {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return data;
  const matches = (value: unknown) => JSON.stringify(value).toLowerCase().includes(normalized);
  return {
    ...data,
    clients: data.clients?.filter(matches),
    projects: data.projects?.filter(matches),
    files: data.files?.filter(matches),
    approvals: data.approvals?.filter(matches),
    invoices: data.invoices?.filter(matches),
    domains: data.domains?.filter(matches),
    overview: data.overview
      ? {
          ...data.overview,
          projects: data.overview.projects.filter(matches),
          approvals: data.overview.approvals.filter(matches),
          engines: data.overview.engines.filter(matches),
        }
      : undefined,
  };
}
