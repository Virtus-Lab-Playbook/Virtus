export type FaqItem = {
  question: string;
  answer: string;
};

/**
 * Accessible accordion built on native <details>: keyboard and screen-reader
 * support without client JavaScript.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-white/[.08] border-y border-white/[.08]">
      {items.map((item) => (
        <details
          key={item.question}
          className="group px-1 py-6 marker:hidden open:[&_.faq-icon]:rotate-45"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-semibold text-[#F2EFE7] [&::-webkit-details-marker]:hidden">
            {item.question}
            <span
              aria-hidden="true"
              className="faq-icon grid size-9 shrink-0 place-items-center rounded-full border border-white/10 text-xl leading-none text-[#C8A96B] transition-transform"
            >
              +
            </span>
          </summary>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#A5A098]">{item.answer}</p>
        </details>
      ))}
    </div>
  );
}
