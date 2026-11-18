import { z } from 'zod';

/*
  Zod schemas are runtime checks that also produce TypeScript types.
  TypeScript alone can't see inside an .mdx file's frontmatter, so every piece
  of content goes through one of these at build time. A typo in a content file
  then fails the build with a clear message instead of rendering something broken.
*/

export const TrackSchema = z.enum(['fs', 'ml']);
export type Track = z.infer<typeof TrackSchema>;
export type TrackFilterValue = 'all' | Track;

/** A link that may not exist yet. null means "don't render the button". */
const MaybeUrl = z.url().nullable();

export const LinksSchema = z.object({ live: MaybeUrl, github: MaybeUrl });
export type Links = z.infer<typeof LinksSchema>;

export const ProjectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  org: z.string().min(1),
  year: z.string().min(1),
  tracks: z.array(TrackSchema).min(1),
  summary: z.string().min(1),
  stack: z.array(z.string()).min(1),
  links: LinksSchema,
  featured: z.boolean().default(false),
  privateNote: z.string().nullable().default(null),
});
export type Project = z.infer<typeof ProjectSchema>;

export const MilestoneSchema = z.object({
  label: z.string().min(1),
  state: z.enum(['done', 'now', 'todo']),
});
export type Milestone = z.infer<typeof MilestoneSchema>;

export const WipSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  tracks: z.array(TrackSchema),
  status: z.enum(['building', 'next']),
  summary: z.string().min(1),
  stack: z.array(z.string()),
  milestones: z.array(MilestoneSchema).min(1),
  link: MaybeUrl,
  size: z.enum(['lg', 'sm']),
});
export type Wip = z.infer<typeof WipSchema>;

export const PoemSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  excerpt: z.tuple([z.string(), z.string()]),
  order: z.number().int(),
});
export type Poem = z.infer<typeof PoemSchema>;

/** tracks: [] means the skill is core to both tracks and is never dimmed. */
export const SkillSchema = z.object({
  name: z.string().min(1),
  tracks: z.array(TrackSchema),
  where: z.string(),
});
export type Skill = z.infer<typeof SkillSchema>;

export const SkillGroupSchema = z.object({ title: z.string(), skills: z.array(SkillSchema).min(1) });
export type SkillGroup = z.infer<typeof SkillGroupSchema>;

export const AwardSchema = z.object({
  rank: z.string().min(1),
  title: z.string().min(1),
  detail: z.string().min(1),
  lead: z.boolean().optional(),
});
export type Award = z.infer<typeof AwardSchema>;

export const JobSchema = z.object({
  org: z.string(),
  role: z.string(),
  dates: z.string(),
  place: z.string(),
  bullets: z.array(z.string()).min(1),
  tags: z.array(z.string()),
});
export type Job = z.infer<typeof JobSchema>;
