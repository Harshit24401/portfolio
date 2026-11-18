import 'server-only';
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import matter from 'gray-matter';
import { type Poem, PoemSchema, type Project, ProjectSchema } from './schemas';

const CONTENT = path.join(process.cwd(), 'content');

type Entry<T> = { meta: T; body: string };

/** Split frontmatter from body and validate it; errors name the file so they're easy to find. */
function parseWith<T>(schema: { parse: (v: unknown) => T }, file: string, raw: string): Entry<T> {
  const { data, content } = matter(raw);
  try {
    return { meta: schema.parse(data), body: content.trim() };
  } catch (err) {
    throw new Error(`Invalid frontmatter in ${file}: ${(err as Error).message}`);
  }
}

export const parseProject = (file: string, raw: string): Entry<Project> => parseWith(ProjectSchema, file, raw);
export const parsePoem = (file: string, raw: string): Entry<Poem> => parseWith(PoemSchema, file, raw);

async function loadDir<T>(dir: string, parse: (file: string, raw: string) => Entry<T>): Promise<Entry<T>[]> {
  const full = path.join(CONTENT, dir);
  const files = (await readdir(full)).filter((f) => f.endsWith('.mdx')).sort();
  return Promise.all(files.map(async (f) => parse(f, await readFile(path.join(full, f), 'utf8'))));
}

/** All projects, featured first, then by year (newest first). */
export async function getProjects(): Promise<Project[]> {
  const entries = await loadDir('projects', parseProject);
  const slugs = entries.map((e) => e.meta.slug);
  const dupe = slugs.find((s, i) => slugs.indexOf(s) !== i);
  if (dupe) throw new Error(`Duplicate project slug: ${dupe}`);
  return entries
    .map((e) => e.meta)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || b.year.localeCompare(a.year));
}

export async function getProject(slug: string): Promise<Entry<Project> | null> {
  return (await loadDir('projects', parseProject)).find((e) => e.meta.slug === slug) ?? null;
}

export async function getPoems(): Promise<Poem[]> {
  return (await loadDir('poems', parsePoem)).map((e) => e.meta).sort((a, b) => a.order - b.order);
}

export async function getPoem(slug: string): Promise<Entry<Poem> | null> {
  return (await loadDir('poems', parsePoem)).find((e) => e.meta.slug === slug) ?? null;
}
