'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  BadgeDollarSign,
  BriefcaseBusiness,
  ClipboardCheck,
  FileText,
  FolderKanban,
  Globe2,
  LayoutDashboard,
  MoreHorizontal,
  Search,
  Settings2,
  ShieldCheck,
  CircleDashed,
  UserCircle,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import { ApiError, apiRequest } from './api';
import {
  filterOperationsData,
  money,
  dateLabel,
  type Approval,
  type Client,
  type DomainRecord,
  type FileRecord,
  type Invoice,
  type OperationsData,
  type OverviewPayload,
  type Project,
} from './operations-helpers';

export type OperationsView =
  'Overview' | 'Clients' | 'Projects' | 'Files' | 'Approvals' | 'Finance' | 'Domains';

type CurrentUser = { name: string; email: string; role: 'ADMIN' | 'MEMBER' };

const navigation: { label: OperationsView; href: string; icon: LucideIcon }[] = [
  { label: 'Overview', href: '/', icon: LayoutDashboard },
  { label: 'Clients', href: '/clients', icon: UsersRound },
  { label: 'Projects', href: '/projects', icon: FolderKanban },
  { label: 'Files', href: '/files', icon: FileText },
  { label: 'Approvals', href: '/approvals', icon: ClipboardCheck },
  { label: 'Finance', href: '/finance', icon: BadgeDollarSign },
  { label: 'Domains', href: '/domains', icon: Globe2 },
];

const domainRecords: DomainRecord[] = [
  {
    id: 'asset-view',
    domain: 'asset-view',
    ip: '134.185.84.235',
    ipv6: '',
    changed: '29 seconds ago',
  },
  {
    id: 'client-view',
    domain: 'client-view',
    ip: '134.185.84.235',
    ipv6: '',
    changed: '24 seconds ago',
  },
  {
    id: 'media-view',
    domain: 'media-view',
    ip: '134.185.84.235',
    ipv6: '',
    changed: '19 seconds ago',
  },
  {
    id: 'operation-view',
    domain: 'operation-view',
    ip: '134.185.84.235',
    ipv6: '',
    changed: '12 seconds ago',
  },
  {
    id: 'service-view',
    domain: 'service-view',
    ip: '134.185.84.235',
    ipv6: '',
    changed: '0 seconds ago',
  },
];

const engineDefinitions = [
  {
    name: 'Service',
    label: 'Service Engine',
    href: process.env.NEXT_PUBLIC_SERVICE_URL ?? 'http://localhost:3005',
    tone: 'coral',
    icon: BriefcaseBusiness,
  },
  {
    name: 'Asset',
    label: 'Asset Engine',
    href: process.env.NEXT_PUBLIC_ASSET_URL ?? 'http://localhost:3006',
    tone: 'sage',
    icon: ShieldCheck,
  },
  {
    name: 'Media',
    label: 'Media Engine',
    href: process.env.NEXT_PUBLIC_MEDIA_URL ?? 'http://localhost:3007',
    tone: 'violet',
    icon: CircleDashed,
  },
];

const viewCopy: Record<OperationsView, { kicker: string; title: string; description: string }> = {
  Overview: {
    kicker: 'Operations / Today',
    title: 'Keep the whole system in view.',
    description: 'The shared operating picture across people, clients, projects, and engines.',
  },
  Clients: {
    kicker: 'Operations / CRM',
    title: 'Know who the work is for.',
    description: 'Client context that keeps every engine pointed at the same outcome.',
  },
  Projects: {
    kicker: 'Operations / Delivery',
    title: 'Make progress visible.',
    description: 'Projects, tasks, owners, and due dates across every Virtus engine.',
  },
  Files: {
    kicker: 'Operations / Library',
    title: 'Keep the thread attached.',
    description: 'The shared documents and decisions that give the work its memory.',
  },
  Approvals: {
    kicker: 'Operations / Governance',
    title: 'Clear the path forward.',
    description: 'One queue for the decisions that keep service, asset, and media work moving.',
  },
  Finance: {
    kicker: 'Operations / Finance',
    title: 'Make the numbers legible.',
    description: 'A calm view of invoices, payments, and the health of the work.',
  },
  Domains: {
    kicker: 'Operations / Infrastructure',
    title: 'Keep every route reachable.',
    description: 'Live host records for the engines and views that make up Virtus OS.',
  },
};

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
});
const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  second: '2-digit',
});

