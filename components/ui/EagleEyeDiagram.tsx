/**
 * The path one change request takes through EagleEye. Static for now;
 * Task 9 adds the 6s loop (nodes light up, a signal dot travels each wire,
 * the verdict box fills with the accent).
 */
export function EagleEyeDiagram() {
  const node = 'rounded border border-rule bg-surface px-[18px] py-4';
  return (
    <figure className="m-0 flex flex-col justify-center border-rule p-[clamp(24px,4vw,48px)] font-mono text-[13px] md:border-l">
      <div className={`n1 ${node}`}>change request opened</div>
      <div className="wire" aria-hidden="true">
        <span className="sig sig1" />
      </div>
      <div className="flex gap-3">
        <div className={`n2 flex-1 ${node}`}>match user stories</div>
        <div className={`n3 flex-1 ${node}`}>read GitHub checks</div>
      </div>
      <div className="wire" aria-hidden="true">
        <span className="sig sig2" />
      </div>
      <div className="relative rounded border border-accent text-accent">
        <div className="px-[18px] py-4">verdict + reasons, to the reviewer</div>
        <div aria-hidden="true" className="verdict-fill absolute inset-0 bg-accent px-[18px] py-4 text-on-accent">
          verdict + reasons, to the reviewer
        </div>
      </div>
      <figcaption className="mt-[18px] font-serif text-[15px] text-muted italic">
        One change request, as EagleEye walks it.
      </figcaption>
    </figure>
  );
}
