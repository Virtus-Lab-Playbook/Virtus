'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type EntranceProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

/** Above-the-fold entrance: staggered rise-in, instant when reduced motion. */
export function Entrance({ children, className, delay = 0 }: EntranceProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.2, 0.8, 0.2, 1] }}
    >
      {children}
    </motion.div>
  );
}
