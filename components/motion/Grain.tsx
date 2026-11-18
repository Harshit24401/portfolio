'use client';

import { useEffect, useRef } from 'react';

/**
 * Film grain: one 128px tile of random grey noise, repeated across a fixed,
 * full-viewport canvas and blended softly over the page. Drawn once (and on
 * resize), so it costs nothing while scrolling.
 */
export function Grain() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const tile = document.createElement('canvas');
    tile.width = tile.height = 128;
    const t = tile.getContext('2d')!;
    const img = t.createImageData(128, 128);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = (Math.random() * 255) | 0;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 14; // alpha: very faint
    }
    t.putImageData(img, 0, 0);

    const draw = () => {
      c.width = c.clientWidth;
      c.height = c.clientHeight;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = ctx.createPattern(tile, 'repeat')!;
      ctx.fillRect(0, 0, c.width, c.height);
    };
    draw();
    window.addEventListener('resize', draw);
    return () => window.removeEventListener('resize', draw);
  }, []);

  return <canvas ref={ref} className="grain" aria-hidden="true" />;
}
