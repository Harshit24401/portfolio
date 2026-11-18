import { site } from '@/data/site';

const NAV = [
  { href: '#experience', label: 'Experience' },
  { href: '#work', label: 'Work' },
  { href: '#writing', label: 'Writing' },
  { href: '#resume', label: 'Résumé' },
  { href: '#contact', label: 'Contact' },
];

/** Not sticky (spec §7.2): it scrolls away with the hero. */
export function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-4 border-b border-rule py-6">
      <a href="#top" className="font-serif text-[22px] text-ink no-underline">
        {site.name}
      </a>
      <nav aria-label="Primary" className="flex flex-wrap gap-x-7 gap-y-1 text-[15px]">
        {NAV.map((n) => (
          <a key={n.href} href={n.href} className="py-3 text-muted no-underline transition-colors hover:text-ink">
            {n.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
