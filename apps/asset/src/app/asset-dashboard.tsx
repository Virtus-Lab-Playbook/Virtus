'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  ArrowUpRight,
  Boxes,
  ChevronRight,
  ClipboardList,
  Download,
  FolderOpen,
  KeyRound,
  LayoutDashboard,
  MoreHorizontal,
  PackagePlus,
  Search,
  ShoppingBag,
  type LucideIcon,
} from 'lucide-react';

type View = 'Overview' | 'Catalog' | 'Licenses' | 'Orders';

const navigation: { label: View; icon: LucideIcon }[] = [
  { label: 'Overview', icon: LayoutDashboard },
  { label: 'Catalog', icon: Boxes },
  { label: 'Licenses', icon: KeyRound },
  { label: 'Orders', icon: ShoppingBag },
];

const assets = [
  {
    name: 'Atlas UI Kit',
    type: 'Digital product',
    version: 'v2.4',
    status: 'Published',
    downloads: '1,248',
    color: 'coral',
  },
  {
    name: 'Field Notes Templates',
    type: 'Template collection',
    version: 'v1.8',
    status: 'Published',
    downloads: '846',
    color: 'sage',
  },
  {
    name: 'Motion Pack 02',
    type: 'Motion library',
    version: 'v0.9',
    status: 'In review',
    downloads: '392',
    color: 'blue',
  },
  {
    name: 'Common Ground Icons',
    type: 'Asset library',
    version: 'v3.1',
    status: 'Published',
    downloads: '271',
    color: 'gold',
  },
];

const licenses = [
  {
    customer: 'Morrow House',
    product: 'Atlas UI Kit',
    type: 'Studio',
    expires: 'Oct 12, 2026',
    status: 'Active',
    initials: 'MH',
  },
  {
    customer: 'Northstar Studio',
    product: 'Field Notes Templates',
    type: 'Team',
    expires: 'Nov 04, 2026',
    status: 'Active',
    initials: 'NS',
  },
  {
    customer: 'Common Ground',
    product: 'Common Ground Icons',
    type: 'Solo',
    expires: 'Sep 18, 2026',
    status: 'Renew soon',
    initials: 'CG',
  },
];

const orders = [
  {
    number: '#V-1048',
    customer: 'Morrow House',
    product: 'Atlas UI Kit / Studio',
    amount: '$420',
    date: 'Sep 05',
    status: 'Complete',
  },
  {
    number: '#V-1047',
    customer: 'Northstar Studio',
    product: 'Field Notes / Team',
    amount: '$180',
    date: 'Sep 04',
    status: 'Complete',
  },
  {
    number: '#V-1046',
    customer: 'Cedar & Co.',
    product: 'Motion Pack 02 / Solo',
    amount: '$64',
    date: 'Sep 03',
    status: 'Pending',
  },
];

export function AssetDashboard() {
  const [activeView, setActiveView] = useState<View>('Overview');
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <main className="asset-shell">
      <aside className="asset-sidebar">
        <Link className="asset-brand" href="/" aria-label="Virtus Asset Engine home">
          <span className="brand-mark">V</span>
          <span>
            Virtus<small>Asset Engine</small>
          </span>
        </Link>
        <div className="sidebar-label">Workspace</div>
        <nav className="asset-nav" aria-label="Asset Engine navigation">
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
                {item.label === 'Orders' && <span className="nav-count">3</span>}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-divider" />
        <div className="sidebar-label">Shortcuts</div>
        <nav className="asset-nav asset-shortcuts" aria-label="Asset Engine shortcuts">
          <button type="button">
            <span className="nav-icon" aria-hidden="true">
              <PackagePlus size={16} />
            </span>
            <span>New product</span>
          </button>
          <button type="button">
            <span className="nav-icon" aria-hidden="true">
              <Download size={15} />
            </span>
            <span>Export catalog</span>
          </button>
        </nav>
        <div className="asset-sidebar-footer">
          <span className="asset-footer-status">
            <span /> Catalog synced
          </span>
          <div className="asset-profile">
            <span className="profile-avatar">AL</span>
            <span>
              <strong>Alex Lee</strong>
              <small>Asset lead</small>
            </span>
            <button type="button" aria-label="Open profile menu">
              <MoreHorizontal size={17} />
            </button>
          </div>
        </div>
      </aside>

      <section className="asset-main">
        <header className="asset-header">
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
                placeholder="Search assets"
                aria-label="Search assets"
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
            <button className="header-icon" type="button" aria-label="Open notifications">
              <span />
              <ClipboardList size={17} strokeWidth={1.7} />
            </button>
            <span className="header-date">September 05, 2026</span>
          </div>
        </header>

        <div className="asset-content">
          <div className="asset-heading">
            <div>
              <p className="asset-kicker">
                <span className="live-pulse" /> Product signal
              </p>
              <h1>{activeView === 'Overview' ? 'Make the catalog compound.' : activeView}</h1>
              <p className="asset-intro">
                Keep every version, license, and customer moment in view.
              </p>
            </div>
            <button className="new-button" type="button">
              <PackagePlus size={15} /> New {activeView === 'Catalog' ? 'product' : 'asset'}
            </button>
          </div>
          {activeView === 'Overview' && <Overview />}
          {activeView === 'Catalog' && <CatalogView />}
          {activeView === 'Licenses' && <LicensesView />}
          {activeView === 'Orders' && <OrdersView />}
        </div>
      </section>
    </main>
  );
}

