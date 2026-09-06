'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { apiRequest } from './api';
import { engines, passions, type Engine, type Passion, type TeamApplication } from './team-data';

type PortalView = 'login' | 'intake' | 'pending';

export function TeamPortal() {
  const [view, setView] = useState<PortalView>('login');
  const [email, setEmail] = useState('');
  const [application, setApplication] = useState<TeamApplication | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    void apiRequest<{ email: string }>('/auth/me')
      .then(async (user) => {
        setEmail(user.email);
        const current = await apiRequest<TeamApplication | null>('/operations/applications/me');
        if (current) {
          setApplication(current);
          setView('pending');
        } else {
          setView('intake');
        }
      })
      .catch(() => undefined);
  }, []);

  const authenticate = async (
    event: FormEvent<HTMLFormElement>,
    mode: 'login' | 'register',
    name: string,
    password: string,
  ) => {
    event.preventDefault();
    setError('');
    try {
      await apiRequest(`/auth/${mode}`, {
        method: 'POST',
        body: JSON.stringify(mode === 'register' ? { email, password, name } : { email, password }),
      });
      setView('intake');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to sign in.');
    }
  };

  const submitApplication = async (nextApplication: TeamApplication) => {
    setError('');
    try {
      const { portfolio, ...applicationPayload } = nextApplication;
      const saved = await apiRequest<TeamApplication>('/operations/applications', {
        method: 'POST',
        body: JSON.stringify(portfolio ? nextApplication : applicationPayload),
      });
      setApplication(saved);
      setView('pending');
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to submit application.',
      );
    }
  };

  return (
    <main className="portal-shell">
      <aside className="portal-rail">
        <Link className="portal-mark" href="/" aria-label="Virtus Operations home">
          <span className="mark-symbol">V</span>
          <span>Virtus / Team access</span>
        </Link>
        <div className="rail-message">
          <p className="eyebrow">Build what compounds</p>
          <h1>Find the work that feels like yours.</h1>
          <p>
            Virtus brings ambitious people into the right engine, then gives them room to make an
            impact.
          </p>
        </div>
        <div className="rail-footer">
          <span className="rail-dot" aria-hidden="true" />
          <span>Applications are reviewed by the Operations team.</span>
        </div>
      </aside>
      <section className="portal-panel">
        {view === 'login' && (
          <LoginStep email={email} onEmailChange={setEmail} onSubmit={authenticate} error={error} />
        )}
        {view === 'intake' && (
          <IntakeForm
            email={email}
            onBack={() => setView('login')}
            onSubmit={submitApplication}
            error={error}
          />
        )}
        {view === 'pending' && application && <PendingStep application={application} />}
      </section>
    </main>
  );
}

function LoginStep({
  email,
  onEmailChange,
  onSubmit,
  error,
}: {
  email: string;
  onEmailChange: (email: string) => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>,
    mode: 'login' | 'register',
    name: string,
    password: string,
  ) => Promise<void>;
  error: string;
}) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="step-wrap narrow-step">
      <div className="step-meta">
        <span>01 / 02</span>
        <span>Secure team access</span>
      </div>
      <div className="step-heading">
        <p className="section-kicker">{mode === 'login' ? 'Welcome back' : 'Create access'}</p>
        <h2>{mode === 'login' ? 'Sign in to Virtus.' : 'Create your account.'}</h2>
        <p className="step-description">
          {mode === 'login'
            ? 'Continue your application or view your placement in the Operations Engine.'
            : 'Use an email and password to create your secure team account.'}
        </p>
      </div>
      <form
        className="portal-form"
        onSubmit={(event) => void onSubmit(event, mode, name, password)}
      >
        {mode === 'register' && (
          <div>
            <label className="field-label" htmlFor="login-name">
              Name
            </label>
            <input
              id="login-name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </div>
        )}
        <div>
          <label className="field-label" htmlFor="email">
            Work email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(event) => onEmailChange(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            minLength={8}
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="primary-button" type="submit">
          {mode === 'login' ? 'Sign in' : 'Create account'} <span aria-hidden="true">&#8594;</span>
        </button>
      </form>
      <button
        className="mode-switch"
        type="button"
        onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
      >
        {mode === 'login' ? 'Need an account? Create one' : 'Already have an account? Sign in'}
      </button>
    </div>
  );
}

