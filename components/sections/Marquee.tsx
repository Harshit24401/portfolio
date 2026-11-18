import { Fragment } from 'react';
import { site } from '@/data/site';

/**
 * Ticker under the hero. The row is rendered twice side by side; Task 9
 * animates the track by -50% so the second copy slides into the first's place,
 * making a seamless loop. Only the first copy is read by screen readers.
 */
export function Marquee() {
  const row = (hidden: boolean) => (
    <div data-marquee-copy="" aria-hidden={hidden || undefined} className="flex flex-none items-center">
      {site.marquee.map((item) => (
        <Fragment key={item}>
          <span className="px-[26px] py-[18px] font-serif text-[22px] whitespace-nowrap text-muted italic transition-colors hover:text-ink">
            {item}
          </span>
          <i aria-hidden="true" className="block size-1.5 flex-none rounded-full bg-accent" />
        </Fragment>
      ))}
    </div>
  );
  return (
    <div className="marquee relative z-[1] overflow-hidden border-y border-rule">
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
