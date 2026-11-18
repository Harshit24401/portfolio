import { afterEach, expect, test, vi } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { SpotifyCard } from '@/components/SpotifyCard';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});
const serve = (body: unknown) => vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body))));
const t = (title: string) => ({ title, artist: 'Someone', cover: null, url: `https://open.spotify.com/track/${title}` });

test('playing: title, artist, "Now playing" and the top tracks', async () => {
  serve({ mode: 'playing', track: t('Song'), top: [t('One'), t('Two')], playlist: 'https://open.spotify.com/playlist/p' });
  render(<SpotifyCard />);
  expect(await screen.findByText('Song')).toBeInTheDocument();
  expect(screen.getByText('Now playing')).toBeInTheDocument();
  expect(screen.getByText('One')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: /Open the playlist/ })).toHaveAttribute('href', 'https://open.spotify.com/playlist/p');
});

test('last played: says so, no equaliser', async () => {
  serve({ mode: 'last', track: t('Old'), top: [], playlist: null });
  const { container } = render(<SpotifyCard />);
  expect(await screen.findByText('Last played')).toBeInTheDocument();
  expect(container.querySelector('.eq')).toBeNull();
});

test('fallback with a playlist: only the playlist link', async () => {
  serve({ mode: 'fallback', playlist: 'https://open.spotify.com/playlist/p' });
  render(<SpotifyCard />);
  expect(await screen.findByRole('link', { name: /Open the playlist/ })).toBeInTheDocument();
  expect(screen.queryByText('Now playing')).toBeNull();
});

test('fallback without a playlist, or a failed request: renders nothing', async () => {
  serve({ mode: 'fallback', playlist: null });
  const a = render(<SpotifyCard />);
  await new Promise((r) => setTimeout(r, 20));
  expect(a.container.innerHTML).toBe('');
  cleanup();
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
  const b = render(<SpotifyCard />);
  await new Promise((r) => setTimeout(r, 20));
  expect(b.container.innerHTML).toBe('');
});
