import { connection } from 'next/server';
import { site } from '@/data/site';
import { buildPayload } from '@/lib/spotify';

/**
 * GET /api/spotify — always 200. connection() marks this as request-time (never
 * prerendered at build), and the Cache-Control header lets Vercel's CDN reuse
 * one answer for 60s (and a stale one for 5 more minutes while it refreshes),
 * so Spotify is called at most about once a minute however many people visit.
 */
export async function GET() {
  await connection();
  return Response.json(await buildPayload(site.spotifyPlaylist), {
    headers: { 'Cache-Control': 's-maxage=60, stale-while-revalidate=300' },
  });
}