async function loadOperations(view: OperationsView): Promise<OperationsData> {
  switch (view) {
    case 'Overview':
      return { overview: await apiRequest<OverviewPayload>('/operations/overview') };
    case 'Clients':
      return { clients: await apiRequest<Client[]>('/operations/clients') };
    case 'Projects':
      return { projects: await apiRequest<Project[]>('/operations/projects') };
    case 'Files':
      return { files: await apiRequest<FileRecord[]>('/operations/files') };
    case 'Approvals':
      return { approvals: await apiRequest<Approval[]>('/operations/approvals') };
    case 'Finance':
      return { invoices: await apiRequest<Invoice[]>('/operations/finance/invoices') };
    case 'Domains':
      return { domains: domainRecords };
  }
}

export function OperationsDashboard({ view }: { view: OperationsView }) {
  const router = useRouter();
  const [data, setData] = useState<OperationsData | null>(null);
  const [error, setError] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(() => new Date());
  const mountedRef = useRef(true);
  const copy = viewCopy[view];

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [loadedData, user] = await Promise.all([
        loadOperations(view),
        apiRequest<CurrentUser>('/auth/me'),
      ]);
      if (!mountedRef.current) return;
      setData(loadedData);
      setCurrentUser(user);
    } catch (requestError) {
      if (!mountedRef.current) return;
      if (requestError instanceof ApiError && requestError.unauthorized) {
        router.replace('/login');
        return;
      }
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to load Operations data.',
      );
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [router, view]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!data) return;
    const timer = setTimeout(() => void refresh(), 60000);
    return () => clearTimeout(timer);
  }, [refresh, data]);

  const visibleData = data ? filterOperationsData(data, query) : null;
  const clockLabel = `${dateFormatter.format(now)} • ${timeFormatter.format(now)}`;
  const initials =
    currentUser?.name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'OP';

  return (
    <main className="operations-shell">
      <aside className="operations-sidebar">
        <Link className="operations-brand" href="/" aria-label="Virtus Operations home">
          <span className="operations-mark">V</span>
          <span>
            Virtus<small>Operations Engine</small>
          </span>
        </Link>
        <div className="operations-label">Shared workspace</div>
        <nav className="operations-nav" aria-label="Operations navigation">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                className={view === item.label ? 'is-active' : ''}
                href={item.href}
                key={item.label}
              >
                <span className="operations-nav-icon">
                  <Icon size={16} strokeWidth={1.7} />
                </span>
                <span>{item.label}</span>
                {item.label === 'Approvals' && (data?.overview || data?.approvals) && (
                  <span className="operations-count">
                    {String(
                      data.overview?.metrics.approvals ??
                        data.approvals?.filter((item) => item.status === 'PENDING').length ??
                        0,
                    ).padStart(2, '0')}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="operations-divider" />
        <div className="operations-label">People</div>
        <nav className="operations-nav operations-secondary" aria-label="People navigation">
          <Link href="/admin">
            <Settings2 size={15} />
            <span>Team placement</span>
          </Link>
          <Link href="/login">
            <UsersRound size={15} />
            <span>Invite a teammate</span>
          </Link>
          <Link href="/account">
            <UserCircle size={15} />
            <span>Account</span>
          </Link>
        </nav>
        <div className="operations-sidebar-footer">
          <span className="operations-status">
            <span /> API connected
          </span>
          <div className="operations-profile">
            <span>{initials}</span>
            <strong>{currentUser?.name ?? 'Operations lead'}</strong>
            <small>{currentUser?.role === 'ADMIN' ? 'Administrator' : 'Team member'}</small>
            <button type="button" aria-label="Open profile menu">
              <MoreHorizontal size={16} />
            </button>
          </div>
        </div>
      </aside>
      <section className="operations-main">
        <header className="operations-header">
          <div className="operations-breadcrumb">
            <span>Virtus OS</span>
            <span>/</span>
            <strong>{view}</strong>
          </div>
          <div className="operations-actions">
            {searchOpen && (
              <input
                autoFocus
                placeholder="Search this page"
                aria-label="Search this page"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Escape') setSearchOpen(false);
                }}
              />
            )}
            <button
              type="button"
              aria-label="Toggle search"
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={18} />
            </button>
            <span className="operations-sync" role="status" aria-label={`Local time ${clockLabel}`}>
              <i className={error ? 'is-offline' : ''} />
              {clockLabel}
            </span>
          </div>
        </header>
        <div className="operations-content">
          <div className="operations-heading">
            <div>
              <p className="operations-kicker">
                <span />
                {copy.kicker}
              </p>
              <h1>{copy.title}</h1>
              <p>{copy.description}</p>
            </div>
            <div className="operations-heading-actions">
              <Link className="operations-primary" href="/login">
                Invite teammate
              </Link>
            </div>
          </div>
          {error && (
            <div className="operations-error">
              <strong>Could not load workspace data.</strong>
              <span>{error}</span>
              <button type="button" onClick={() => void refresh()}>
                Try again
              </button>
            </div>
          )}
          {loading && !data && (
            <div role="status" aria-label="Loading workspace">
              <ContentSkeleton view={view} />
            </div>
          )}
          {visibleData?.overview && view === 'Overview' && <Overview data={visibleData.overview} />}
          {visibleData?.clients && view === 'Clients' && (
            <ClientsView clients={visibleData.clients} />
          )}
          {visibleData?.projects && view === 'Projects' && (
            <ProjectsView projects={visibleData.projects} />
          )}
          {visibleData?.files && view === 'Files' && <FilesView files={visibleData.files} />}
          {visibleData?.approvals && view === 'Approvals' && (
            <ApprovalsView
              approvals={visibleData.approvals}
              isAdmin={currentUser?.role === 'ADMIN'}
              onUpdated={refresh}
            />
          )}
          {visibleData?.invoices && view === 'Finance' && (
            <FinanceView invoices={visibleData.invoices} />
          )}
          {visibleData?.domains && view === 'Domains' && (
            <DomainsView domains={visibleData.domains} />
          )}
        </div>
      </section>
    </main>
  );
}

