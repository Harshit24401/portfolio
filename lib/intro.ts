/** Landing loader timings (spec §7.1). */
export const INTRO = { countMs: 1100, curtainMs: 950, heroOffsetMs: 1300 } as const;
export const INTRO_KEY = 'intro-seen';

/**
 * Should the loader play? Only on a visitor's first home-page view this session,
 * never under reduced motion, and never if storage is unavailable or throws
 * (some browsers throw on sessionStorage when cookies are blocked); in those
 * cases skipping is safer than replaying it on every visit.
 */
export function shouldPlayIntro(storage: Pick<Storage, 'getItem'> | null, reduced: boolean): boolean {
  if (reduced || !storage) return false;
  try {
    return storage.getItem(INTRO_KEY) !== '1';
  } catch {
    return false;
  }
}

/**
 * A tiny inline script for <head>. It runs before the first paint, so the hero
 * is covered from the very first frame instead of flashing and then being hidden.
 * It only sets an attribute; with JavaScript off it never runs and nothing is covered.
 * It repeats shouldPlayIntro's rules because it can't import modules.
 */
export function introBootScript(): string {
  return `(function(){try{
var d=document.documentElement;
if(location.pathname!=='/')return;
if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
if(sessionStorage.getItem('${INTRO_KEY}')==='1')return;
d.dataset.intro='1';
d.style.setProperty('--intro-offset','${INTRO.heroOffsetMs}ms');
}catch(e){}})();`;
}

/** How long one headline glitch lasts. */
export const GLITCH_MS = 420;

/**
 * When the headline glitches on its own: 2 or 3 times, the first just after the
 * loader's curtain (1.8–3s), then 2.5–4.5s apart. After that, only on hover,
 * so the effect never loops forever (spec §7.3, Harshit's choice).
 * `rand` is injected so tests can pin the outcome.
 */
export function glitchSchedule(rand: () => number): number[] {
  const n = rand() < 0.5 ? 2 : 3;
  const out = [1800 + rand() * 1200];
  while (out.length < n) out.push(out[out.length - 1] + 2500 + rand() * 2000);
  return out;
}
