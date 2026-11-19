import { MDXRemote } from 'next-mdx-remote/rsc';
import { Pipeline } from './Pipeline';

// Components MDX files may use.
const components = { Pipeline };

/**
 * Renders an MDX body on the server (no MDX code reaches the browser).
 * Styling comes from the .prose rules in globals.css.
 */
export function Prose({ source, className = '' }: { source: string; className?: string }) {
  return (
    <div className={`prose ${className}`}>
      {/* blockJS: false lets MDX pass plain values like steps={[...]} to components.
          These files are our own, committed in the repo; next-mdx-remote's
          blockDangerousJS guard stays on. */}
      <MDXRemote source={source} components={components} options={{ blockJS: false }} />
    </div>
  );
}
