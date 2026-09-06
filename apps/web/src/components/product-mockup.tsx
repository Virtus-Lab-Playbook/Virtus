type ProductMockupProps = {
  kind: 'browser' | 'prompt' | 'board';
};

/** CSS/SVG-only product preview — zero JS, no external assets. */
export function ProductMockup({ kind }: ProductMockupProps) {
  if (kind === 'prompt') {
    return (
      <div
        aria-hidden="true"
        className="grid h-full place-items-center rounded-xl border border-[#C8A96B]/15 bg-[#0c0c0c] bg-[radial-gradient(circle_at_50%_0%,rgba(200,169,107,.14),transparent_60%)] p-4 transition duration-500 group-hover:-translate-y-1"
      >
        <div className="w-full max-w-[220px] rounded-lg border border-white/10 bg-[#151515] p-3 text-left">
          <div className="mb-2 h-1.5 w-16 rounded bg-[#C8A96B]/60" />
          <div className="space-y-1.5">
            <div className="h-6 rounded bg-white/[.06]" />
            <div className="h-6 rounded bg-[#C8A96B]/15" />
            <div className="h-6 rounded bg-white/[.04]" />
          </div>
          <div className="mt-2 h-6 rounded-full bg-[#C8A96B] text-center text-[10px] font-bold leading-6 text-black">
            Run workflow →
          </div>
        </div>
      </div>
    );
  }

  if (kind === 'board') {
    return (
      <div
        aria-hidden="true"
        className="grid h-full grid-cols-3 gap-2 rounded-xl border border-[#C8A96B]/15 bg-[#0c0c0c] bg-[radial-gradient(circle_at_50%_0%,rgba(200,169,107,.12),transparent_60%)] p-4 transition duration-500 group-hover:-translate-y-1"
      >
        {[0, 1, 2].map((column) => (
          <div
            key={column}
            className="space-y-2 rounded-lg border border-white/[.06] bg-[#151515] p-2"
          >
            <div className="h-1.5 w-10 rounded bg-[#C8A96B]/50" />
            <div className="h-8 rounded bg-white/[.05]" />
            <div className="h-8 rounded bg-white/[.03]" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="h-full overflow-hidden rounded-xl border border-[#C8A96B]/15 bg-[#0c0c0c] bg-[radial-gradient(circle_at_50%_0%,rgba(200,169,107,.12),transparent_60%)] transition duration-500 group-hover:-translate-y-1"
    >
      <div className="flex items-center gap-1.5 border-b border-white/[.06] px-3 py-2">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-[#C8A96B]/60" />
        <div className="ml-2 h-4 flex-1 rounded-full bg-white/[.05]" />
      </div>
      <div className="p-3">
        <div className="mb-2 h-5 w-2/3 rounded bg-gradient-to-r from-[#C8A96B]/60 to-transparent" />
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 rounded bg-white/[.05]" />
          <div className="h-12 rounded bg-[#C8A96B]/10" />
        </div>
      </div>
    </div>
  );
}
