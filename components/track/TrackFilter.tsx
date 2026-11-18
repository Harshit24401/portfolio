'use client';

import { TRACK_OPTIONS } from '@/lib/track';
import { useTrack } from './TrackProvider';

/**
 * Segmented control: three toggle buttons in a labelled group.
 * aria-pressed tells screen readers which one is on. The dark pill behind the
 * active label is one element moved with transform, which animates smoothly
 * (transform doesn't trigger layout).
 */
export function TrackFilter({ label }: { label: string }) {
  const { track, setTrack } = useTrack();
  const index = TRACK_OPTIONS.findIndex((o) => o.id === track);

  return (
    <div
      role="group"
      aria-label={label}
      className="relative inline-grid grid-cols-3 rounded-full border border-rule bg-surface p-1"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc((100%-0.5rem)/3)] rounded-full bg-ink transition-transform duration-500 ease-out motion-reduce:transition-none"
        style={{ transform: `translateX(${index * 100}%)` }}
      />
      {TRACK_OPTIONS.map((o) => {
        const on = o.id === track;
        return (
          <button
            key={o.id}
            type="button"
            aria-pressed={on}
            onClick={() => setTrack(o.id)}
            className={`relative min-h-11 rounded-full px-3 text-sm font-medium whitespace-nowrap transition-colors sm:min-w-[108px] sm:px-5 ${
              on ? 'text-solid' : 'text-muted hover:text-ink'
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
