import { Button } from '../components/button';

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center px-5 pt-28 md:px-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[.25em] text-[#C8A96B]">404</p>
        <h1 className="display text-5xl leading-none md:text-7xl">
          Nothing here <span className="italic text-[#C8A96B]">yet.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#A5A098]">
          This page doesn&apos;t exist or moved. Head back to the site and keep exploring.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Button href="/">Back home</Button>
          <Button href="/#services" variant="secondary">
            Explore services
          </Button>
        </div>
      </div>
    </main>
  );
}
