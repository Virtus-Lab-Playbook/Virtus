'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Bell,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  Search,
  Share2,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

type View = 'Overview' | 'Clients' | 'Projects' | 'Approvals';

const navigation: { label: View; icon: LucideIcon }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Clients', icon: UsersRound },
  { label: 'Projects', icon: FolderKanban },
  { label: 'Approvals', icon: ClipboardCheck },
];

const clients = [
  {
    name: 'Northstar Studio',
    detail: 'Brand system / Retainer',
    value: '$18,400',
    status: 'On track',
    color: 'coral',
  },
  {
    name: 'Field Notes Co.',
    detail: 'Campaign / Launch',
    value: '$12,800',
    status: 'Needs review',
    color: 'sage',
  },
  {
    name: 'Morrow House',
    detail: 'Digital product / Sprint 03',
    value: '$9,600',
    status: 'On track',
    color: 'blue',
  },
  {
    name: 'Common Ground',
    detail: 'Advisory / Monthly',
    value: '$6,200',
    status: 'Waiting',
    color: 'gold',
  },
];

const projects = [
  {
    name: 'Northstar identity system',
    client: 'Northstar Studio',
    progress: 78,
    due: 'Today',
    owner: 'AL',
  },
  {
    name: 'Field Notes launch campaign',
    client: 'Field Notes Co.',
    progress: 54,
    due: 'Sep 09',
    owner: 'JM',
  },
  {
    name: 'Morrow onboarding flow',
    client: 'Morrow House',
    progress: 31,
    due: 'Sep 14',
    owner: 'RK',
  },
];

const approvals = [
  {
    title: 'Homepage direction v3',
    client: 'Northstar Studio',
    requested: '2h ago',
    initials: 'NS',
  },
  {
    title: 'Launch copy / social set',
    client: 'Field Notes Co.',
    requested: 'Yesterday',
    initials: 'FN',
  },
  { title: 'Scope change: Sprint 03', client: 'Morrow House', requested: 'Sep 03', initials: 'MH' },
];

export function ServiceDashboard() {
  const [activeView, setActiveView] = useState<View>('Overview');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <main className="service-shell">
      <aside className="service-sidebar">
        <Link className="service-brand" href="/" aria-label="Virtus Service Engine home">
          <span className="brand-mark">V</span>
          <span>
            Virtus
            <small>Service Engine</small>
          </span>
        </Link>

        <div className="sidebar-label">Workspace</div>
        <nav className="service-nav" aria-label="Service Engine navigation">
          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                className={activeView === item.label ? 'is-active' : ''}
                key={item.label}
                type="button"
                onClick={() => setActiveView(item.label)}
              >
                <span className="nav-icon" aria-hidden="true">
                  <Icon size={16} strokeWidth={1.7} />
                </span>
                <span>{item.label}</span>
                {item.label === 'Approvals' && <span className="nav-count">3</span>}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-divider" />
        <div className="sidebar-label">Shortcuts</div>
        <nav className="service-nav service-shortcuts" aria-label="Service Engine shortcuts">
          <button type="button">
            <span className="nav-icon" aria-hidden="true">
              <Plus size={16} />
            </span>
            <span>New project</span>
          </button>
          <button type="button">
            <span className="nav-icon" aria-hidden="true">
              <Share2 size={15} />
            </span>
            <span>Share report</span>
          </button>
        </nav>

        <div className="sidebar-profile">
          <span className="profile-avatar">AL</span>
          <span>
            <strong>Alex Lee</strong>
            <small>Operations lead</small>
          </span>
          <button type="button" aria-label="Open profile menu">
            <MoreHorizontal size={17} />
          </button>
        </div>
      </aside>

      <section className="service-main">
        <header className="service-header">
          <div className="breadcrumb">
            <span>Virtus</span>
            <span>/</span>
            <strong>{activeView}</strong>
          </div>
          <div className="header-actions">
            {isSearchOpen && (
              <input
                className="search-input"
                autoFocus
                placeholder="Search workspace"
                aria-label="Search workspace"
              />
            )}
            <button
              className="header-icon"
              type="button"
              aria-label="Toggle search"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search size={18} strokeWidth={1.7} />
            </button>
            <button
              className="header-icon notification-icon"
              type="button"
              aria-label="Notifications"
            >
              <span />
              <Bell size={17} strokeWidth={1.7} />
            </button>
            <span className="header-date">September 05, 2026</span>
          </div>
        </header>

        <div className="service-content">
          <div className="service-heading">
            <div>
              <p className="service-kicker">
                <span className="live-pulse" /> Monday rhythm
              </p>
              <h1>{activeView === 'Overview' ? 'Good morning, Alex.' : activeView}</h1>
              <p className="service-intro">
                Here is what deserves your attention across the service engine.
              </p>
            </div>
            <button className="new-button" type="button">
              <Plus size={15} /> New {activeView === 'Clients' ? 'client' : 'project'}
            </button>
          </div>

          {activeView === 'Overview' && <Overview />}
          {activeView === 'Clients' && <ClientsView />}
          {activeView === 'Projects' && <ProjectsView />}
          {activeView === 'Approvals' && <ApprovalsView />}
        </div>
      </section>
    </main>
  );
}

