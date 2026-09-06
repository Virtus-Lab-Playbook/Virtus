'use client';

import { motion, useReducedMotion } from 'framer-motion';

type Palette = { blobA: string; blobB: string; arc: string };

const fallbackPalette: Palette = {
  blobA: 'rgba(200,169,107,.20)',
  blobB: 'rgba(142,109,63,.16)',
  arc: 'rgba(200,169,107,.55)',
};

const palettes: Palette[] = [
  fallbackPalette,
  { blobA: 'rgba(224,199,137,.16)', blobB: 'rgba(200,169,107,.12)', arc: 'rgba(224,199,137,.5)' },
  { blobA: 'rgba(142,109,63,.22)', blobB: 'rgba(200,169,107,.14)', arc: 'rgba(200,169,107,.45)' },
  { blobA: 'rgba(200,169,107,.15)', blobB: 'rgba(240,217,161,.12)', arc: 'rgba(240,217,161,.5)' },
  { blobA: 'rgba(176,148,95,.20)', blobB: 'rgba(142,109,63,.15)', arc: 'rgba(200,169,107,.55)' },
  { blobA: 'rgba(200,169,107,.18)', blobB: 'rgba(120,92,52,.20)', arc: 'rgba(224,199,137,.5)' },
];

type ServiceVisualProps = {
  index: number;
};

/**
 * Generative hero backdrop: drifting gold blobs, a slow orbit arc, and a
 * faint grid. Deterministic per service; static when reduced motion is set.
 */
export function ServiceVisual({ index }: ServiceVisualProps) {
  const reduce = useReducedMotion();
  const palette = palettes[index % palettes.length] ?? fallbackPalette;

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -right-32 top-[-10%] size-[34rem] rounded-full blur-3xl"
        style={{ background: palette.blobA }}
        animate={
          reduce
            ? { opacity: 1 }
            : { x: [0, -50, 20, 0], y: [0, 40, -20, 0], scale: [1, 1.12, 0.96, 1] }
        }
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-25%] left-[-8%] size-[28rem] rounded-full blur-3xl"
        style={{ background: palette.blobB }}
        animate={
          reduce
            ? { opacity: 1 }
            : { x: [0, 40, -30, 0], y: [0, -30, 25, 0], scale: [1, 0.94, 1.08, 1] }
        }
        transition={{ duration: 24, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute right-[4%] top-[8%] size-[26rem] rounded-full md:size-[34rem]"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${palette.arc} 70deg, transparent 140deg)`,
          WebkitMaskImage: 'radial-gradient(closest-side, transparent 78%, black 79%)',
          maskImage: 'radial-gradient(closest-side, transparent 78%, black 79%)',
        }}
        animate={reduce ? { opacity: 1 } : { rotate: 360 }}
        transition={{ duration: 36, repeat: Infinity, ease: 'linear' }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(242,239,231,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(242,239,231,.035)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:radial-gradient(ellipse_70%_60%_at_60%_35%,black,transparent)]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_40%,#090909_92%)]" />
    </div>
  );
}
