'use client';

import { useRef } from 'react';

/**
 * Pulls its child slightly toward the pointer while hovered, then springs back.
 * strength is the fraction of the pointer's offset from centre to follow.
 * Ignored for touch input and under reduced motion.
 */
export function Magnetic({
  children,
  strength = { x: 0.22, y: 0.32 },
}: {
  children: React.ReactNode;
  strength?: { x: number; y: number };
}) {
  const ref = useRef<HTMLSpanElement>(null);

  const move = (e: React.PointerEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el || e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const b = el.getBoundingClientRect();
    const x = (e.clientX - b.left - b.width / 2) * strength.x;
    const y = (e.clientY - b.top - b.height / 2) * strength.y;
    el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
  };
  const leave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0px, 0px)';
  };

  return (
    <span ref={ref} data-magnetic="" className="magnetic inline-flex" onPointerMove={move} onPointerLeave={leave}>
      {children}
    </span>
  );
}
