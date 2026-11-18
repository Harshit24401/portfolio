import { site } from '@/data/site';
import { CopyButton } from '@/components/ui/CopyButton';
import { ArrowRight } from '@/components/ui/icons';

/*
  Reading the clock makes a page dynamic under cacheComponents. 'use cache' runs
  this once per build instead, so the year updates on the next deploy.
*/
async function CopyrightYear() {
  'use cache';
  return <>{new Date().getFullYear()}</>;
}

export function Contact() {
  const link = 'py-3 text-muted transition-colors hover:text-ink';
  return (
    <footer id="contact" className="flex flex-col gap-10 pt-[clamp(64px,9vw,112px)] pb-12">
      <div className="flex flex-col gap-6">
        <h2 className="m-0 font-serif text-[clamp(32px,4vw,52px)] leading-[1.1] font-normal tracking-[-0.015em]">
          Hiring for full-stack or <span className="text-accent italic">AI/ML?</span>
        </h2>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-3.5">
          <a
            href={`mailto:${site.email}`}
            className="group inline-flex items-center gap-3 border-b border-rule-strong pb-1.5 text-[clamp(19px,1.8vw,23px)] text-ink no-underline [overflow-wrap:anywhere] transition-colors hover:border-accent hover:text-accent"
          >
            {site.email}
            <span className="flex-none transition-transform duration-300 ease-out group-hover:translate-x-1 motion-reduce:transition-none">
              <ArrowRight size={18} />
            </span>
          </a>
          <CopyButton text={site.email} />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t border-rule pt-5 text-[15px] text-muted">
        <span>
          © <CopyrightYear /> {site.name}
        </span>
        <nav aria-label="Elsewhere" className="flex gap-7">
          <a href={site.socials.github} target="_blank" rel="noopener noreferrer" className={link}>
            GitHub
          </a>
          <a href={site.socials.linkedin} target="_blank" rel="noopener noreferrer" className={link}>
            LinkedIn
          </a>
          <a href="#resume" className={link}>
            Résumé
          </a>
        </nav>
      </div>
    </footer>
  );
}
