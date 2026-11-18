import { type Wip, WipSchema } from '@/lib/schemas';

// Update a milestone's state here to move a progress track forward.
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
  {
    id: 'this-site',
    title: 'This site',
    tracks: ['fs'],
    status: 'building',
    summary: 'Next.js, TypeScript and MDX, with the ink flow-field up top. Designed in the open, then built from the design doc.',
    stack: ['Next.js', 'TypeScript', 'Tailwind', 'MDX'],
    milestones: [
      { label: 'Design', state: 'done' },
      { label: 'Build', state: 'now' },
      { label: 'Ship', state: 'todo' },
    ],
    link: null,
    size: 'sm',
  },
  {
    id: 'up-next',
    title: '[Next project]',
    tracks: [],
    status: 'next',
    summary: '[One line on what it will do, and for whom.]',
    stack: [],
    milestones: [
      { label: 'Scope', state: 'todo' },
      { label: 'Prototype', state: 'todo' },
      { label: 'Ship', state: 'todo' },
    ],
    link: null,
    size: 'sm',
  },
]);