function ContentSkeleton({ view }: { view: OperationsView }) {
  if (view === 'Overview') {
    return (
      <>
        <MetricsSkeleton />
        <div className="operations-grid">
          <section className="operations-card" aria-hidden="true">
            <div className="operations-card-heading">
              <span className="skeleton-line medium" />
              <span className="skeleton-line short" />
            </div>
            <div className="engine-links">
              <span className="skeleton-bar" />
              <span className="skeleton-bar" />
              <span className="skeleton-bar" />
            </div>
          </section>
          <section className="operations-card" aria-hidden="true">
            <div className="operations-card-heading">
              <span className="skeleton-line medium" />
              <span className="skeleton-line short" />
            </div>
            <span className="skeleton-line large" />
            <span className="skeleton-line wide" />
            <span className="skeleton-line" />
          </section>
        </div>
        <TableSkeleton rows={4} />
      </>
    );
  }
  if (view === 'Finance') {
    return (
      <>
        <MetricsSkeleton />
        <TableSkeleton rows={6} />
      </>
    );
  }
  return <TableSkeleton rows={6} />;
}

function MetricsSkeleton() {
  return (
    <section className="operations-metrics" aria-hidden="true">
      {['coral', 'sage', 'violet', 'gold'].map((tone) => (
        <article className={`operations-metric ${tone}`} key={tone}>
          <span className="skeleton-line short" />
          <span className="skeleton-line large" />
          <span className="skeleton-line short" />
        </article>
      ))}
    </section>
  );
}

function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <section className="operations-card full-card" aria-hidden="true">
      <div className="operations-card-heading">
        <span className="skeleton-line medium" />
        <span className="skeleton-line short" />
      </div>
      {Array.from({ length: rows }, (_, index) => (
        <div className="skeleton-row" key={index}>
          <span className="skeleton-avatar" />
          <span className="skeleton-line wide" />
          <span className="skeleton-line" />
          <span className="skeleton-line short" />
        </div>
      ))}
    </section>
  );
}

