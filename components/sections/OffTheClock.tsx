import { getPoems } from '@/lib/content';
import { SpotifyCard } from '@/components/SpotifyCard';
import { ArrowRight } from '@/components/ui/icons';

export async function OffTheClock() {
  const poems = await getPoems();
  const first = poems[0];
  const more = poems.length - 1;

  return (
    <section
      id="writing"
      aria-labelledby="writing-title"
      className="mt-[clamp(88px,11vw,144px)] flex flex-wrap gap-x-[72px] gap-y-10 border-y border-rule py-[clamp(48px,7vw,88px)]"
    >
      <div className="flex min-w-0 flex-[2_1_480px] flex-col gap-7">
        <h2 id="writing-title" className="m-0 font-serif text-[28px] font-normal">
          Off the clock
        </h2>
        {first && (
          <>
            <blockquote className="m-0 font-serif text-[clamp(28px,3.4vw,44px)] leading-[1.28] tracking-[-0.01em] italic">
              {first.excerpt.map((line) => (
                <span key={line} className="poemline block">
                  {line}
                </span>
              ))}
            </blockquote>
            <a
              href="/writing"
              className="group inline-flex min-h-11 items-center gap-2.5 self-start font-medium text-accent"
            >
              Read {first.title}
              {more > 0 && ` and ${more === 1 ? 'one' : more === 2 ? 'two' : 'three'} more`}
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none">
                <ArrowRight />
              </span>
            </a>
          </>
        )}
      </div>

      <div className="flex min-w-0 flex-[1_1_280px] flex-col gap-5 text-[15px] text-muted">
        <p className="m-0">
          <strong className="font-semibold text-ink">Joint Secretary</strong> of the Literary Society at Thapar, where I
          run the budget for every event.
        </p>
        <p className="m-0">
          <strong className="font-semibold text-ink">Core member</strong> of GDSC Thapar for a year: five campus tech
          events, 1,000+ people through the door.
        </p>
        <SpotifyCard />
      </div>
    </section>
  );
}
