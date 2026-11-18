import type { Metadata } from 'next';
import { SubpageShell } from '@/components/layout/SubpageShell';
import { Prose } from '@/components/layout/Prose';
import { getPoem, getPoems } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Writing — Harshit Arora',
  description: 'Poems, mostly in English.',
  alternates: { canonical: '/writing' },
};

export default async function Writing() {
  const poems = await getPoems();
  const entries = await Promise.all(poems.map((p) => getPoem(p.slug)));

  return (
    <SubpageShell>
      <div className="flex flex-col gap-4 py-[clamp(48px,8vw,96px)]">
        <h1 className="section-title">Writing</h1>
        <p className="m-0 max-w-[52ch] text-muted">
          Poems, mostly in English. I&apos;m Joint Secretary of the Literary Society at Thapar.
        </p>
      </div>
      <div className="flex flex-col">
        {entries.map(
          (e) =>
            e && (
              // id makes each poem linkable as /writing#slug
              <article key={e.meta.slug} id={e.meta.slug} className="scroll-mt-8 border-t border-rule py-[clamp(48px,7vw,88px)]">
                <h2 className="m-0 mb-8 font-serif text-[clamp(28px,3vw,40px)] font-normal">{e.meta.title}</h2>
                <Prose source={e.body} className="poem" />
              </article>
            ),
        )}
      </div>
    </SubpageShell>
  );
}
