import 'server-only';

/*
  Spotify, server side only (the client secret must never reach the browser).

  Auth: a long-lived refresh token (made once, see docs/spotify-setup.md) is
  traded for a short-lived access token on each request. That's the OAuth
  "refresh token" flow.

  Rule for this file: the site must never break or look empty because of
  Spotify. Every failure (missing env, bad token, rate limit, odd JSON,
  network down) ends in { mode: 'fallback' }, never an exception.
*/

export type SpotifyTrack = { title: string; artist: string; cover: string | null; url: string };
export type SpotifyPayload =
  | { mode: 'playing' | 'last'; track: SpotifyTrack; top: SpotifyTrack[]; playlist: string | null }
  | { mode: 'fallback'; playlist: string | null };

const API = 'https://api.spotify.com/v1';

/** Turn Spotify's track JSON into ours; anything unexpected gives null. */
export function mapTrack(raw: unknown): SpotifyTrack | null {
  const t = raw as {
    name?: unknown;
    artists?: { name?: unknown }[];
    album?: { images?: { url?: unknown; width?: unknown }[] };
    external_urls?: { spotify?: unknown };
  } | null;
  if (!t || typeof t.name !== 'string' || typeof t.external_urls?.spotify !== 'string') return null;
  const artist = (t.artists ?? [])
    .map((a) => a?.name)
    .filter((n): n is string => typeof n === 'string')
    .join(', ');
  // Pick the image closest to 300px wide: sharp at 72px on a 2x screen, still small.
  const imgs = (t.album?.images ?? []).filter((i) => typeof i?.url === 'string');
  const best = imgs.sort((a, b) => Math.abs(Number(a.width ?? 0) - 300) - Math.abs(Number(b.width ?? 0) - 300))[0];
  return { title: t.name, artist, cover: (best?.url as string) ?? null, url: t.external_urls.spotify };
}

export async function getAccessToken(): Promise<string> {
  const { SPOTIFY_CLIENT_ID: id, SPOTIFY_CLIENT_SECRET: secret, SPOTIFY_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) throw new Error('Spotify env vars missing');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${id}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refresh }),
    cache: 'no-store',
  });
  if (!res.ok) throw new Error(`Spotify token ${res.status}`);
  const { access_token } = (await res.json()) as { access_token?: unknown };
  if (typeof access_token !== 'string') throw new Error('Spotify token missing');
  return access_token;
}

async function get(token: string, path: string): Promise<Response> {
  return fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: 'no-store' });
}

/** The track playing right now, or null if nothing is (204) or it's paused. */
export async function getNowPlaying(token: string): Promise<SpotifyTrack | null> {
  const res = await get(token, '/me/player/currently-playing');
  if (res.status === 204 || !res.ok) return null;
  const body = (await res.json()) as { is_playing?: unknown; item?: unknown };
  return body.is_playing === true ? mapTrack(body.item) : null;
}

export async function getRecentlyPlayed(token: string): Promise<SpotifyTrack | null> {
  const res = await get(token, '/me/player/recently-played?limit=1');
  if (!res.ok) return null;
  const body = (await res.json()) as { items?: { track?: unknown }[] };
  return mapTrack(body.items?.[0]?.track);
}

export async function getTopTracks(token: string, limit = 3): Promise<SpotifyTrack[]> {
  const res = await get(token, `/me/top/tracks?limit=${limit}&time_range=short_term`);
  if (!res.ok) return [];
  const body = (await res.json()) as { items?: unknown[] };
  return (body.items ?? []).map(mapTrack).filter((t): t is SpotifyTrack => t !== null);
}

/** Everything the card needs, in one shape. Never throws. */
export async function buildPayload(playlist: string | null): Promise<SpotifyPayload> {
  try {
    const token = await getAccessToken();
    const [now, top] = await Promise.all([getNowPlaying(token), getTopTracks(token).catch(() => [])]);
    if (now) return { mode: 'playing', track: now, top, playlist };
    const last = await getRecentlyPlayed(token).catch(() => null);
    if (last) return { mode: 'last', track: last, top, playlist };
  } catch {
    // fall through
  }
  return { mode: 'fallback', playlist };
}
