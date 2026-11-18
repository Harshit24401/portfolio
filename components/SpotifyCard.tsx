'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import type { SpotifyPayload, SpotifyTrack } from '@/lib/spotify';
import { ArrowRight } from '@/components/ui/icons';

/**
 * Live Spotify card, fetched in the browser after the page loads so the static
 * page never waits on Spotify. Until data arrives (or if it never does) the
 * card renders nothing.
 */
export function SpotifyCard() {
  const [data, setData] = useState<SpotifyPayload | null>(null);

  useEffect(() => {
    let alive = true;
    fetch('/api/spotify')
      .then((r) => r.json() as Promise<SpotifyPayload>)
      .then((d) => alive && setData(d))
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  if (!data || (data.mode === 'fallback' && !data.playlist)) return null;

  const playlistLink = data.playlist && (
    <a
      href={data.playlist}
      target="_blank"
      rel="noopener noreferrer"
      className="group inline-flex min-h-11 items-center gap-2.5 self-start font-medium text-accent"
    >
      Open the playlist
      <span className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none">
        <ArrowRight />
      </span>
    </a>
  );

  return (
    <div className="flex flex-col gap-5 rounded-md border border-rule bg-surface p-6 text-[15px]">
      <div className="flex items-baseline justify-between">
        <span className="font-semibold text-ink">Spotify</span>
        {data.mode !== 'fallback' && (
          <span className="inline-flex items-center gap-2.5 text-[13px] text-muted">
            {data.mode === 'playing' && (
              <span className="eq" aria-hidden="true">
                <i />
                <i />
                <i />
                <i />
              </span>
            )}
            {data.mode === 'playing' ? 'Now playing' : 'Last played'}
          </span>
        )}
      </div>
      {data.mode !== 'fallback' && (
        <>
          <NowCard t={data.track} />
          {data.top.length > 0 && (
            <div>
              <span className="text-[13px] text-muted">On repeat</span>
              <ol className="m-0 mt-1 list-none p-0">
                {data.top.map((t, i) => (
                  <li key={t.url} className="flex items-baseline gap-3.5 border-t border-rule py-2.5">
                    <span className="w-4 text-[13px] text-muted">{i + 1}</span>
                    <a href={t.url} target="_blank" rel="noopener noreferrer" className="min-w-0 truncate text-ink no-underline hover:text-accent">
                      {t.title}
                    </a>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </>
      )}
      {playlistLink}
    </div>
  );
}

function NowCard({ t }: { t: SpotifyTrack }) {
  return (
    <a href={t.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 no-underline">
      {t.cover ? (
        <Image src={t.cover} alt="" width={72} height={72} className="size-[72px] flex-none rounded" />
      ) : (
        <span className="size-[72px] flex-none rounded bg-surface2" aria-hidden="true" />
      )}
      <span className="flex min-w-0 flex-col gap-0.5">
        <span className="truncate font-serif text-2xl leading-tight text-ink group-hover:text-accent">{t.title}</span>
        <span className="truncate text-[13px] text-muted">{t.artist}</span>
      </span>
    </a>
  );
}
