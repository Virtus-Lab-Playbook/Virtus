import type { ProcessStep } from '../data/site';

export function ProcessSteps({ steps }: { steps: ProcessStep[] }) {
  return (
    <div className="divide-y divide-white/[.08] border-y border-white/[.08]">
      {steps.map((step) => (
        <div key={step.number} className="reveal grid gap-4 py-8 md:grid-cols-[56px_1fr] md:py-8">
          <span
            aria-hidden="true"
            className="grid size-11 place-items-center rounded-full border border-[#C8A96B]/30 bg-[#C8A96B]/10 text-xs font-bold text-[#C8A96B]"
          >
            {step.number}
          </span>
          <div>
            <h3 className="mb-2 text-2xl font-semibold">{step.title}</h3>
            <p className="max-w-xl text-sm leading-7 text-[#A5A098]">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
