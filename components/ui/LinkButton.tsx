import { ArrowRight, ArrowUpRight } from './icons';

type Props = {
  href: string;
  variant?: 'main' | 'line';
  /** Opens in a new tab and shows the ↗ icon. */
  external?: boolean;
  children: React.ReactNode;
};

/** Pill link used for project links: "Case study", "Live demo ↗", "GitHub ↗". */
export function LinkButton({ href, variant = 'line', external = false, children }: Props) {
  const look =
    variant === 'main'
      ? 'border-ink bg-ink text-solid hover:border-accent hover:bg-accent hover:text-on-accent'
      : 'border-rule-strong text-ink hover:border-accent hover:text-accent';
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      className={`group inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium no-underline transition-colors ${look}`}
    >
      {children}
      <span className="transition-transform duration-300 ease-out group-hover:translate-x-0.5 motion-reduce:transition-none">
        {external ? <ArrowUpRight /> : <ArrowRight size={14} />}
      </span>
    </a>
  );
}
