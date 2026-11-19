'use client';

import { useEffect, useState } from 'react';
import { site } from '@/data/site';
import { spotifyEmbedUrl } from '@/lib/playlist';

/**
 * A small "Play my playlist" button, fixed bottom-right on every page. Opening
 * it shows Spotify's embedded player for the public playlist.
 *
 * - Nothing from Spotify loads until the first open, so it costs page load nothing.
 * - Closing only hides the panel; the iframe stays mounted so music keeps playing
 *   while the visitor browses.
 * - Escape closes it.
 */
export function PlaylistPlayer() {
  const src = spotifyEmbedUrl(site.spotifyPlaylist);
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false); // has it ever been opened?

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open]);

  if (!src) return null;

  return (
    <div className="player">
      {loaded && (
        <div
          id="playlist-panel"
          data-player-panel=""
          role="region"
          aria-label="Harshit's playlist"
          hidden={!open}
          className="player-panel"
        >
          <iframe
            title="Harshit's Spotify playlist"
            src={src}
            width="100%"
            height="352"
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            className="block rounded-xl border-0"
          />
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls="playlist-panel"
        onClick={() => {
          setLoaded(true);
          setOpen((o) => !o);
        }}
        className="player-toggle"
      >
        <span className={`eq${open ? '' : ' eq-still'}`} aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
        </span>
        {open ? 'Hide playlist' : 'Play my playlist'}
      </button>
    </div>
  );
}