function Overview() {
  return (
    <>
      <section className="metrics-grid" aria-label="Asset Engine metrics">
        <Metric label="Published assets" value="24" change="4 in development" tone="coral" />
        <Metric label="Active licenses" value="186" change="+18 this month" tone="sage" />
        <Metric label="Downloads this month" value="2.7k" change="+12.4% vs August" tone="blue" />
        <Metric label="Gross revenue" value="$8.4k" change="+8.1% vs August" tone="gold" />
      </section>
      <div className="dashboard-grid">
        <section className="asset-card catalog-card">
          <CardHeading title="Catalog pulse" action="View catalog" />
          <div className="asset-table">
            <div className="table-head">
              <span>Product</span>
              <span>Version</span>
              <span>Downloads</span>
              <span>Status</span>
            </div>
            {assets.map((asset) => (
              <AssetRow asset={asset} key={asset.name} />
            ))}
          </div>
        </section>
        <section className="asset-card license-card">
          <CardHeading title="License health" action="View licenses" />
          <div className="license-score">
            <strong>92%</strong>
            <span>healthy</span>
            <div className="score-track">
              <span />
            </div>
          </div>
          <div className="license-note">
            <span className="note-icon">
              <KeyRound size={14} />
            </span>
            <div>
              <strong>3 licenses need attention</strong>
              <p>Renewals are coming up in the next 30 days.</p>
            </div>
          </div>
          <button className="text-action" type="button">
            Open renewal queue <ArrowUpRight size={14} />
          </button>
        </section>
      </div>
      <section className="asset-card orders-card">
        <CardHeading title="Latest orders" action="View all orders" />
        <OrderTable />
      </section>
    </>
  );
}

function CatalogView() {
  return (
    <section className="asset-card expanded-card">
      <CardHeading title="Product catalog" action="Sort by latest" />
      <div className="asset-table expanded-table">
        <div className="table-head">
          <span>Product</span>
          <span>Type</span>
          <span>Version</span>
          <span>Downloads</span>
          <span>Status</span>
        </div>
        {assets.map((asset) => (
          <AssetRow asset={asset} expanded key={asset.name} />
        ))}
      </div>
    </section>
  );
}

function LicensesView() {
  return (
    <section className="asset-card expanded-card">
      <CardHeading title="License registry" action="Export registry" />
      <div className="license-list">
        {licenses.map((license) => (
          <div className="license-row" key={`${license.customer}-${license.product}`}>
            <span className="license-avatar">{license.initials}</span>
            <span className="license-customer">
              <strong>{license.customer}</strong>
              <small>{license.product}</small>
            </span>
            <span className="license-type">{license.type}</span>
            <span className="license-expires">{license.expires}</span>
            <span className={`license-status ${license.status === 'Active' ? 'active' : 'renew'}`}>
              {license.status}
            </span>
            <ChevronRight size={15} />
          </div>
        ))}
      </div>
    </section>
  );
}

function OrdersView() {
  return (
    <section className="asset-card expanded-card">
      <CardHeading title="Order history" action="Export orders" />
      <OrderTable expanded />
    </section>
  );
}

function OrderTable({ expanded = false }: { expanded?: boolean }) {
  return (
    <div className={`order-table ${expanded ? 'is-expanded' : ''}`}>
      <div className="table-head">
        <span>Order</span>
        <span>Customer</span>
        <span>Amount</span>
        <span>Date</span>
        <span>Status</span>
      </div>
      {orders.map((order) => (
        <div className="order-row" key={order.number}>
          <span className="order-number">{order.number}</span>
          <span className="order-customer">
            <strong>{order.customer}</strong>
            <small>{order.product}</small>
          </span>
          <strong className="order-amount">{order.amount}</strong>
          <span className="order-date">{order.date}</span>
          <span className={`order-status ${order.status.toLowerCase()}`}>{order.status}</span>
        </div>
      ))}
    </div>
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

function AssetRow({
  asset,
  expanded = false,
}: {
  asset: (typeof assets)[number];
  expanded?: boolean;
}) {
  return (
    <div className="asset-row">
      <span className={`asset-avatar ${asset.color}`}>
        <FolderOpen size={15} />
      </span>
      <span className="asset-name">
        <strong>{asset.name}</strong>
        <small>{asset.type}</small>
      </span>
      {expanded && <span className="asset-type">{asset.type}</span>}
      <span className="asset-version">{asset.version}</span>
      <span className="asset-downloads">{asset.downloads}</span>
      <span className={`asset-status ${asset.status === 'Published' ? 'published' : 'review'}`}>
        {asset.status}
      </span>
    </div>
  );
}
