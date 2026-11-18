import { getProject, getProjects } from '@/lib/content';
import { ogCard, OG_SIZE } from '@/lib/og';

export const alt = 'Case study by Harshit Arora';
export const size = OG_SIZE;
export const contentType = 'image/png';

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const p = await getProject((await params).slug);
  return ogCard({
    title: p?.meta.title ?? 'Case study',
    accent: p ? `${p.meta.org} · ${p.meta.year}` : '',
    footer: 'Harshit Arora · Case study',
  });
}
