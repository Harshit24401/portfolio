/*
  The hero's ink flow-field, as pure maths (no canvas, no DOM) so it can be tested.

  Each strand is a particle that moves one step per frame in the direction given
  by an angle field: a smooth function of position and time built from sines and
  cosines. Nearby points get similar angles, so strands flow in coherent ribbons;
  the slow drift of t makes the whole field breathe.
*/

/** Direction (radians) of the flow at (x, y) at time t. Formula from the design mock. */
export function fieldAngle(x: number, y: number, t: number): number {
  return (
    Math.sin(x * 0.0019 + t) * Math.cos(y * 0.0023 - t * 1.3) * Math.PI * 2 + Math.sin((x + y) * 0.0008 + t * 0.7)
  );
}

/**
 * Cursor vortex. (dx, dy) is the strand's offset from the cursor. Inside `radius`
 * the strand gets a push perpendicular to that offset (so it circles the cursor)
 * plus 30% outward, both fading linearly to zero at the edge.
 * `stir` (0–1) is how strongly it's affected; it also tints the strand accent.
 */
export function swirl(dx: number, dy: number, radius = 200): { vx: number; vy: number; stir: number } {
  const d2 = dx * dx + dy * dy;
  if (d2 >= radius * radius) return { vx: 0, vy: 0, stir: 0 };
  const d = Math.sqrt(d2) || 1; // a strand exactly under the cursor: avoid dividing by 0
  const stir = 1 - d / radius;
  const f = stir * 2.6;
  return {
    vx: (-dy / d) * f + (dx / d) * f * 0.3,
    vy: (dx / d) * f + (dy / d) * f * 0.3,
    stir,
  };
}

/** How many strands to run: proportional to area, capped, and 40% on phones. */
export function particleCount(w: number, h: number, phone: boolean): number {
  const n = Math.min(1100, (w * h) / 1000);
  return Math.round(phone ? n * 0.4 : n);
}

/**
 * Stroke opacity for one step of a strand: faint on the left, stronger toward the
 * right edge (text sits on the left), brighter when stirred, and faded in/out over
 * the first and last 30 frames of its life.
 */
export function strandAlpha(x: number, w: number, age: number, life: number, stir: number): number {
  const fade = Math.max(0, Math.min(1, age / 30, (life - age) / 30));
  const a = (0.035 + 0.24 * Math.pow(Math.max(0, x) / w, 1.4) + stir * 0.35) * fade;
  return Math.min(0.8, a);
}

/** '#9cc2ff' → '156,194,255', ready for `rgba(${rgb},${alpha})`. */
export function hexToRgb(hexIn: string): string {
  let hex = hexIn.trim().replace('#', '');
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join('');
  const n = parseInt(hex, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}
