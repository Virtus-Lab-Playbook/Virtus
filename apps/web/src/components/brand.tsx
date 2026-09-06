type VirtusMarkProps = {
  className?: string;
  /** dark: gold on transparent for dark header. light: matte-black on cream for light surfaces / favicon. */
  variant?: 'dark' | 'light';
};

export function VirtusMark({ className = 'size-5', variant = 'dark' }: VirtusMarkProps) {
  const ring = variant === 'light' ? '#111111' : '#C8A96B';
  const bg = variant === 'light' ? '#F2EFE7' : 'none';
  const fg = variant === 'light' ? '#111111' : '#C8A96B';
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true" role="presentation">
      <circle cx="32" cy="32" r="29" fill={bg} stroke={ring} strokeWidth="2" />
      <path d="M18 24h5.8L32 42.5 40.2 24H46L34.4 48h-4.8L18 24Z" fill={fg} />
      <path d="M25.5 19.5 28 15l4 2.6L36 15l2.5 4.5L32 21.2 25.5 19.5Z" fill={fg} />
    </svg>
  );
}

export function Wordmark({ compact = false }: { compact?: boolean }) {
  return (
    <span
      className={
        compact
          ? 'font-display font-semibold tracking-[.18em] text-[#F2EFE7]'
          : 'font-display text-sm font-semibold tracking-[.22em]'
      }
    >
      VIRTUS <span className="text-[#C8A96B]">LABS</span>
    </span>
  );
}
