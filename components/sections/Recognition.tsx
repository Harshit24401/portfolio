import { awards } from '@/data/awards';

export function Recognition() {
  const lead = awards.find((a) => a.lead)!;
  const tiles = awards.filter((a) => !a.lead);

  return (
    <section
      id="recognition"
      aria-labelledby="recognition-title"
      className="mt-[clamp(88px,11vw,144px)] flex flex-col gap-7"
    >
      <h2 id="recognition-title" className="section-title">
        Recognition
      </h2>

      <article className="award-lead flex flex-wrap items-end gap-x-14 gap-y-6 rounded-md border border-rule bg-surface p-[clamp(28px,4vw,48px)]">
        <div className="flex min-w-0 flex-wrap items-baseline gap-x-5 gap-y-1">
          <span className="rank font-serif text-[clamp(88px,12vw,168px)] leading-[0.85] tracking-[-0.04em] text-accent">
            {lead.rank}
          </span>
          <span className="font-serif text-[clamp(22px,2.4vw,32px)] text-muted italic">and 2nd globally</span>
        </div>
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-2">
          <h3 className="m-0 font-serif text-[clamp(26px,2.6vw,34px)] leading-[1.15] font-normal">{lead.title}</h3>
          <p className="m-0 max-w-[52ch] text-muted">{lead.detail}</p>
        </div>
      </article>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(180px,100%),1fr))] gap-4">
        {tiles.map((a) => (
          <div key={a.title} className="award flex min-h-[196px] flex-col gap-2.5 rounded-md border border-rule p-6">
            {/* Clamped so "Selected" and "Finalist" fit a tile (overflowed in the mock). */}
            <span className="rank font-serif text-[clamp(32px,2.8vw,40px)] leading-none tracking-[-0.03em] [overflow-wrap:anywhere]">
              {a.rank}
            </span>
            <span className="font-medium">{a.title}</span>
            <span className="mt-auto text-sm text-muted">{a.detail}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
