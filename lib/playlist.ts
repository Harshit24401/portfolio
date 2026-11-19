/**
 * Spotify share link → embeddable player URL.
 * Only accepts open.spotify.com playlist links, so a typo in data/site.ts can't
 * embed some other site. The ?si= share-tracking parameter is dropped.
 */
export function spotifyEmbedUrl(share: string | null | undefined): string | null {
  if (!share) return null;
  let u: URL;
  try {
    u = new URL(share);
  } catch {
    return null;
  }
  const m = u.pathname.match(/^\/playlist\/([A-Za-z0-9]+)\/?$/);
  if (u.hostname !== 'open.spotify.com' || !m) return null;
  return `https://open.spotify.com/embed/playlist/${m[1]}?utm_source=generator&theme=0`;
}
