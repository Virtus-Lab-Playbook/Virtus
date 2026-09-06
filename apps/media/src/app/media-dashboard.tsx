'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Aperture,
  ArrowUpRight,
  CalendarDays,
  Clapperboard,
  FileText,
  Film,
  FolderOpen,
  LayoutDashboard,
  Menu,
  MoreHorizontal,
  Play,
  Plus,
  Search,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';

type View = 'Overview' | 'Productions' | 'Schedule' | 'Media library';

const navigation: { label: View; icon: LucideIcon }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Productions', icon: Clapperboard },
  { label: 'Schedule', icon: CalendarDays },
  { label: 'Media library', icon: FolderOpen },
];

const productions = [
  {
    title: 'The Long Way Home',
    type: 'Feature / Cinema',
    progress: 72,
    status: 'In production',
    lead: 'MR',
    tone: 'violet',
  },
  {
    title: 'Signal / Season 01',
    type: 'Series / Documentary',
    progress: 41,
    status: 'Pre-production',
    lead: 'AL',
    tone: 'coral',
  },
  {
    title: 'After the Rain',
    type: 'Short / Brand film',
    progress: 88,
    status: 'Post-production',
    lead: 'JK',
    tone: 'sage',
  },
];

const schedule = [
  { time: '09:00', title: 'Location scout', meta: 'The Long Way Home / Unit A', color: 'violet' },
  { time: '11:30', title: 'Script review', meta: 'Signal / Writers room', color: 'coral' },
  { time: '14:00', title: 'Picture lock', meta: 'After the Rain / Edit suite', color: 'sage' },
  { time: '16:30', title: 'Crew check-in', meta: 'All productions / Remote', color: 'gold' },
];

const mediaAssets = [
  { name: 'THW_scene_042.mov', type: '4K ProRes', size: '2.4 GB', updated: '12m ago', icon: Film },
  {
    name: 'signal_ep01_script.pdf',
    type: 'Document',
    size: '4.8 MB',
    updated: '1h ago',
    icon: FileText,
  },
  {
    name: 'ATR_final_mix.wav',
    type: 'Audio master',
    size: '884 MB',
    updated: 'Yesterday',
    icon: Aperture,
  },
];

export function MediaDashboard() {
  const [activeView, setActiveView] = useState<View>('Overview');
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <main className="media-shell">
      <aside className="media-sidebar">
        <Link className="media-brand" href="/" aria-label="Virtus Media Engine home">
          <span className="brand-mark">V</span>
          <span>
            Virtus<small>Media Engine</small>
          </span>
        </Link>
        <div className="sidebar-label">Production room</div>
        <nav className="media-nav" aria-label="Media Engine navigation">
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
                {item.label === 'Schedule' && <span className="nav-count">4</span>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-divider" />
        <div className="sidebar-label">Shortcuts</div>
        <nav className="media-nav media-shortcuts" aria-label="Media Engine shortcuts">
          <button type="button">
            <span className="nav-icon" aria-hidden="true">
              <Plus size={16} />
            </span>
            <span>New production</span>
          </button>
          <button type="button">
            <span className="nav-icon" aria-hidden="true">
              <UsersRound size={15} />
            </span>
            <span>Manage crew</span>
          </button>
        </nav>
        <div className="media-sidebar-footer">
          <span className="media-footer-status">
            <span /> Production room live
          </span>
          <div className="media-profile">
            <span className="profile-avatar">AL</span>
            <span>
              <strong>Alex Lee</strong>
              <small>Production lead</small>
            </span>
            <button type="button" aria-label="Open profile menu">
              <MoreHorizontal size={17} />
            </button>
          </div>
        </div>
      </aside>

      <section className="media-main">
        <header className="media-header">
          <div className="breadcrumb">
            <span>Virtus</span>
            <span>/</span>
            <strong>{activeView}</strong>
          </div>
          <div className="header-actions">
            {searchOpen && (
              <input
                className="search-input"
                autoFocus
                placeholder="Search productions"
                aria-label="Search productions"
              />
            )}
            <button
              className="header-icon"
              type="button"
              aria-label="Toggle search"
              onClick={() => setSearchOpen(!searchOpen)}
            >
              <Search size={18} strokeWidth={1.7} />
            </button>
            <button className="header-icon" type="button" aria-label="Open production menu">
              <Menu size={17} strokeWidth={1.7} />
            </button>
            <span className="header-date">September 05, 2026</span>
          </div>
        </header>

        <div className="media-content">
          <div className="media-heading">
            <div>
              <p className="media-kicker">
                <span className="live-pulse" /> Thursday / Week 36
              </p>
              <h1>{activeView === 'Overview' ? 'Keep the story moving.' : activeView}</h1>
              <p className="media-intro">One clear view from first frame to final delivery.</p>
            </div>
            <button className="new-button" type="button">
              <Plus size={15} /> New {activeView === 'Productions' ? 'production' : 'scene'}
            </button>
          </div>
          {activeView === 'Overview' && <Overview />}
          {activeView === 'Productions' && <ProductionsView />}
          {activeView === 'Schedule' && <ScheduleView />}
          {activeView === 'Media library' && <MediaLibraryView />}
        </div>
      </section>
    </main>
  );
}

