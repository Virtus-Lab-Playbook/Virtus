'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowLeft, CheckCircle2, LogOut, ShieldCheck } from 'lucide-react';
import { apiRequest } from './api';

type AccountUser = { id: string; email: string; name: string; role: 'ADMIN' | 'MEMBER' };

export function AccountPage() {
  const [user, setUser] = useState<AccountUser | null>(null);
  const [error, setError] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    void apiRequest<AccountUser>('/auth/me')
      .then(setUser)
      .catch((requestError) =>
        setError(requestError instanceof Error ? requestError.message : 'Sign in required.'),
      );
  }, []);

  const logout = async () => {
    setLoggingOut(true);
    await apiRequest('/auth/logout', { method: 'POST' }).catch(() => undefined);
    window.location.href = '/login';
  };

  if (error) {
    return (
      <main className="account-shell">
        <div className="account-card">
          <p className="section-kicker">Operations / Account</p>
          <h1>Sign in to view your account.</h1>
          <p>{error}</p>
          <Link className="primary-button" href="/login">
            Go to sign in <ArrowLeft size={15} />
          </Link>
        </div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="account-shell">
        <div className="account-card">
          <p className="account-loading">Loading your account...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="account-shell">
      <div className="account-card">
        <Link className="account-back" href="/">
          <ArrowLeft size={15} /> Operations overview
        </Link>
        <div className="account-heading">
          <div className="account-avatar">{user.name.slice(0, 1).toUpperCase()}</div>
          <div>
            <p className="section-kicker">Operations / Account</p>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="account-details">
          <div>
            <span>Access level</span>
            <strong>{user.role === 'ADMIN' ? 'Administrator' : 'Team member'}</strong>
          </div>
          <div>
            <span>Account status</span>
            <strong className="account-active">
              <CheckCircle2 size={15} /> Active
            </strong>
          </div>
          <div>
            <span>Session security</span>
            <strong>
              <ShieldCheck size={15} /> Protected session
            </strong>
          </div>
        </div>
        <button
          className="account-logout"
          type="button"
          onClick={() => void logout()}
          disabled={loggingOut}
        >
          <LogOut size={15} /> {loggingOut ? 'Signing out...' : 'Sign out'}
        </button>
      </div>
    </main>
  );
}
