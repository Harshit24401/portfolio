import { ImageResponse } from 'next/og';

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * Fetch just the glyphs we need from Google Fonts as TTF (the OG renderer,
 * Satori, can't read woff2). Asking without a browser user agent gets TTF back.
 * If the network is unavailable the image falls back to the built-in font
 * rather than failing the build.
 */
async function loadGoogleFont(family: string, text: string, italic = false): Promise<ArrayBuffer | null> {
  'use cache';
  try {
    const axis = italic ? 'ital,wght@1,400' : 'wght@400';
    const css = await (
      await fetch(`https://fonts.googleapis.com/css2?family=${family}:${axis}&text=${encodeURIComponent(text)}`)
    ).text();
    const src = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
    if (!src) return null;
    const res = await fetch(src);
    return res.ok ? await res.arrayBuffer() : null;
  } catch {
    return null;
  }
}

/** Night-palette share card: big serif title, italic accent line, name and site underneath. */
export async function ogCard({ title, accent, footer }: { title: string; accent: string; footer: string }) {
  const [regular, italic] = await Promise.all([
    loadGoogleFont('Newsreader', title + footer),
    loadGoogleFont('Newsreader', accent, true),
  ]);
  const fonts = [
    ...(regular ? [{ name: 'Newsreader', data: regular, style: 'normal' as const, weight: 400 as const }] : []),
    ...(italic ? [{ name: 'Newsreader', data: italic, style: 'italic' as const, weight: 400 as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'radial-gradient(900px 600px at 85% -10%, #161C26 0%, #0E0E0E 62%)',
          backgroundColor: '#0E0E0E',
          color: '#ECEAE6',
          fontFamily: 'Newsreader',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ fontSize: 96, lineHeight: 1.02, letterSpacing: '-0.025em' }}>{title}</div>
          <div style={{ fontSize: 56, fontStyle: 'italic', color: '#9CC2FF' }}>{accent}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 30, color: '#A6A6A8' }}>
          <div style={{ width: 48, height: 2, background: '#9CC2FF' }} />
          {footer}
        </div>
      </div>
    ),
    { ...OG_SIZE, fonts: fonts.length ? fonts : undefined },
  );
}
