// Inline SVG icons (no icon font, no unicode glyphs). currentColor follows the text colour.
type P = { size?: number };
const base = { fill: 'none', stroke: 'currentColor', strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const;

export const ArrowRight = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" strokeWidth={1.5} {...base}><path d="M3 8h10M9 4l4 4-4 4" /></svg>
);
export const ArrowDown = ({ size = 16 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" strokeWidth={1.5} {...base}><path d="M8 3v9M4 8l4 4 4-4" /></svg>
);
export const ArrowUpRight = ({ size = 12 }: P) => (
  <svg width={size} height={size} viewBox="0 0 16 16" strokeWidth={1.6} {...base}><path d="M5 11l6-6M6 5h5v5" /></svg>
);
