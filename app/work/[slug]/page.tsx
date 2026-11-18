import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { SubpageShell } from '@/components/layout/SubpageShell';
import { Prose } from '@/components/layout/Prose';
import { Chip } from '@/components/ui/Chip';
import { ArrowLeft } from '@/components/ui/icons';
import { LinkButton } from '@/components/ui/LinkButton';
import { getProject, getProjects } from '@/lib/content';

type Props = { params: Promise<{ slug: string }> };

/*
  Every real case study is prerendered by generateStaticParams, so navigating to
  one is instant. Only an unknown slug renders on demand (to show the 404), so
  this segment opts out of Next's instant-navigation check rather than wrapping
  the whole page in <Suspense>, which would stream the 404 with a 200 status.
*/
export const instant = false;

/** Prerender one page per project at build time. */
export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProject((await params).slug);
  return p
    ? {
        title: `${p.meta.title} — Harshit Arora`,
        description: p.meta.summary,
        alternates: { canonical: `/work/${p.meta.slug}` },
      }
    : {};
}

export default async function CaseStudy({ params }: Props) {
  const entry = await getProject((await params).slug);
  if (!entry) notFound();
  const { meta, body } = entry;

  return (
    <SubpageShell>
      <article className="flex flex-col gap-10 py-[clamp(48px,8vw,96px)]">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 self-start text-[15px] text-muted no-underline hover:text-ink"
        >
          <ArrowLeft /> All work
        </Link>
        <header className="flex flex-col gap-6 border-b border-rule pb-10">
          <div className="flex flex-wrap items-center gap-2 text-[13px]">
            <span className="text-muted">
              {meta.org} · {meta.year}
            </span>
            {meta.tracks.map((t) => (
              <Chip key={t} track={t} />
            ))}
          </div>
          <h1 className="m-0 font-serif text-[clamp(46px,6.4vw,92px)] leading-[1.02] font-normal tracking-[-0.025em]">
            {meta.title}
          </h1>
          <p className="m-0 max-w-[56ch] text-[clamp(17px,1.5vw,20px)] text-muted">{meta.summary}</p>
          <p className="m-0 font-mono text-[13px] text-muted">{meta.stack.join(' · ')}</p>
          {(meta.links.live || meta.links.github || meta.privateNote) && (
            <div className="flex flex-wrap items-center gap-2.5">
              {meta.links.live && (
                <LinkButton href={meta.links.live} external variant="main">
                  Live demo
                </LinkButton>
              )}
              {meta.links.github && (
                <LinkButton href={meta.links.github} external>
                  GitHub
                </LinkButton>
              )}
              {meta.privateNote && <span className="text-[13px] text-muted">{meta.privateNote}</span>}
            </div>
          )}
        </header>
        <Prose source={body} className="max-w-[68ch]" />
      </article>
    </SubpageShell>
  );
}
