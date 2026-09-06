import { footerNav } from '../data/site';
import { Wordmark } from './brand';

export function SiteFooter({ year = String(new Date().getFullYear()) }: { year?: string }) {
  return (
    <footer className="px-5 py-8 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 border-t border-white/[.07] pt-8 text-xs text-[#77736D] md:flex-row md:items-center md:justify-between">
        <div>
          <Wordmark compact />
          <span className="ml-3">© {year}</span>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-5 uppercase tracking-[.14em]"
        >
          {footerNav.map((link) => (
            <a key={`${link.label}-${link.href}`} href={link.href} className="hover:text-[#C8A96B]">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
