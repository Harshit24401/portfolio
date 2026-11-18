import { site } from '@/data/site';
import { ResumeLinks } from '@/components/track/ResumeLinks';
import { TrackFilter } from '@/components/track/TrackFilter';

export function Resume() {
  return (
    <section
      id="resume"
      aria-labelledby="resume-title"
      className="reveal mt-[clamp(88px,11vw,144px)] flex flex-wrap items-end justify-between gap-x-16 gap-y-10"
    >
      <h2
        id="resume-title"
        className="m-0 flex-[1_1_420px] font-serif text-[clamp(44px,6vw,84px)] leading-[1.02] font-normal tracking-[-0.025em]"
      >
        To be,
        <br />
        <span className="text-accent italic">or not to be</span>
      </h2>
      <div className="flex min-w-0 flex-[1_1_360px] flex-col gap-5">
        <p className="m-0 text-muted">Pick the version written for the role you&apos;re hiring for.</p>
        <div className="self-start">
          <TrackFilter label="Résumé version" />
        </div>
        <ResumeLinks />
        <span className="font-mono text-xs text-muted">Updated {site.resumeUpdated}</span>
      </div>
    </section>
  );
}
