'use client';

import { useEffect } from 'react';

/**
 * Fallback for browsers without scroll-driven animations (animation-timeline: view()).
 * Adds .reveal-js to <html> (only then does CSS hide .reveal blocks, so no-JS
 * visitors always see content) and marks each block .is-in as it scrolls into view.
 * In browsers that support view(), this does nothing: CSS handles it all.
 */
export function RevealObserver() {
  useEffect(() => {
    if (CSS.supports('animation-timeline: view()') || !('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('reveal-js');
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.15 },
    );
    document.querySelectorAll('.reveal').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
