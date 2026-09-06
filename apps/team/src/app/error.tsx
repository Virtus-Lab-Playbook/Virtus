'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function OperationsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Operations Engine error:', error);
  }, [error]);

  return (
    <main className="account-shell">
      <div className="account-card">
        <p className="section-kicker">Operations / Error</p>
        <div className="account-heading">
          <div>
            <h1>Something went wrong.</h1>
            <p>The workspace hit an unexpected error. Your data is safe.</p>
          </div>
        </div>
        <button className="account-logout" type="button" onClick={() => reset()}>
          Try again
        </button>{' '}
        <Link className="account-back" href="/">
          Back to overview
        </Link>
      </div>
    </main>
  );
}
