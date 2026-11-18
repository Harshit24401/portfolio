import { MDXRemote } from 'next-mdx-remote/rsc';

/**
 * Renders an MDX body on the server (no MDX code reaches the browser).
 * Styling comes from the .prose rules in globals.css.
 */
export function Prose({ source, className = '' }: { source: string; className?: string }) {
  return (
    <div className={`prose ${className}`}>
      <MDXRemote source={source} />
    </div>
  );
}
