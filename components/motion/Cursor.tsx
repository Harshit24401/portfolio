'use client';

import { useEffect, useRef } from 'react';
import { hexToRgb } from '@/lib/field';

const BIG = 'a, button, .card, .award, .award-lead';

/**
 * Custom cursor: a 6px dot on the pointer, a 34px ring that lags behind it
 * (lerp 0.18 per frame), and a short trail of accent sparks.
 * Only for a fine pointer (mouse/trackpad) with motion allowed; otherwise the
 * elements stay display:none and the native cursor is untouched.
 * Positions are written straight to element styles in one rAF loop that only
 * runs while something is still moving.
 */
export function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const trail = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const fine = matchMedia('(pointer: fine)').matches;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const d = dot.current;
    const r = ring.current;
    const c = trail.current;
    if (!fine || reduce || !d || !r || !c) return;

    const html = document.documentElement;
    html.classList.add('has-cursor');
    const ctx = c.getContext('2d')!;
    const acc = hexToRgb(getComputedStyle(html).getPropertyValue('--accent'));

    let w = 0;
    let h = 0;
    const size = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = innerWidth;
      h = innerHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    type Spark = { x: number; y: number; life: number; jx: number; jy: number };
    const p = { x: -100, y: -100, rx: -100, ry: -100 };
    let sparks: Spark[] = [];
    let fade = 0;
    let raf = 0;
    let ticking = false;

    const frame = () => {
      let busy = false;
      p.rx += (p.x - p.rx) * 0.18;
      p.ry += (p.y - p.ry) * 0.18;
      d.style.transform = `translate3d(${p.x}px,${p.y}px,0)`;
      r.style.transform = `translate3d(${p.rx.toFixed(1)}px,${p.ry.toFixed(1)}px,0)`;
      if (Math.abs(p.x - p.rx) + Math.abs(p.y - p.ry) > 0.3) busy = true;

      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      for (const s of sparks) {
        s.life -= 0.035;
        if (s.life <= 0) continue;
        const spread = (1 - s.life) * 12;
        ctx.fillStyle = `rgba(${acc},${(s.life * 0.75).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(s.x + s.jx * spread, s.y + s.jy * spread + (1 - s.life) * 8, 0.5 + 1.4 * s.life, 0, Math.PI * 2);
        ctx.fill();
      }
      sparks = sparks.filter((s) => s.life > 0);
      if (sparks.length) {
        busy = true;
        fade = 24; // keep clearing a few frames after the last spark dies
      } else if (fade > 0) {
        fade--;
        busy = true;
      }

      if (busy) raf = requestAnimationFrame(frame);
      else ticking = false;
    };
    const kick = () => {
      if (ticking) return;
      ticking = true;
      raf = requestAnimationFrame(frame);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      p.x = e.clientX;
      p.y = e.clientY;
      if (Math.random() < 0.7) sparks.push({ x: p.x, y: p.y, life: 1, jx: Math.random() - 0.5, jy: Math.random() - 0.5 });
      if (sparks.length > 48) sparks.shift();
      kick();
    };
    // Event delegation: one listener on the window instead of one per link.
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      r.classList.toggle('is-big', !!t?.closest?.(BIG));
    };
    const onDown = () => r.classList.add('is-down');
    const onUp = () => r.classList.remove('is-down');

    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('pointerover', onOver, { passive: true });
    addEventListener('pointerdown', onDown, { passive: true });
    addEventListener('pointerup', onUp, { passive: true });
    addEventListener('resize', size);
    return () => {
      cancelAnimationFrame(raf);
      html.classList.remove('has-cursor');
      removeEventListener('pointermove', onMove);
      removeEventListener('pointerover', onOver);
      removeEventListener('pointerdown', onDown);
      removeEventListener('pointerup', onUp);
      removeEventListener('resize', size);
    };
  }, []);

  return (
    <>
      <canvas ref={trail} className="cur cur-trail" aria-hidden="true" />
      <div ref={ring} className="cur cur-ring" aria-hidden="true" />
      <div ref={dot} className="cur cur-dot" aria-hidden="true" />
    </>
  );
}
