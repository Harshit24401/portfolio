import { wip } from "@/data/wip";
import type { Wip } from "@/lib/schemas";
import { Dimmable } from "@/components/track/Dimmable";
import { Chip } from "@/components/ui/Chip";
import { LinkButton } from "@/components/ui/LinkButton";
import { Steps } from "@/components/ui/Steps";

function Status({ w }: { w: Wip }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
      {w.status === "building" ? (
        <span className="inline-flex items-center gap-2.5 text-[13px] font-medium text-ink">
          <span aria-hidden="true" className="live" />
          Building now
        </span>
      ) : (
        <span className="inline-flex items-center gap-2.5 text-[13px] font-medium text-muted">
          <span
            aria-hidden="true"
            className="size-2 rounded-full border border-rule-strong"
          />
          Up next
        </span>
      )}
      {w.tracks.map((t) => (
        <Chip key={t} track={t} />
      ))}
    </div>
  );
}

export function InTheWorks() {
  const [lead, ...rest] = wip;

  return (
    <section
      id="next"
      aria-labelledby="next-title"
      className="mt-[clamp(88px,11vw,144px)] flex flex-col gap-7"
    >
      <div className="flex flex-col gap-2.5">
        <h2 id="next-title" className="section-title">
          In the works
        </h2>
        <p className="m-0 max-w-[56ch] text-muted">
          What I&apos;m building right now, and how far along it is.
        </p>
      </div>

      <Dimmable
        tracks={lead.tracks}
        className="card flex flex-wrap gap-x-14 gap-y-8 p-[clamp(24px,4vw,44px)]"
      >
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-4">
          <Status w={lead} />
          <h3 className="m-0 font-serif text-[clamp(32px,3.2vw,44px)] leading-[1.05] font-normal">
            {lead.title}
          </h3>
          <p className="m-0 max-w-[54ch] text-muted">{lead.summary}</p>
          <p className="m-0 text-sm text-muted">{lead.stack.join(", ")}</p>
        </div>
        <div className="flex min-w-0 flex-[1_1_320px] flex-col justify-between gap-5">
          <div className="flex flex-col gap-3">
            <span className="text-[13px] text-muted">Where it stands</span>
            <Steps milestones={lead.milestones} />
          </div>
          {lead.link && (
            <LinkButton href={lead.link} external>
              Follow on GitHub
            </LinkButton>
          )}
        </div>
      </Dimmable>

      {rest.length > 0 && (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(340px,100%),1fr))] gap-6">
          {rest.map((w) => (
            <Dimmable
              key={w.id}
              tracks={w.tracks}
              className={`card flex flex-col gap-4 p-8 ${w.status === "next" ? "card-dashed" : ""}`}
            >
              <Status w={w} />
              <h3 className="m-0 font-serif text-[32px] leading-[1.1] font-normal">
                {w.title}
              </h3>
              <p className="m-0 text-muted">{w.summary}</p>
              <Steps milestones={w.milestones} />
              {w.link && (
                <div className="mt-auto">
                  <LinkButton href={w.link} external>
                    Source
                  </LinkButton>
                </div>
              )}
            </Dimmable>
          ))}
        </div>
      )}
    </section>
  );
}
