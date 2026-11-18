import { describe, expect, test } from 'vitest';
import { getPoems, getProject, getProjects, parseProject } from '@/lib/content';
import { skills } from '@/data/skills';
import { wip } from '@/data/wip';
import { awards } from '@/data/awards';
import { experience } from '@/data/experience';

describe('projects', () => {
  test('every project validates and slugs are unique', async () => {
    const ps = await getProjects();
    expect(ps.map((p) => p.slug).sort()).toEqual(['eagleeye', 'face-sort', 'peercall']);
  });

  test('featured project comes first', async () => {
    expect((await getProjects())[0].slug).toBe('eagleeye');
  });

  test('unknown slug returns null', async () => {
    expect(await getProject('nope')).toBeNull();
  });

  test('known slug returns meta and an MDX body', async () => {
    const p = await getProject('peercall');
    expect(p?.meta.title).toBe('PeerCall');
    expect(p?.body.length).toBeGreaterThan(0);
  });

  test('invalid frontmatter throws with the file name', () => {
    expect(() => parseProject('bad.mdx', '---\ntitle: 1\n---')).toThrow(/bad\.mdx/);
  });

  test('private project has no links and a note', async () => {
    const e = (await getProjects()).find((p) => p.slug === 'eagleeye')!;
    expect(e.links).toEqual({ live: null, github: null });
    expect(e.privateNote).toMatch(/private/);
  });
});

describe('poems', () => {
  test('poems load sorted by order, each with a two-line excerpt', async () => {
    const poems = await getPoems();
    expect(poems.length).toBeGreaterThan(0);
    expect(poems.map((p) => p.order)).toEqual([...poems.map((p) => p.order)].sort((a, b) => a - b));
    for (const p of poems) expect(p.excerpt).toHaveLength(2);
  });
});

describe('data files', () => {
  test('skills match the résumé groups', () => {
    expect(skills.map((g) => g.title)).toEqual(['Languages', 'Backend & web', 'ML & AI', 'DevOps & tools']);
    expect(skills.flatMap((g) => g.skills).find((s) => s.name === 'LangGraph')?.where).toBe('EagleEye');
  });

  test('job-hunt card has exactly one current milestone and no link yet', () => {
    const job = wip.find((w) => w.id === 'job-hunt')!;
    expect(job.milestones.filter((m) => m.state === 'now').map((m) => m.label)).toEqual(['Read replies']);
    expect(job.link).toBeNull();
  });

  test('one lead award plus five tiles', () => {
    expect(awards.filter((a) => a.lead)).toHaveLength(1);
    expect(awards.filter((a) => !a.lead)).toHaveLength(5);
  });

  test('two internships, Optum first', () => {
    expect(experience.map((j) => j.org)).toEqual(['Optum', 'CoE-DSAI, Thapar']);
  });
});
