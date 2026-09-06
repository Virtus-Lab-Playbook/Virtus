'use client';

import { useEffect } from 'react';
import { Button } from '../components/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-screen place-items-center px-5 pt-28 md:px-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.25em] text-[#C8A96B]">
          Something broke
        </p>
        <h1 className="display text-5xl leading-none md:text-7xl">
          Let&apos;s try <span className="italic text-[#C8A96B]">again.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#A5A098]">
          This section failed to load. Retry, or head back to the top of the site.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset}>Try again</Button>
          <Button href="/" variant="secondary">
            Back home
          </Button>
        </div>
      </div>
    </main>
  );
}
