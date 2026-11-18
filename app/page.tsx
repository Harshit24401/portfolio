import { Experience } from '@/components/sections/Experience';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { InTheWorks } from '@/components/sections/InTheWorks';
import { Marquee } from '@/components/sections/Marquee';
import { Recognition } from '@/components/sections/Recognition';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { TrackFilter } from '@/components/track/TrackFilter';
import { TrackProvider } from '@/components/track/TrackProvider';

const wrap = 'mx-auto max-w-[1200px] px-[clamp(16px,4vw,48px)]';

export default function Home() {
  return (
    <TrackProvider>
      {/* Hero wrapper: Task 10's loader and Task 11's flow-field sit inside it. */}
      <div className="relative isolate">
        <div className={wrap}>
          <Header />
          <Hero />
        </div>
        <Marquee />
      </div>
      <main className={wrap}>
        <Experience />
        <SelectedWork />
        <InTheWorks />
        <Recognition />
        {/* Stubs: replaced by the real sections in Task 6. */}
        <section id="writing" />
        <section id="resume" className="pt-24">
          <TrackFilter label="Résumé version" />
        </section>
        <footer id="contact" className="pb-24" />
      </main>
    </TrackProvider>
  );
}
