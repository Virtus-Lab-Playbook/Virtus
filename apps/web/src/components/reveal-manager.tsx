'use client';

import { useEffect } from 'react';

/**
 * Global scroll-reveal driver for `.reveal` elements. Lives in the root layout
 * so every route animates — previously the observer only ran on the homepage
 * and reveal sections stayed invisible on other pages.
 */
export function RevealManager() {
  useEffect(() => {
    const seen = new WeakSet<Element>();
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        }),
      { threshold: 0.12 },
    );

    const watch = (root: ParentNode) => {
      root.querySelectorAll<HTMLElement>('.reveal').forEach((item) => {
        if (!seen.has(item)) {
          seen.add(item);
          observer.observe(item);
        }
      });
    };

    watch(document);
    const mutations = new MutationObserver(() => watch(document));
    mutations.observe(document.body, { childList: true, subtree: true });
    return () => {
      mutations.disconnect();
      observer.disconnect();
    };
  }, []);

  return null;
}