function Overview({ data }: { data: OverviewPayload }) {
  const pending = data.approvals.filter((item) => item.status === 'PENDING');
  return (
    <>
      <section className="operations-metrics">
        <Metric
          label="Active clients"
          value={String(data.metrics.clients)}
          detail="From PostgreSQL"
          tone="coral"
        />
        <Metric
          label="Projects in motion"
          value={String(data.metrics.projects)}
          detail="Across all engines"
          tone="sage"
        />
        <Metric
          label="Awaiting approval"
          value={String(data.metrics.approvals).padStart(2, '0')}
          detail="Live queue"
          tone="violet"
        />
        <Metric
          label="Open invoices"
          value={money(data.metrics.outstandingCents)}
          detail="Outstanding balance"
          tone="gold"
        />
      </section>
      <div className="operations-grid">
        <section className="operations-card engine-card">
          <CardHeading title="Engine pulse" href="/projects" action="Open projects" />
          <div className="engine-links">
            {engineDefinitions.map((engine) => {
              const Icon = engine.icon;
              const count = data.engines.find((item) => item.name === engine.name)?.count ?? 0;
              return (
                <a className={`engine-link ${engine.tone}`} href={engine.href} key={engine.name}>
                  <span className="engine-icon">
                    <Icon size={17} />
                  </span>
                  <span>
                    <strong>{engine.label}</strong>
                    <small>{count} active projects</small>
                  </span>
                  <ArrowUpRight size={15} />
                </a>
              );
            })}
          </div>
        </section>
        <section className="operations-card attention-card">
          <CardHeading title="Needs attention" href="/approvals" action="Open queue" />
          <div className="attention-total">
            <strong>{String(pending.length).padStart(2, '0')}</strong>
            <span>decisions are waiting across the system.</span>
          </div>
          {pending.slice(0, 2).map((approval) => (
            <div className="attention-row" key={approval.id}>
              <span className={`attention-dot ${approval.engine.toLowerCase()}`} />
              <span>
                <strong>{approval.title}</strong>
                <small>{approval.context}</small>
              </span>
              <small>{dateLabel(approval.requested)}</small>
            </div>
          ))}
          <Link className="operations-text-link" href="/approvals">
            Review approvals <ArrowUpRight size={14} />
          </Link>
        </section>
      </div>
      <section className="operations-card project-card">
        <CardHeading title="Cross-engine projects" href="/projects" action="View projects" />
        <ProjectTable projects={data.projects.slice(0, 4)} />
      </section>
    </>
  );
}

