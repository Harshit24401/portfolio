import { Header } from '@/components/sections/Header';
import { Contact } from '@/components/sections/Contact';

const wrap = 'mx-auto max-w-[1200px] px-[clamp(16px,4vw,48px)]';

/** Header + footer around a subpage, with nav links pointing back to the home sections. */
export function SubpageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={wrap}>
      <Header base="/" />
      <main>{children}</main>
      <Contact />
    </div>
  );
}
