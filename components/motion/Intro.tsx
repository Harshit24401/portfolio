'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { INTRO, INTRO_KEY } from '@/lib/intro';

/*
  The <head> boot script (lib/intro.ts) decides whether the loader plays and
  marks <html data-intro="1">. This component reads that mark. The server
  always renders nothing (getServerSnapshot → false), so the overlay is never
  in the HTML: with JavaScript off, nothing ever covers the hero.
*/
const noop = () => () => {};
const readMark = () => {
  const v = document.documentElement.dataset.intro;
  return v === '1' || v === 'playing';
};

export function Intro() {
  const play = useSyncExternalStore(noop, readMark, () => false);
  const [phase, setPhase] = useState<'count' | 'out' | 'gone'>('count');
  const bar = useRef<HTMLElement>(null);
  const count = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!play) return;
    const html = document.documentElement;
    html.dataset.intro = 'playing'; // removes the CSS pre-cover; this overlay takes over
    try {
      sessionStorage.setItem(INTRO_KEY, '1');
    } catch {}

    // The counter updates 60 times a second, so it writes to the DOM directly
    // through refs instead of setState: no React re-render per frame.
    let raf = 0;
    let lift: ReturnType<typeof setTimeout> | undefined;
    let done: ReturnType<typeof setTimeout> | undefined;
    // rAF's timestamp counts from navigation start, the same clock the CSS hero
    // delays run on, so the curtain and the hero entrances stay in step.
    // If hydration was slow and we mount late, don't skip the loader: carry on
    // from where the clock says we are (at most 60%) and take at least 500ms more.
    let t0 = -1;
    let p0 = 0;
    let span: number = INTRO.countMs;
    const tick = (ts: number) => {
      if (t0 < 0) {
        t0 = ts;
        p0 = Math.min(0.6, ts / INTRO.countMs);
        span = Math.max(500, INTRO.countMs - ts);
      }
      const p = Math.min(1, p0 + (1 - p0) * ((ts - t0) / span));
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      if (bar.current) bar.current.style.transform = `scaleX(${e})`;
      if (count.current) count.current.textContent = String(Math.round(e * 100)).padStart(3, '0');
      if (p < 1) {
        raf = requestAnimationFrame(tick);
        return;
      }
      lift = setTimeout(() => setPhase('out'), 0);
      done = setTimeout(() => {
        setPhase('gone');
        html.dataset.intro = 'done';
      }, INTRO.curtainMs + 50);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(lift);
      clearTimeout(done);
    };
  }, [play]);

  if (!play || phase === 'gone') return null;

  return (
    <div className={`intro${phase === 'out' ? ' is-out' : ''}`} aria-hidden="true">
      <div className="intro-inner">
        <div className="intro-name">
          <span className="rise">
            <span style={{ '--d': '60ms', '--intro-offset': '0ms' } as React.CSSProperties}>Harshit Arora</span>
          </span>
        </div>
        <div className="intro-row">
          <span className="intro-line">
            <i ref={bar} />
          </span>
          <span ref={count} className="intro-count">
            000
          </span>
        </div>
      </div>
    </div>
  );
}
