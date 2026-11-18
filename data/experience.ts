import { type Job, JobSchema } from '@/lib/schemas';

// Wording follows the résumé (job-search-automation/resume/general.tex).
export const experience: Job[] = JobSchema.array().parse([
  {
    org: 'Optum',
    role: 'Technology Development Program Intern · UnitedHealth Group',
    dates: 'Jun – Aug 2026',
    place: 'Hyderabad',
    bullets: [
      'Built EagleEye, a LangGraph agent that checks each change request against its Rally user stories and GitHub checks before approval.',
      'Built monitoring pipelines that compare live metrics with baseline data, cutting the manual checks after each release.',
    ],
    tags: ['LangGraph', 'Python', 'Rally', 'GitHub', 'Monitoring'],
  },
  {
    org: 'CoE-DSAI, Thapar',
    role: 'AI/ML Engineering Intern · Centre of Excellence in Data Science & AI',
    dates: 'Jul – Nov 2025',
    place: 'Remote',
    bullets: [
      'Served glass-property prediction models as FastAPI microservices on Docker Compose, with sub-100ms inference.',
      'Automated deployments on Linux and Azure, and sorted out networking and CORS so builds ran the same on any machine.',
    ],
    tags: ['FastAPI', 'Docker Compose', 'Azure', 'Linux'],
  },
]);
