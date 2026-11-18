import { experience } from '@/data/experience';

/** One row per internship: dates | company + role | bullets + tags (stacks below 860px). */
export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-title" className="flex flex-col gap-7 pt-[clamp(56px,8vw,96px)]">
      <h2 id="experience-title" className="section-title">
        Experience
      </h2>
      <div>
        {experience.map((job) => (
          <article key={job.org} className="job">
            <div className="flex flex-col gap-1 font-mono text-[13px] text-muted">
              <span>{job.dates}</span>
              <span>{job.place}</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="m-0 font-serif text-[clamp(28px,2.8vw,36px)] leading-[1.1] font-normal">{job.org}</h3>
              <span className="text-muted">{job.role}</span>
            </div>
            <div className="flex flex-col gap-4">
              <ul className="m-0 flex list-disc flex-col gap-2 pl-[18px]">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-2">
                {job.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
