import { type Award, AwardSchema } from '@/lib/schemas';

export const awards: Award[] = AwardSchema.array().parse([
  {
    rank: '1st',
    title: 'Optum TDP Shark Tank',
    detail:
      "First place in India and Ireland, and second globally, among all of Optum's Technology Development Program interns. 2026.",
    lead: true,
  },
  { rank: 'Selected', title: 'Smart India Hackathon', detail: 'From 300+ teams, AI track · 2024' },
  { rank: '2nd', title: 'OWASP TIET Hackathon', detail: 'Internal hackathon, Thapar · 2024' },
  { rank: 'Finalist', title: 'Makeathon 6.0', detail: 'Among 100+ teams · 2024' },
  { rank: '1st', title: 'Literary Feud', detail: 'Inter-college quiz · 2024' },
  { rank: '2×', title: 'Merit Scholarship', detail: 'Two years running · 2023–25' },
]);
