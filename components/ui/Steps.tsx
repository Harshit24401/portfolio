import type { Milestone } from '@/lib/schemas';

/** Milestone track: done = filled ink dot, now = accent with a pulsing ring, todo = hollow. */
export function Steps({ milestones }: { milestones: Milestone[] }) {
  return (
    <ol className="steps">
      {milestones.map((m) => (
        <li key={m.label} data-state={m.state} aria-current={m.state === 'now' ? 'step' : undefined}>
          {m.label}
        </li>
      ))}
    </ol>
  );
}