function Overview() {
  return (
    <>
      <section className="metrics-grid" aria-label="Media Engine metrics">
        <Metric label="Active productions" value="06" change="2 shooting this week" tone="violet" />
        <Metric label="Scenes in motion" value="42" change="8 ready for review" tone="coral" />
        <Metric label="Crew confirmed" value="87%" change="3 roles to fill" tone="sage" />
        <Metric label="Delivery health" value="94%" change="All critical paths clear" tone="gold" />
      </section>
      <div className="dashboard-grid">
        <section className="media-card productions-card">
          <CardHeading title="Production pulse" action="View productions" />
          {productions.map((production) => (
            <ProductionRow production={production} key={production.title} />
          ))}
        </section>
        <section className="media-card today-card">
          <CardHeading title="Today on set" action="Open schedule" />
          <div className="today-focus">
            <span className="focus-icon">
              <Play size={15} fill="currentColor" />
            </span>
            <div>
              <strong>Location scout</strong>
              <p>The Long Way Home / Unit A</p>
            </div>
            <span className="focus-time">09:00</span>
          </div>
          <div className="today-rule" />
          <div className="today-stats">
            <div>
              <strong>04</strong>
              <span>events today</span>
            </div>
            <div>
              <strong>18</strong>
              <span>crew on call</span>
            </div>
          </div>
          <button className="text-action" type="button">
            See the full day <ArrowUpRight size={14} />
          </button>
        </section>
      </div>
      <section className="media-card schedule-card">
        <CardHeading title="The next scene" action="Open calendar" />
        <ScheduleRows limit={3} />
      </section>
    </>
  );
}

function ProductionsView() {
  return (
    <section className="media-card expanded-card">
      <CardHeading title="All productions" action="Sort by status" />
      {productions.map((production) => (
        <ProductionRow production={production} expanded key={production.title} />
      ))}
    </section>
  );
}

function ScheduleView() {
  return (
    <section className="media-card expanded-card">
      <CardHeading title="Production schedule" action="Add event" />
      <ScheduleRows />
    </section>
  );
}

function MediaLibraryView() {
  return (
    <section className="media-card expanded-card">
      <CardHeading title="Media library" action="Upload asset" />
      <div className="asset-list">
        {mediaAssets.map((asset) => {
          const Icon = asset.icon;
          return (
            <div className="asset-row" key={asset.name}>
              <span className="asset-icon">
                <Icon size={16} />
              </span>
              <span>
                <strong>{asset.name}</strong>
                <small>
                  {asset.type} / {asset.size}
                </small>
              </span>
              <small>{asset.updated}</small>
              <ArrowUpRight size={15} />
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ScheduleRows({ limit }: { limit?: number }) {
  const items = limit ? schedule.slice(0, limit) : schedule;
  return (
    <div className="schedule-list">
      {items.map((item) => (
        <div className="schedule-row" key={`${item.time}-${item.title}`}>
          <span className="schedule-time">{item.time}</span>
          <span className={`schedule-marker ${item.color}`} />
          <span className="schedule-copy">
            <strong>{item.title}</strong>
            <small>{item.meta}</small>
          </span>
          <ChevronRightIcon />
        </div>
      ))}
    </div>
  );
}

function ChevronRightIcon() {
  return <ArrowUpRight className="row-arrow" size={15} />;
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

function ProductionRow({
  production,
  expanded = false,
}: {
  production: (typeof productions)[number];
  expanded?: boolean;
}) {
  return (
    <div className={`production-row ${expanded ? 'is-expanded' : ''}`}>
      <span className={`production-poster ${production.tone}`}>
        <Film size={17} />
        <small>{production.title.slice(0, 2).toUpperCase()}</small>
      </span>
      <span className="production-copy">
        <strong>{production.title}</strong>
        <small>{production.type}</small>
      </span>
      <span className="production-progress">
        <span className="progress-track">
          <span style={{ width: `${production.progress}%` }} />
        </span>
        <small>{production.progress}%</small>
      </span>
      <span
        className={`production-status ${production.status.toLowerCase().replace('-', '').replace(' ', '-')}`}
      >
        {production.status}
      </span>
      <span className="production-lead">{production.lead}</span>
    </div>
  );
}
