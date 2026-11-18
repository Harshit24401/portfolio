'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';

/**
 * Lenis smooth scrolling. Instead of hand-rolling wheel handling (easy to get
 * wrong: trackpads, keyboard, nested scrollers, accessibility), Lenis turns
 * wheel input into a target position and eases the page toward it each frame.
 * It also makes in-page #anchor links glide.
 *
 * Mouse/trackpad only: touch devices already have good native momentum, and
 * reduced-motion users get plain native scrolling.
 */
export function SmoothScroll() {
  useEffect(() => {
    const fine = matchMedia('(pointer: fine)').matches;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduce) return;
    const lenis = new Lenis({ lerp: 0.1, autoRaf: true, anchors: { offset: -12 } });
    return () => lenis.destroy();
  }, []);
  return null;
}
