import type { Track, TrackFilterValue } from './schemas';

export type { Track, TrackFilterValue };

export const TRACK_OPTIONS = [
  { id: 'all', label: 'All' },
  { id: 'fs', label: 'Full-stack' },
  { id: 'ml', label: 'AI / ML' },
] as const satisfies readonly { id: TrackFilterValue; label: string }[];

const VALID = new Set<string>(['all', 'fs', 'ml']);

/**
 * Turn a raw ?track= value into a filter value. Anything unexpected
 * (missing, empty, wrong case, unknown) falls back to 'all' rather than throwing:
 * a mistyped link from a recruiter should still show the whole site.
 */
export function parseTrack(v: string | string[] | null | undefined): TrackFilterValue {
  const first = Array.isArray(v) ? v[0] : v;
  return first && VALID.has(first) ? (first as TrackFilterValue) : 'all';
}

/** Should an item tagged with `tracks` show at full strength under filter `t`? */
export function matchesTrack(tracks: readonly Track[], t: TrackFilterValue): boolean {
  return t === 'all' || tracks.length === 0 || tracks.includes(t);
}

const RESUMES: Record<TrackFilterValue, { file: string; label: string }> = {
  all: { file: '/resume/general.pdf', label: 'general' },
  fs: { file: '/resume/web-dev.pdf', label: 'full-stack' },
  ml: { file: '/resume/ai-ml.pdf', label: 'AI/ML' },
};

export function resumeFor(t: TrackFilterValue): { file: string; label: string } {
  return RESUMES[t];
}
