'use client';

import { useEffect, useRef } from 'react';
import { fieldAngle, hexToRgb, particleCount, strandAlpha, swirl } from '@/lib/field';

type Strand = { x: number; y: number; age: number; life: number };

/**
 * Ink flow-field behind the whole site: a fixed, viewport-sized canvas, so the
 * field stays with you as you scroll and costs the same on a long page as a short one.
 * - Transparent canvas: old strokes are faded with 'destination-out', which
 *   erases toward transparent instead of painting the background colour over them.
 * - Pauses while the tab is hidden.
 * - Reduced motion: draws a settled static frame once, then stops.
 */
export function FlowField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d')!;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const phone = matchMedia('(pointer: coarse)').matches || innerWidth < 768;
    const css = getComputedStyle(document.documentElement);
    const ink = hexToRgb(css.getPropertyValue('--ink'));
    const acc = hexToRgb(css.getPropertyValue('--accent'));
    const dev = process.env.NODE_ENV !== 'production';
    const w0 = window as unknown as { __fieldFrames?: number };
    if (dev) w0.__fieldFrames = 0;

    let w = 0;
    let h = 0;
    const size = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = Math.round(w * dpr);
      c.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size();

    const spawn = (): Strand => ({ x: Math.random() * w, y: Math.random() * h, age: 0, life: 140 + Math.random() * 260 });
    const strands = Array.from({ length: particleCount(w, h, phone) }, () => {
      const s = spawn();
      s.age = Math.random() * s.life; // stagger lifetimes so they don't all fade together
      return s;
    });

    const mouse = { x: -9999, y: -9999 };
    const onPointer = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    addEventListener('pointermove', onPointer, { passive: true });

    const step = (ts: number) => {
      const t = ts * 0.00008;
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.075)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'source-over';
      ctx.lineWidth = 0.9;
      ctx.lineCap = 'round';
      for (const s of strands) {
        const a = fieldAngle(s.x, s.y, t);
        const sw = swirl(s.x - mouse.x, s.y - mouse.y);
        const nx = s.x + Math.cos(a) * 0.85 + sw.vx;
        const ny = s.y + Math.sin(a) * 0.85 + sw.vy;
        const alpha = strandAlpha(s.x, w, s.age, s.life, sw.stir);
        ctx.strokeStyle = `rgba(${sw.stir > 0.15 ? acc : ink},${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(nx, ny);
        ctx.stroke();
        s.x = nx;
        s.y = ny;
        s.age++;
        if (s.age > s.life || nx < -10 || nx > w + 10 || ny < -10 || ny > h + 10) Object.assign(s, spawn());
      }
    };

    if (reduce) {
      // One settled frame: run 180 steps off-screen-time, then show the result.
      for (let k = 0; k < 180; k++) step(k * 16);
      if (dev) w0.__fieldFrames = 1;
      return () => removeEventListener('pointermove', onPointer);
    }

    let raf = 0;
    let running = false;
    let onScreen = true;
    const loop = () => {
      if (running) return;
      running = true;
      const tick = (ts: number) => {
        if (!onScreen || document.hidden) {
          running = false;
          return;
        }
        step(ts);
        if (dev) w0.__fieldFrames = (w0.__fieldFrames ?? 0) + 1;
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(([e]) => {
      onScreen = e.isIntersecting;
      if (onScreen) loop();
    });
    io.observe(c);
    const onVis = () => !document.hidden && loop();
    document.addEventListener('visibilitychange', onVis);
    const onResize = () => size();
    addEventListener('resize', onResize);
    loop();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
      removeEventListener('resize', onResize);
      removeEventListener('pointermove', onPointer);
    };
  }, []);

  return <canvas ref={ref} className="field" aria-hidden="true" />;
}
