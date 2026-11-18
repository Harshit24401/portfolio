import Link from 'next/link';
import { SubpageShell } from '@/components/layout/SubpageShell';

export default function NotFound() {
  return (
    <SubpageShell>
      <section className="flex flex-col gap-6 py-[clamp(72px,12vw,160px)]">
        <h1 className="m-0 font-serif text-[clamp(46px,6.4vw,92px)] leading-[1.02] font-normal tracking-[-0.025em]">
          Nothing here, <span className="text-accent italic">yet.</span>
        </h1>
        <p className="m-0 max-w-[48ch] text-muted">That page doesn&apos;t exist. The work you&apos;re after is probably on the home page.</p>
        <Link
          href="/"
          className="inline-flex min-h-12 items-center self-start rounded-full bg-ink px-6 font-medium text-solid no-underline transition-colors hover:bg-accent hover:text-on-accent"
        >
          Back to the home page
        </Link>
      </section>
    </SubpageShell>
  );
}
