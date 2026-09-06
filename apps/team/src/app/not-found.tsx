import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="account-shell">
      <div className="account-card">
        <p className="section-kicker">Operations / Not found</p>
        <div className="account-heading">
          <div>
            <h1>This page is not in the workspace.</h1>
            <p>The route does not exist or was moved.</p>
          </div>
        </div>
        <Link className="primary-button" href="/">
          Back to overview
        </Link>
      </div>
    </main>
  );
}
