'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { apiRequest } from './api';
import { engines, type ApplicationStatus, type Engine, type TeamApplication } from './team-data';

const statuses: ApplicationStatus[] = ['Pending review', 'Approved', 'Waitlist', 'Declined'];

export function AdminQueue() {
  const [applications, setApplications] = useState<TeamApplication[]>([]);
  const [activeId, setActiveId] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    void apiRequest<TeamApplication[]>('/operations/applications')
      .then((stored) => {
        setApplications(stored);
        setActiveId(stored[0]?.id ?? '');
      })
      .catch((requestError) =>
        setError(
          requestError instanceof Error ? requestError.message : 'Unable to load applications.',
        ),
      );
  }, []);

  const activeApplication = applications.find((application) => application.id === activeId);

  const updateApplication = async (changes: Partial<TeamApplication>) => {
    if (!activeApplication) {
      return;
    }

    try {
      const saved = await apiRequest<Partial<TeamApplication>>(
        `/operations/applications/${activeApplication.id}`,
        {
          method: 'PATCH',
          body: JSON.stringify(changes),
        },
      );
      setApplications((current) =>
        current.map((application) =>
          application.id === activeApplication.id ? { ...application, ...saved } : application,
        ),
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to update application.',
      );
    }
  };

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="portal-mark dark-mark" href="/">
          <span className="mark-symbol">V</span>
          <span>Virtus / Team admin</span>
        </Link>
        <div className="admin-header-meta">
          <span className="live-dot" aria-hidden="true" /> Local review preview
          <Link href="/">Back to portal</Link>
        </div>
      </header>

      <div className="admin-content">
        {error && <p className="form-error">{error}</p>}
        <div className="admin-intro">
          <div>
            <p className="section-kicker">People / Intake</p>
            <h1>Find the right place for good energy.</h1>
          </div>
          <p>
            Review each person&apos;s signal, then assign the engine and status that gives them the
            strongest next step.
          </p>
        </div>

        <div className="admin-grid">
          <section className="application-list" aria-label="Team applications">
            <div className="list-heading">
              <span>Applications</span>
              <strong>{applications.length.toString().padStart(2, '0')}</strong>
            </div>
            {applications.length === 0 ? (
              <div className="empty-queue">
                <span className="empty-mark" aria-hidden="true">
                  +
                </span>
                <p>No applications yet.</p>
                <span>New submissions will appear here.</span>
              </div>
            ) : (
              applications.map((application) => (
                <button
                  className={`application-row ${activeId === application.id ? 'is-active' : ''}`}
                  key={application.id}
                  type="button"
                  onClick={() => setActiveId(application.id)}
                >
                  <span className="application-avatar">{application.name.charAt(0) || '?'}</span>
                  <span className="application-row-copy">
                    <strong>{application.name}</strong>
                    <span>{application.email}</span>
                  </span>
                  <span
                    className={`mini-status ${application.status.toLowerCase().replace(' ', '-')}`}
                  >
                    {application.status === 'Pending review' ? 'Review' : application.status}
                  </span>
                </button>
              ))
            )}
          </section>

          {activeApplication ? (
            <section className="review-panel" aria-label="Application review">
              <div className="review-heading">
                <div>
                  <p className="section-kicker">Review profile</p>
                  <h2>{activeApplication.name}</h2>
                  <a href={`mailto:${activeApplication.email}`}>{activeApplication.email}</a>
                </div>
                <span className="review-date">
                  {new Intl.DateTimeFormat('en', { month: 'short', day: 'numeric' }).format(
                    new Date(activeApplication.submittedAt),
                  )}
                </span>
              </div>

              <div className="review-block">
                <span className="review-label">Their signal</span>
                <p>{activeApplication.bio}</p>
              </div>
              <div className="review-block">
                <span className="review-label">Preferred engine</span>
                <strong>{activeApplication.engine}</strong>
              </div>
              <div className="review-block">
                <span className="review-label">Passion areas</span>
                <div className="tag-list">
                  {activeApplication.passions.map((passion) => (
                    <span className="tag" key={passion}>
                      {passion}
                    </span>
                  ))}
                </div>
                {activeApplication.otherPassion && (
                  <p className="other-note">{activeApplication.otherPassion}</p>
                )}
              </div>
              {activeApplication.portfolio && (
                <div className="review-block">
                  <span className="review-label">Portfolio</span>
                  <a href={activeApplication.portfolio} target="_blank" rel="noreferrer">
                    {activeApplication.portfolio} <span aria-hidden="true">&#8599;</span>
                  </a>
                </div>
              )}

              <div className="decision-block">
                <div className="decision-heading">
                  <span className="review-label">Admin decision</span>
                  <span>Only admins can change placement.</span>
                </div>
                <label className="field-label" htmlFor="assigned-engine">
                  Assign engine
                </label>
                <select
                  id="assigned-engine"
                  value={activeApplication.assignedEngine}
                  onChange={(event) =>
                    updateApplication({ assignedEngine: event.target.value as Engine | '' })
                  }
                >
                  <option value="">Choose an engine</option>
                  {engines.map((engine) => (
                    <option key={engine} value={engine}>
                      {engine}
                    </option>
                  ))}
                </select>
                <label className="field-label" htmlFor="application-status">
                  Status
                </label>
                <select
                  id="application-status"
                  value={activeApplication.status}
                  onChange={(event) =>
                    updateApplication({ status: event.target.value as ApplicationStatus })
                  }
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
                <label className="field-label" htmlFor="admin-note">
                  Internal note
                </label>
                <textarea
                  id="admin-note"
                  rows={3}
                  placeholder="What should the team know about this placement?"
                  value={activeApplication.adminNote}
                  onChange={(event) => updateApplication({ adminNote: event.target.value })}
                />
              </div>
            </section>
          ) : (
            <section className="review-panel review-empty">
              <span className="empty-mark" aria-hidden="true">
                +
              </span>
              <h2>Select an application</h2>
              <p>
                Choose a profile from the queue to review their signal and decide what comes next.
              </p>
            </section>
          )}
        </div>
      </div>
      <p className="admin-footnote">
        Prototype data is stored in this browser only. Connect this surface to authenticated API
        routes and PostgreSQL before production use.
      </p>
    </main>
  );
}
