import type { ReactNode } from 'react';

type StatusMessageProps = {
  tone: 'success' | 'error' | 'info';
  title: string;
  children: ReactNode;
};

const toneStyles: Record<StatusMessageProps['tone'], string> = {
  success: 'border-[#C8A96B]/25 bg-[#C8A96B]/[.06] text-[#E0C789]',
  error: 'border-red-400/25 bg-red-400/[.06] text-red-200',
  info: 'border-white/10 bg-white/[.03] text-[#A5A098]',
};

export function StatusMessage({ tone, title, children }: StatusMessageProps) {
  return (
    <div role="status" className={`rounded-2xl border p-5 text-sm leading-6 ${toneStyles[tone]}`}>
      <strong className="mb-1 block text-xs font-semibold uppercase tracking-[.18em]">
        {title}
      </strong>
      {children}
    </div>
  );
}
