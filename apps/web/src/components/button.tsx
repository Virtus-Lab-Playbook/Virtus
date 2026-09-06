import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'gold-ghost' | 'ghost';

const variantStyles: Record<Variant, string> = {
  primary:
    'inline-flex items-center justify-center gap-3 rounded-full bg-[#C8A96B] px-6 py-3.5 text-sm font-bold text-[#090909] transition hover:bg-[#E0C789]',
  secondary:
    'inline-flex items-center justify-center gap-3 rounded-full border border-white/10 bg-white/[.03] px-6 py-3.5 text-sm font-semibold text-[#F2EFE7] transition hover:border-[#C8A96B]/35 hover:bg-white/[.05]',
  'gold-ghost':
    'inline-flex items-center justify-center rounded-full border border-[#C8A96B]/35 bg-[#C8A96B]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.16em] text-[#F0D9A1] transition hover:border-[#C8A96B]/70 hover:bg-[#C8A96B]/20',
  ghost:
    'inline-flex items-center justify-center rounded-full border border-white/10 px-5 py-3 text-sm text-[#A5A098] transition hover:border-[#C8A96B]/30 hover:text-white',
};

type CommonProps = {
  variant?: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsButton = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'> & {
    href?: undefined;
    type?: 'button' | 'submit' | 'reset';
  };

type ButtonAsLink = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> & {
    href: string;
  };

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button({ variant = 'primary', children, className = '', ...rest }: ButtonProps) {
  const classes = `${variantStyles[variant]}${className ? ` ${className}` : ''}`;
  if ('href' in rest && rest.href !== undefined) {
    const { href, ...anchorRest } = rest;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }
  const { type = 'button', ...buttonRest } = rest;
  return (
    <button type={type} className={classes} {...buttonRest}>
      {children}
    </button>
  );
}
