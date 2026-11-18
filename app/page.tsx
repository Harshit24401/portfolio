import { Contact } from '@/components/sections/Contact';
import { Experience } from '@/components/sections/Experience';
import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { InTheWorks } from '@/components/sections/InTheWorks';
import { Marquee } from '@/components/sections/Marquee';
import { OffTheClock } from '@/components/sections/OffTheClock';
import { Recognition } from '@/components/sections/Recognition';
import { Resume } from '@/components/sections/Resume';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Toolkit } from '@/components/sections/Toolkit';
import { TrackProvider } from '@/components/track/TrackProvider';
import { FlowField } from '@/components/motion/FlowField';
import { Glitch } from '@/components/motion/Glitch';
import { Intro } from '@/components/motion/Intro';

const wrap = 'mx-auto max-w-[1200px] px-[clamp(16px,4vw,48px)]';

export default function Home() {
  return (
    <TrackProvider>
      {/* Hero wrapper: Task 10's loader and Task 11's flow-field sit inside it. */}
      <div className="hero-wrap relative isolate">
        <Intro />
        <FlowField />
        <Glitch />
        <div className={`${wrap} relative z-[1]`}>
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
        <Toolkit />
        <OffTheClock />
        <Resume />
        <Contact />
      </main>
    </TrackProvider>
  );
}
