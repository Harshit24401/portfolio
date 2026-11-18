import { site } from '@/data/site';
import { getProjects } from '@/lib/content';
import type { Project } from '@/lib/schemas';
import { Dimmable } from '@/components/track/Dimmable';
import { TrackFilter } from '@/components/track/TrackFilter';
import { Chip } from '@/components/ui/Chip';
import { EagleEyeDiagram } from '@/components/ui/EagleEyeDiagram';
import { ArrowRight } from '@/components/ui/icons';
import { LinkButton } from '@/components/ui/LinkButton';

/** Case study first; Live demo and GitHub only when the URL exists (null = no button). */
function ProjectLinks({ p }: { p: Project }) {
  return (
    <div className="mt-auto flex flex-wrap items-center gap-2.5">
      <LinkButton href={`/work/${p.slug}`} variant="main">
        {p.featured ? 'Read the case study' : 'Case study'}
      </LinkButton>
      {p.links.live && (
        <LinkButton href={p.links.live} external>
          Live demo
        </LinkButton>
      )}
      {p.links.github && (
        <LinkButton href={p.links.github} external>
          GitHub
        </LinkButton>
      )}
      {p.privateNote && <span className="pl-1.5 text-[13px] text-muted">{p.privateNote}</span>}
    </div>
  );
}

function Meta({ p }: { p: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-[13px]">
      <span className="text-muted">
        {p.org} · {p.year}
      </span>
      {p.tracks.map((t) => (
        <Chip key={t} track={t} />
      ))}
    </div>
  );
}

export async function SelectedWork() {
  const projects = await getProjects();
  const [feature, ...rest] = projects;

  return (
    <section
      id="work"
      aria-labelledby="work-title"
      className="mt-[clamp(72px,9vw,120px)] flex flex-col gap-8 border-t border-ink pt-[clamp(40px,6vw,72px)]"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="work-title" className="section-title">
          Selected work
        </h2>
        <TrackFilter label="Filter work by track" />
      </div>

      <Dimmable tracks={feature.tracks} className="card flex flex-col md:flex-row">
        <div className="flex min-w-0 flex-1 flex-col gap-5 p-[clamp(24px,4vw,48px)]">
          <Meta p={feature} />
          <h3 className="m-0 font-serif text-[clamp(36px,3.8vw,52px)] leading-[1.02] font-normal tracking-[-0.015em]">
            {feature.title}
          </h3>
          <p className="m-0 max-w-[44ch] text-[19px] text-muted">{feature.summary}</p>
          <dl className="m-0 grid grid-cols-[76px_1fr] gap-x-5 gap-y-2.5 text-[15px]">
            <dt className="text-muted">Built</dt>
            <dd className="m-0">An agent graph over Rally and GitHub that hands the reviewer a verdict with its reasons.</dd>
            <dt className="text-muted">Aim</dt>
            <dd className="m-0">Catch about 60 post-deployment defects, 120 engineer-hours, a year.</dd>
          </dl>
          <ProjectLinks p={feature} />
        </div>
        <div className="min-w-0 flex-1 border-t border-rule md:border-t-0">
          <EagleEyeDiagram />
        </div>
      </Dimmable>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))] gap-6">
        {rest.map((p) => (
          <Dimmable key={p.slug} tracks={p.tracks} className="card flex flex-col gap-3.5 p-8">
            <Meta p={p} />
            <h3 className="m-0 font-serif text-[34px] leading-[1.1] font-normal">{p.title}</h3>
            <p className="m-0 text-muted">{p.summary}</p>
            <p className="m-0 text-sm text-muted">{p.stack.join(', ')}</p>
            <ProjectLinks p={p} />
          </Dimmable>
        ))}
      </div>

      <a
        href={site.socials.github}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center justify-between gap-4 border-y border-rule py-[22px] font-serif text-[clamp(22px,2.2vw,28px)] text-ink no-underline hover:text-accent"
      >
        Everything else is on GitHub
        <span className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none">
          <ArrowRight size={20} />
        </span>
      </a>
    </section>
  );
}
