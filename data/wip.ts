import { type Wip, WipSchema } from '@/lib/schemas';

// Update a milestone's state here to move a progress track forward.
// 'This site' and the '[Next project]' placeholder are removed for now; add
// entries back here when there's something to show.
export const wip: Wip[] = WipSchema.array().parse([
  {
    id: 'job-hunt',
    title: 'Job-hunt autopilot',
    tracks: ['ml', 'fs'],
    status: 'building',
    summary:
      'Collects listings, ranks them with BM25, embeddings and rank fusion, and has a local LLM judge the fit. Then it drafts a recruiter email that sends only after I approve it.',
    stack: ['Python', 'Supabase + pgvector', 'Ollama', 'FastAPI'],
    milestones: [
      { label: 'Collect', state: 'done' },
      { label: 'Rank', state: 'done' },
      { label: 'Assess', state: 'done' },
      { label: 'Draft & send', state: 'done' },
      { label: 'Read replies', state: 'now' },
      { label: 'Follow-ups', state: 'todo' },
      { label: 'Daily schedule', state: 'todo' },
    ],
    link: null,
    size: 'lg',
  },
]);
