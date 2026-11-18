import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { getProjects } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjects();
  return [
    { url: site.url, priority: 1 },
    ...projects.map((p) => ({ url: `${site.url}/work/${p.slug}`, priority: 0.8 })),
  ];
}
