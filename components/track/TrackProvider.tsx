'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore } from 'react';
import { parseTrack, type TrackFilterValue } from '@/lib/track';

type TrackState = { track: TrackFilterValue; setTrack: (t: TrackFilterValue) => void };

const TrackContext = createContext<TrackState | null>(null);

/*
  The URL *is* the store. useSyncExternalStore is React's tool for reading state
  that lives outside React: it calls subscribe() to learn when the value may have
  changed, and getSnapshot() to read it.
*/
const CHANGE = 'trackchange';

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange); // back/forward buttons
  window.addEventListener(CHANGE, onChange); // our own writes
  return () => {
    window.removeEventListener('popstate', onChange);
    window.removeEventListener(CHANGE, onChange);
  };
}

const getSnapshot = (): TrackFilterValue =>
  parseTrack(new URLSearchParams(window.location.search).getAll('track'));

// The server has no URL to read, so it renders 'all': every card at full strength.
const getServerSnapshot = (): TrackFilterValue => 'all';

/** Write the track into the URL without a navigation, dropping the param for 'all'. */
function writeUrl(t: TrackFilterValue) {
  const url = new URL(window.location.href);
  if (t === 'all') url.searchParams.delete('track');
  else url.searchParams.set('track', t);
  const next = url.pathname + url.search + url.hash;
  if (next !== window.location.pathname + window.location.search + window.location.hash) {
    window.history.replaceState(window.history.state, '', next);
  }
  window.dispatchEvent(new Event(CHANGE));
}

/**
 * One track value shared by every filter on the page, mirrored in ?track=.
 *
 * Why not Next's useSearchParams()? On a prerendered page it makes everything up
 * to the nearest <Suspense> render only in the browser, so the server HTML would
 * be empty. Reading the URL ourselves keeps the full page in the server HTML
 * (good for SEO and no-JS) and picks up the real track after hydration.
 */
export function TrackProvider({ children }: { children: React.ReactNode }) {
  const track = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Tidy junk like ?track=foo back to a clean URL once, after hydration.
  useEffect(() => writeUrl(getSnapshot()), []);

  const setTrack = useCallback((t: TrackFilterValue) => writeUrl(t), []);

  const value = useMemo(() => ({ track, setTrack }), [track, setTrack]);
  return <TrackContext.Provider value={value}>{children}</TrackContext.Provider>;
}

export function useTrack(): TrackState {
  const ctx = useContext(TrackContext);
  if (!ctx) throw new Error('useTrack must be used inside <TrackProvider>');
  return ctx;
}
