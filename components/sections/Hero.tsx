import { site } from '@/data/site';
import { ArrowDown } from '@/components/ui/icons';

/** A word the headline glitch (Task 12) may pick. data-w feeds the CSS slice layers. */
const W = ({ children }: { children: string }) => (
  <span className="gw" data-w={children}>
    {children}
  </span>
);

/**
 * Hero: server-rendered so the headline is in the HTML from the first byte
 * (it's the LCP element). Motion arrives in Task 9; the flow-field in Task 11.
 * Each line is a .rise wrapper so Task 9 can slide it up out of a mask.
 */
export function Hero() {
  return (
    <section id="top" className="flex flex-col gap-8 py-[clamp(56px,9vw,112px)]">
      <h1 className="m-0 max-w-[14ch] font-serif text-[clamp(46px,6.4vw,92px)] leading-[1.02] font-normal tracking-[-0.025em]">
        <span className="rise">
          <span>
            I <W>build</W> <W>products</W>
          </span>
        </span>{' '}
        <span className="rise">
          <span>
            <W>end</W> to <W>end</W> —
          </span>
        </span>{' '}
        <span className="rise">
          <span className="text-accent italic">
            from the <W>model</W>
          </span>
        </span>{' '}
        <span className="rise">
          <span className="text-accent italic">
            to{' '}
            <span className="ink">
              the <W>button.</W>
            </span>
          </span>
        </span>
      </h1>

      <p className="m-0 max-w-[56ch] text-[clamp(17px,1.5vw,20px)] text-muted">
        Full-stack and AI/ML engineer in my final year of Computer Engineering at Thapar Institute. Most recently at
        Optum, where I built EagleEye, a LangGraph agent that reviews change requests before they ship, and took 1st
        in India &amp; Ireland at the interns&apos; Shark Tank.
      </p>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <a
          href="#resume"
          className="inline-flex min-h-12 items-center gap-2.5 rounded-full bg-ink px-6 font-medium text-solid no-underline transition-colors hover:bg-accent hover:text-on-accent"
        >
          Download résumé <ArrowDown />
        </a>
        <a
          href="#contact"
          className="inline-flex min-h-12 items-center rounded-full border border-ink px-6 font-medium text-ink no-underline transition-colors hover:bg-ink hover:text-solid"
        >
          Email me
        </a>
        <span className="inline-flex items-center gap-3 pl-1.5 text-[15px] text-muted">
          <span aria-hidden="true" className="live" />
          {site.availability}
        </span>
      </div>
    </section>
  );
}
