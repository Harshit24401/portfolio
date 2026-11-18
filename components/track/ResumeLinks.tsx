'use client';

import { resumeFor } from '@/lib/track';
import { ArrowDown, ArrowUpRight } from '@/components/ui/icons';
import { useTrack } from './TrackProvider';

/** Download / view buttons that follow the shared track (server HTML shows the general PDF). */
export function ResumeLinks() {
  const { track } = useTrack();
  const { file, label } = resumeFor(track);
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-3">
      <a
        href={file}
        download
        className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-6 font-medium text-solid no-underline transition-colors hover:bg-accent hover:text-on-accent"
      >
        Download {label} PDF <ArrowDown />
      </a>
      <a
        href={file}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-ink px-6 font-medium text-ink no-underline transition-colors hover:bg-ink hover:text-solid"
      >
        View in browser <ArrowUpRight size={14} />
      </a>
    </div>
  );
}
