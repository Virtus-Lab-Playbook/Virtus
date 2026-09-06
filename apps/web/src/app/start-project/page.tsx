import type { Metadata } from 'next';
import { Suspense } from 'react';
import { InquiryForm } from './inquiry-form';

export const metadata: Metadata = {
  title: 'Start a project | Virtus Labs',
  description:
    'Tell Virtus Labs what you are building — pick a service and submit a project inquiry.',
};

export default function StartProjectPage() {
  return (
    <main id="top" className="px-5 pb-24 pt-32 md:px-8 md:pb-32 md:pt-44">
      <div className="mx-auto max-w-3xl">
        <Suspense
          fallback={
            <p className="rounded-[1.75rem] border border-white/[.07] bg-[#111111] p-8 text-center text-sm text-[#A5A098]">
              Loading inquiry form…
            </p>
          }
        >
          <InquiryForm />
        </Suspense>
      </div>
    </main>
  );
}