function IntakeForm({
  email,
  onBack,
  onSubmit,
  error,
}: {
  email: string;
  onBack: () => void;
  onSubmit: (application: TeamApplication) => Promise<void>;
  error: string;
}) {
  const [name, setName] = useState('');
  const [engine, setEngine] = useState<Engine | 'Not sure yet'>('Not sure yet');
  const [selectedPassions, setSelectedPassions] = useState<Passion[]>([]);
  const [otherPassion, setOtherPassion] = useState('');
  const [bio, setBio] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [localError, setLocalError] = useState('');

  const togglePassion = (passion: Passion) =>
    setSelectedPassions((current) =>
      current.includes(passion)
        ? current.filter((item) => item !== passion)
        : [...current, passion],
    );
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (selectedPassions.length === 0) {
      setLocalError('Choose at least one area that gives you energy.');
      return;
    }
    void onSubmit({
      id: '',
      email,
      name,
      engine,
      passions: selectedPassions,
      otherPassion,
      bio,
      portfolio,
      status: 'Pending review',
      assignedEngine: '',
      adminNote: '',
      submittedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="step-wrap form-step">
      <div className="step-meta">
        <button className="back-link" type="button" onClick={onBack}>
          <span aria-hidden="true">&#8592;</span> Back
        </button>
        <span>02 / 02</span>
      </div>
      <div className="step-heading">
        <p className="section-kicker">Your signal</p>
        <h2>Where do you do your best work?</h2>
        <p className="step-description">
          There is no perfect answer. Tell us what pulls you in, and we&apos;ll help find the right
          place for it.
        </p>
      </div>
      <form className="portal-form" onSubmit={submit}>
        <div>
          <label className="field-label" htmlFor="name">
            Your name
          </label>
          <input
            id="name"
            type="text"
            placeholder="First and last name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>
        <fieldset>
          <legend className="field-label">Which engine interests you most?</legend>
          <div className="option-list engine-list">
            {engines.map((item) => (
              <label className={`choice-card ${engine === item ? 'is-selected' : ''}`} key={item}>
                <input
                  type="radio"
                  name="engine"
                  checked={engine === item}
                  onChange={() => setEngine(item)}
                />
                <span className="choice-indicator" aria-hidden="true" />
                <span>{item}</span>
              </label>
            ))}
            <label className={`choice-card ${engine === 'Not sure yet' ? 'is-selected' : ''}`}>
              <input
                type="radio"
                name="engine"
                checked={engine === 'Not sure yet'}
                onChange={() => setEngine('Not sure yet')}
              />
              <span className="choice-indicator" aria-hidden="true" />
              <span>Not sure yet</span>
            </label>
          </div>
        </fieldset>
        <fieldset>
          <legend className="field-label">What are you passionate about?</legend>
          <div className="passion-grid">
            {passions.map((passion) => (
              <label
                className={`choice-card ${selectedPassions.includes(passion) ? 'is-selected' : ''}`}
                key={passion}
              >
                <input
                  type="checkbox"
                  checked={selectedPassions.includes(passion)}
                  onChange={() => togglePassion(passion)}
                />
                <span className="choice-indicator" aria-hidden="true" />
                <span>{passion}</span>
              </label>
            ))}
          </div>
        </fieldset>
        {selectedPassions.includes('Other') && (
          <div>
            <label className="field-label" htmlFor="other-passion">
              Tell us more
            </label>
            <input
              id="other-passion"
              type="text"
              value={otherPassion}
              onChange={(event) => setOtherPassion(event.target.value)}
              placeholder="What else do you want to explore?"
              required
            />
          </div>
        )}
        <div>
          <label className="field-label" htmlFor="bio">
            A little about you
          </label>
          <textarea
            id="bio"
            rows={4}
            minLength={20}
            placeholder="What are you unusually good at, or excited to learn?"
            value={bio}
            onChange={(event) => setBio(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="portfolio">
            Portfolio or relevant link <span>(optional)</span>
          </label>
          <input
            id="portfolio"
            type="url"
            placeholder="https://"
            value={portfolio}
            onChange={(event) => setPortfolio(event.target.value)}
          />
        </div>
        {(localError || error) && <p className="form-error">{localError || error}</p>}
        <button className="primary-button" type="submit">
          Send for review <span aria-hidden="true">&#8599;</span>
        </button>
      </form>
    </div>
  );
}

function PendingStep({ application }: { application: TeamApplication }) {
  return (
    <div className="step-wrap narrow-step pending-step">
      <div className="status-orb" aria-hidden="true">
        <span />
      </div>
      <p className="section-kicker">Application received</p>
      <h2>You&apos;re in the queue, {application.name.split(' ')[0]}.</h2>
      <p className="step-description">
        Your answers are with the team. An admin will review your strengths and place you in the
        engine where you can have the most momentum.
      </p>
      <div className="application-summary">
        <div>
          <span>Preferred engine</span>
          <strong>{application.engine}</strong>
        </div>
        <div>
          <span>Passion areas</span>
          <strong>{application.passions.join(', ')}</strong>
        </div>
        <div>
          <span>Status</span>
          <strong className="status-text">{application.status}</strong>
        </div>
      </div>
      <Link className="subtle-link" href="/">
        Return to Operations <span aria-hidden="true">&#8599;</span>
      </Link>
    </div>
  );
}