function Overview() {
  return (
    <>
      <section className="metrics-grid" aria-label="Service Engine metrics">
        <Metric label="Active clients" value="12" change="+2 this month" tone="coral" />
        <Metric label="Work in motion" value="28" change="6 due this week" tone="sage" />
        <Metric label="Awaiting approval" value="03" change="Needs your eye" tone="gold" />
        <Metric label="Retainer health" value="94%" change="+4.2% vs last month" tone="blue" />
      </section>
      <div className="dashboard-grid">
        <section className="dashboard-card client-card">
          <CardHeading title="Client pulse" action="View all clients" />
          <div className="client-table">
            <div className="table-head">
              <span>Client</span>
              <span>Value</span>
              <span>Status</span>
            </div>
            {clients.map((client) => (
              <ClientRow client={client} key={client.name} />
            ))}
          </div>
        </section>
        <section className="dashboard-card attention-card">
          <CardHeading title="Needs attention" action="Open queue" />
          <div className="attention-feature">
            <span className="attention-number">03</span>
            <div>
              <strong>approvals need a decision</strong>
              <p>Protect the momentum by clearing the path for the team.</p>
            </div>
          </div>
          <div className="attention-line">
            <span className="attention-dot coral-dot" />
            <span>Homepage direction v3</span>
            <small>Northstar / 2h</small>
          </div>
          <div className="attention-line">
            <span className="attention-dot sage-dot" />
            <span>Launch copy / social set</span>
            <small>Field Notes / 1d</small>
          </div>
          <button className="text-action" type="button">
            Review all approvals <ArrowUpRight size={14} />
          </button>
        </section>
      </div>
      <section className="dashboard-card projects-card">
        <CardHeading title="Work in motion" action="Open project view" />
        <div className="project-table">
          <div className="table-head">
            <span>Project</span>
            <span>Progress</span>
            <span>Due</span>
            <span>Owner</span>
          </div>
          {projects.map((project) => (
            <ProjectRow project={project} key={project.name} />
          ))}
        </div>
      </section>
    </>
  );
}

function ClientsView() {
  return (
    <section className="dashboard-card expanded-card">
      <CardHeading title="Client portfolio" action="Export view" />
      <div className="client-table expanded-table">
        <div className="table-head">
          <span>Client</span>
          <span>Engagement</span>
          <span>Value</span>
          <span>Status</span>
        </div>
        {clients.map((client) => (
          <ClientRow client={client} expanded key={client.name} />
        ))}
      </div>
    </section>
  );
}

function ProjectsView() {
  return (
    <section className="dashboard-card expanded-card">
      <CardHeading title="Projects in motion" action="Sort by due date" />
      <div className="project-table expanded-table">
        <div className="table-head">
          <span>Project</span>
          <span>Progress</span>
          <span>Due</span>
          <span>Owner</span>
        </div>
        {projects.map((project) => (
          <ProjectRow project={project} key={project.name} />
        ))}
      </div>
    </section>
  );
}

function ApprovalsView() {
  return (
    <section className="dashboard-card expanded-card">
      <CardHeading title="Approval queue" action="Filter queue" />
      <div className="approval-list">
        {approvals.map((approval) => (
          <div className="approval-row" key={approval.title}>
            <span className="approval-avatar">{approval.initials}</span>
            <div>
              <strong>{approval.title}</strong>
              <span>{approval.client}</span>
            </div>
            <small>{approval.requested}</small>
            <button className="review-button" type="button">
              Review <span>↗</span>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
  change,
  tone,
}: {
  label: string;
  value: string;
  change: string;
  tone: string;
}) {
  return (
    <article className={`metric-card ${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{change}</small>
    </article>
  );
}

function CardHeading({ title, action }: { title: string; action: string }) {
  return (
    <div className="card-heading">
      <h2>{title}</h2>
      <button type="button">
        {action} <ArrowUpRight size={14} />
      </button>
    </div>
  );
}

function ClientRow({
  client,
  expanded = false,
}: {
  client: (typeof clients)[number];
  expanded?: boolean;
}) {
  return (
    <div className="client-row">
      <span className={`client-avatar ${client.color}`}>{client.name.slice(0, 1)}</span>
      <span className="client-name">
        <strong>{client.name}</strong>
        <small>{client.detail}</small>
      </span>
      {expanded && <span className="client-detail">{client.detail.split(' / ')[0]}</span>}
      <strong className="client-value">{client.value}</strong>
      <span className={`client-status ${client.status.toLowerCase().replace(' ', '-')}`}>
        {client.status}
      </span>
    </div>
  );
}

function ProjectRow({ project }: { project: (typeof projects)[number] }) {
  return (
    <div className="project-row">
      <span className="project-name">
        <strong>{project.name}</strong>
        <small>{project.client}</small>
      </span>
      <span className="progress-wrap">
        <span className="progress-bar">
          <span style={{ width: `${project.progress}%` }} />
        </span>
        <small>{project.progress}%</small>
      </span>
      <span className="project-due">{project.due}</span>
      <span className="project-owner">{project.owner}</span>
    </div>
  );
}
