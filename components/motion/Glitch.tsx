'use client';

import { useEffect } from 'react';
import { GLITCH_MS, INTRO, glitchSchedule } from '@/lib/intro';

/**
 * Plays the headline's few automatic glitches, then stops for good.
 * The effect itself is pure CSS (.gw::before/::after slices); this only adds
 * the .glitch class to a random word at each scheduled time.
 * Hover glitches need no JavaScript at all.
 */
export function Glitch() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // If the loader is playing, wait for its curtain too (same offset as the hero entrances).
    const offset = document.documentElement.dataset.intro ? INTRO.heroOffsetMs : 0;
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (const at of glitchSchedule(Math.random)) {
      timers.push(
        setTimeout(() => {
          const words = document.querySelectorAll<HTMLElement>('h1 [data-w]');
          if (!words.length || document.hidden) return;
          const w = words[Math.floor(Math.random() * words.length)];
          w.classList.add('glitch');
          timers.push(setTimeout(() => w.classList.remove('glitch'), GLITCH_MS));
        }, at + offset),
      );
    }
    return () => timers.forEach(clearTimeout);
  }, []);
  return null;
}