function ClientsView({ clients }: { clients: Client[] }) {
  return (
    <section className="operations-card full-card">
      <CardHeading title="Client portfolio" href="/clients" action="Refresh list" />
      <div className="client-table">
        <div className="operations-table-head">
          <span>Client</span>
          <span>Relationship</span>
          <span>Owner</span>
          <span>Value</span>
          <span>Health</span>
        </div>
        {clients.map((client) => (
          <div className="client-row" key={client.id}>
            <span className="client-avatar">{client.name.slice(0, 1)}</span>
            <span>
              <strong>{client.name}</strong>
              <small>{client.type}</small>
            </span>
            <span className="muted-cell">{client.owner}</span>
            <strong>{money(client.valueCents)}</strong>
            <span className={`health ${client.health.toLowerCase().replace(' ', '-')}`}>
              {client.health}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsView({ projects }: { projects: Project[] }) {
  return (
    <section className="operations-card full-card">
      <CardHeading title="Projects and tasks" href="/projects" action="Refresh list" />
      <ProjectTable projects={projects} />
    </section>
  );
}

function FilesView({ files }: { files: FileRecord[] }) {
  return (
    <section className="operations-card full-card">
      <CardHeading title="Shared files" href="/files" action="Refresh list" />
      <div className="file-table">
        {files.map((file) => (
          <div className="file-row" key={file.id}>
            <span className="file-icon coral">
              <FileText size={16} />
            </span>
            <span>
              <strong>{file.name}</strong>
              <small>{file.type}</small>
            </span>
            <span className="muted-cell">{file.owner}</span>
            <span className="muted-cell">{dateLabel(file.updated)}</span>
            <ArrowUpRight size={15} />
          </div>
        ))}
      </div>
    </section>
  );
}

function ApprovalsView({
  approvals,
  isAdmin,
  onUpdated,
}: {
  approvals: Approval[];
  isAdmin: boolean;
  onUpdated: () => Promise<void>;
}) {
  const [updating, setUpdating] = useState('');
  const [updateError, setUpdateError] = useState('');
  const update = async (id: string, status: string) => {
    if (!isAdmin) return;
    setUpdating(id);
    setUpdateError('');
    try {
      await apiRequest(`/operations/approvals/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      await onUpdated();
    } catch (requestError) {
      setUpdateError(
        requestError instanceof Error ? requestError.message : 'Unable to update approval.',
      );
    } finally {
      setUpdating('');
    }
  };
  return (
    <section className="operations-card full-card">
      <CardHeading title="Cross-engine approval queue" href="/approvals" action="Refresh queue" />
      {!isAdmin && (
        <p className="operations-notice">
          You have read-only access to approvals. Only administrators can approve or decline.
        </p>
      )}
      {updateError && (
        <div className="operations-error" role="alert">
          <strong>Could not update approval.</strong>
          <span>{updateError}</span>
        </div>
      )}
      <div className="approval-table">
        {approvals.map((approval) => (
          <div className="approval-row" key={approval.id}>
            <span className={`approval-avatar ${approval.engine.toLowerCase()}`}>
              {approval.owner}
            </span>
            <span>
              <strong>{approval.title}</strong>
              <small>{approval.context}</small>
            </span>
            <span className="muted-cell">{dateLabel(approval.requested)}</span>
            {approval.status === 'PENDING' ? (
              <span className="approval-actions">
                <button
                  className="review-button"
                  type="button"
                  disabled={updating === approval.id || !isAdmin}
                  title={isAdmin ? 'Approve this request' : 'Admin access required'}
                  onClick={() => void update(approval.id, 'APPROVED')}
                >
                  {updating === approval.id ? 'Saving' : 'Approve'} <ArrowUpRight size={13} />
                </button>
                <button
                  className="decline-button"
                  type="button"
                  disabled={updating === approval.id || !isAdmin}
                  title={isAdmin ? 'Decline this request' : 'Admin access required'}
                  onClick={() => void update(approval.id, 'DECLINED')}
                >
                  Decline
                </button>
              </span>
            ) : (
              <span className="health">{approval.status}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function FinanceView({ invoices }: { invoices: Invoice[] }) {
  const outstanding = invoices
    .filter((item) => item.status !== 'PAID')
    .reduce((sum, item) => sum + item.amountCents, 0);
  return (
    <>
      <section className="operations-metrics">
        <Metric
          label="Open balance"
          value={money(outstanding)}
          detail="Live invoice balance"
          tone="gold"
        />
        <Metric
          label="Invoices"
          value={String(invoices.length)}
          detail="In PostgreSQL"
          tone="sage"
        />
        <Metric
          label="Paid"
          value={String(invoices.filter((item) => item.status === 'PAID').length)}
          detail="Settled records"
          tone="coral"
        />
        <Metric
          label="Open"
          value={String(invoices.filter((item) => item.status !== 'PAID').length)}
          detail="Needs collection"
          tone="violet"
        />
      </section>
      <section className="operations-card full-card">
        <CardHeading title="Invoice register" href="/finance" action="Refresh register" />
        <div className="finance-table">
          <div className="operations-table-head">
            <span>Invoice</span>
            <span>Client</span>
            <span>Description</span>
            <span>Amount</span>
            <span>Status</span>
          </div>
          {invoices.map((invoice) => (
            <div className="finance-row" key={invoice.id}>
              <strong>{invoice.number}</strong>
              <span>{invoice.client}</span>
              <span className="muted-cell">{invoice.description}</span>
              <strong>{money(invoice.amountCents)}</strong>
              <span className={`invoice-status ${invoice.status === 'PAID' ? 'paid' : ''}`}>
                {invoice.status === 'PAID' ? 'Paid' : `Due ${dateLabel(invoice.due)}`}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function DomainsView({ domains: initialDomains }: { domains: DomainRecord[] }) {
  const [domains, setDomains] = useState(initialDomains);
  const [editing, setEditing] = useState<{ id: string; field: 'ip' | 'ipv6' } | null>(null);
  const [draft, setDraft] = useState('');

  const beginEdit = (domain: DomainRecord, field: 'ip' | 'ipv6') => {
    setEditing({ id: domain.id, field });
    setDraft(domain[field]);
  };

  const saveEdit = () => {
    if (!editing || !draft.trim()) return;
    setDomains((current) =>
      current.map((domain) =>
        domain.id === editing.id
          ? { ...domain, [editing.field]: draft.trim(), changed: 'just now' }
          : domain,
      ),
    );
    setEditing(null);
    setDraft('');
  };

  const deleteDomain = (id: string) => {
    setDomains((current) => current.filter((domain) => domain.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  return (
    <section className="operations-card full-card domains-card">
      <div className="operations-card-heading">
        <div>
          <h2>Live domains</h2>
          <p className="domains-intro">Point each Virtus view to its current server address.</p>
        </div>
        <span className="domains-count">{domains.length} active</span>
      </div>
      <div className="domains-table">
        <div className="domains-table-head">
          <span>Live domain</span>
          <span>Current IP</span>
          <span>IPv6</span>
          <span>Changed</span>
          <span aria-hidden="true" />
        </div>
        {domains.length === 0 ? (
          <div className="domains-empty">No live domains are configured.</div>
        ) : (
          domains.map((domain) => {
            const isEditingIp = editing?.id === domain.id && editing.field === 'ip';
            const isEditingIpv6 = editing?.id === domain.id && editing.field === 'ipv6';
            return (
              <div className="domain-row" key={domain.id}>
                <strong>{domain.domain}</strong>
                <DomainValue
                  value={domain.ip}
                  placeholder="IPv4 address"
                  actionLabel="update IP"
                  editing={isEditingIp}
                  draft={draft}
                  onDraftChange={setDraft}
                  onEdit={() => beginEdit(domain, 'ip')}
                  onSave={saveEdit}
                  onCancel={() => setEditing(null)}
                />
                <DomainValue
                  value={domain.ipv6}
                  placeholder="IPv6 address"
                  actionLabel="update IPv6"
                  editing={isEditingIpv6}
                  draft={draft}
                  onDraftChange={setDraft}
                  onEdit={() => beginEdit(domain, 'ipv6')}
                  onSave={saveEdit}
                  onCancel={() => setEditing(null)}
                />
                <span className="domain-changed">{domain.changed}</span>
                <button
                  className="domain-delete"
                  type="button"
                  onClick={() => deleteDomain(domain.id)}
                >
                  delete domain
                </button>
              </div>
            );
          })
        )}
      </div>
      <p className="domains-note">Changes are currently held in this browser session.</p>
    </section>
  );
}

function DomainValue({
  value,
  placeholder,
  actionLabel,
  editing,
  draft,
  onDraftChange,
  onEdit,
  onSave,
  onCancel,
}: {
  value: string;
  placeholder: string;
  actionLabel: string;
  editing: boolean;
  draft: string;
  onDraftChange: (value: string) => void;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  if (editing) {
    return (
      <span className="domain-value domain-editing">
        <input
          aria-label={placeholder}
          autoFocus
          value={draft}
          placeholder={placeholder}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') onSave();
            if (event.key === 'Escape') onCancel();
          }}
        />
        <button type="button" onClick={onSave}>
          save
        </button>
        <button type="button" onClick={onCancel}>
          cancel
        </button>
      </span>
    );
  }

  return (
    <span className="domain-value">
      <span className={value ? '' : 'domain-unassigned'}>{value || placeholder}</span>
      <button type="button" onClick={onEdit}>
        {actionLabel}
      </button>
    </span>
  );
}

function ProjectTable({ projects }: { projects: Project[] }) {
  return (
    <div className="project-table">
      <div className="operations-table-head">
        <span>Project</span>
        <span>Engine</span>
        <span>Progress</span>
        <span>Due</span>
        <span>Owner</span>
      </div>
      {projects.map((project) => (
        <div className="project-row" key={project.id}>
          <span>
            <strong>{project.name}</strong>
            <small>{project.client}</small>
          </span>
          <span className={`engine-label ${project.engine.toLowerCase()}`}>{project.engine}</span>
          <span className="project-progress">
            <i>
              <b style={{ width: `${project.progress}%` }} />
            </i>
            <small>{project.progress}%</small>
          </span>
          <span className="muted-cell">{dateLabel(project.due)}</span>
          <span className="owner-cell">{project.owner}</span>
        </div>
      ))}
    </div>
  );
}

function Metric({
  label,
  value,
  detail,
  tone,
}: {
  label: string;
  value: string;
  detail: string;
  tone: string;
}) {
  return (
    <article className={`operations-metric ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function CardHeading({ title, href, action }: { title: string; href: string; action: string }) {
  return (
    <div className="operations-card-heading">
      <h2>{title}</h2>
      <Link href={href}>
        {action} <ArrowUpRight size={14} />
      </Link>
    </div>
  );
}
