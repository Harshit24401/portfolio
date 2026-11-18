import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { buildPayload, mapTrack } from '@/lib/spotify';

const track = (name: string) => ({
  name,
  artists: [{ name: 'Artist A' }, { name: 'Artist B' }],
  album: { images: [{ url: 'https://i.scdn.co/big', width: 640 }, { url: 'https://i.scdn.co/mid', width: 300 }, { url: 'https://i.scdn.co/small', width: 64 }] },
  external_urls: { spotify: `https://open.spotify.com/track/${name}` },
});

type Route = { status: number; body?: unknown };
/** Fake fetch: answers by URL fragment, records nothing else. */
function fakeFetch(routes: Record<string, Route>) {
  return vi.fn(async (url: string | URL) => {
    const key = Object.keys(routes).find((k) => String(url).includes(k));
    if (!key) throw new Error(`unexpected fetch ${url}`);
    const { status, body } = routes[key];
    return new Response(status === 204 ? null : JSON.stringify(body ?? {}), { status });
  });
}

const TOKEN: Route = { status: 200, body: { access_token: 'tok' } };

beforeEach(() => {
  vi.stubEnv('SPOTIFY_CLIENT_ID', 'id');
  vi.stubEnv('SPOTIFY_CLIENT_SECRET', 'secret');
  vi.stubEnv('SPOTIFY_REFRESH_TOKEN', 'refresh');
});
afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe('buildPayload', () => {
  test('missing env vars → fallback, and no network calls', async () => {
    vi.stubEnv('SPOTIFY_REFRESH_TOKEN', '');
    const f = fakeFetch({});
    vi.stubGlobal('fetch', f);
    expect(await buildPayload('https://open.spotify.com/playlist/x')).toEqual({
      mode: 'fallback',
      playlist: 'https://open.spotify.com/playlist/x',
    });
    expect(f).not.toHaveBeenCalled();
  });

  test('token endpoint refuses → fallback', async () => {
    vi.stubGlobal('fetch', fakeFetch({ '/api/token': { status: 400 } }));
    expect((await buildPayload(null)).mode).toBe('fallback');
  });

  test('something playing → playing, with mapped track and top 3', async () => {
    vi.stubGlobal(
      'fetch',
      fakeFetch({
        '/api/token': TOKEN,
        'currently-playing': { status: 200, body: { is_playing: true, item: track('Now') } },
        'top/tracks': { status: 200, body: { items: [track('A'), track('B'), track('C')] } },
      }),
    );
    const p = await buildPayload(null);
    expect(p.mode).toBe('playing');
    if (p.mode === 'fallback') throw new Error('unreachable');
    expect(p.track).toEqual({
      title: 'Now',
      artist: 'Artist A, Artist B',
      cover: 'https://i.scdn.co/mid',
      url: 'https://open.spotify.com/track/Now',
    });
    expect(p.top.map((t) => t.title)).toEqual(['A', 'B', 'C']);
  });

  test('nothing playing (204) → last played from recently-played', async () => {
    vi.stubGlobal(
      'fetch',
      fakeFetch({
        '/api/token': TOKEN,
        'currently-playing': { status: 204 },
        'recently-played': { status: 200, body: { items: [{ track: track('Earlier') }] } },
        'top/tracks': { status: 200, body: { items: [] } },
      }),
    );
    const p = await buildPayload(null);
    expect(p.mode).toBe('last');
    if (p.mode === 'fallback') throw new Error('unreachable');
    expect(p.track.title).toBe('Earlier');
  });

  test('paused track counts as last played, not playing', async () => {
    vi.stubGlobal(
      'fetch',
      fakeFetch({
        '/api/token': TOKEN,
        'currently-playing': { status: 200, body: { is_playing: false, item: track('Paused') } },
        'recently-played': { status: 200, body: { items: [{ track: track('Paused') }] } },
        'top/tracks': { status: 200, body: { items: [] } },
      }),
    );
    expect((await buildPayload(null)).mode).toBe('last');
  });

  test('top tracks rate-limited (429) → still shows the track, with empty top', async () => {
    vi.stubGlobal(
      'fetch',
      fakeFetch({
        '/api/token': TOKEN,
        'currently-playing': { status: 200, body: { is_playing: true, item: track('Now') } },
        'top/tracks': { status: 429 },
      }),
    );
    const p = await buildPayload(null);
    expect(p.mode).toBe('playing');
    if (p.mode === 'fallback') throw new Error('unreachable');
    expect(p.top).toEqual([]);
  });

  test('garbage JSON from Spotify → fallback, never throws', async () => {
    vi.stubGlobal(
      'fetch',
      fakeFetch({
        '/api/token': TOKEN,
        'currently-playing': { status: 200, body: { is_playing: true, item: { nope: 1 } } },
        'recently-played': { status: 500 },
        'top/tracks': { status: 500 },
      }),
    );
    expect((await buildPayload(null)).mode).toBe('fallback');
  });

  test('network down → fallback', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new TypeError('fetch failed')));
    expect((await buildPayload(null)).mode).toBe('fallback');
  });
});

test('mapTrack picks the image closest to 300px and joins artists', () => {
  expect(mapTrack(track('X'))?.cover).toBe('https://i.scdn.co/mid');
  expect(mapTrack({})).toBeNull();
});
