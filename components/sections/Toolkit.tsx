import { skills } from '@/data/skills';
import { Dimmable } from '@/components/track/Dimmable';
import { TrackFilter } from '@/components/track/TrackFilter';

/** Four columns of skills with "where I used it". Rows outside the chosen track fade to 30%. */
export function Toolkit() {
  return (
    <section id="skills" aria-labelledby="skills-title" className="mt-[clamp(88px,11vw,144px)] flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2.5">
          <h2 id="skills-title" className="section-title">
            Toolkit
          </h2>
          <p className="m-0 max-w-[52ch] text-muted">
            What I reach for, and where I last shipped it. The track filter shows the stack for each role.
          </p>
        </div>
        <TrackFilter label="Filter skills by track" />
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(240px,100%),1fr))] gap-x-10 gap-y-8">
        {skills.map((group) => (
          <div key={group.title} className="reveal">
            <h3 className="m-0 mb-2 text-[15px] font-semibold">{group.title}</h3>
            {group.skills.map((s) => (
              <Dimmable key={s.name} as="div" tracks={s.tracks} offClass="is-off" className="skill">
                <span>{s.name}</span>
                {s.where && <small>{s.where}</small>}
              </Dimmable>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
