import type { Track } from '@/lib/schemas';

const LABEL: Record<Track, string> = { fs: 'Full-stack', ml: 'AI / ML' };

/** Track tag. The dot is accent for AI/ML and ink for full-stack, matching the mock. */
export function Chip({ track }: { track: Track }) {
  return (
    <span className="inline-flex items-center gap-[7px] rounded-full border border-rule-strong px-2.5 py-0.5 text-[13px] font-medium text-ink">
      <i aria-hidden="true" className={`block size-[7px] rounded-full ${track === 'ml' ? 'bg-accent' : 'bg-ink'}`} />
      {LABEL[track]}
    </span>
  );
}
