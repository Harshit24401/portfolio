import { expect, test } from 'vitest';
import { GLITCH_MS, glitchSchedule } from '@/lib/intro';

const gaps = (xs: number[]) => xs.slice(1).map((x, i) => x - xs[i]);

test('low roll: two glitches, first after the curtain, gaps 2.5–4.5s', () => {
  const s = glitchSchedule(() => 0);
  expect(s).toHaveLength(2);
  expect(s[0]).toBeGreaterThanOrEqual(1800);
  for (const g of gaps(s)) {
    expect(g).toBeGreaterThanOrEqual(2500);
    expect(g).toBeLessThanOrEqual(4500);
  }
});

test('high roll: three glitches, still within bounds', () => {
  const s = glitchSchedule(() => 0.99);
  expect(s).toHaveLength(3);
  expect(s[0]).toBeLessThanOrEqual(3000);
  for (const g of gaps(s)) {
    expect(g).toBeGreaterThanOrEqual(2500);
    expect(g).toBeLessThanOrEqual(4500);
  }
});

test('schedule is strictly increasing and finite', () => {
  for (let i = 0; i < 50; i++) {
    const s = glitchSchedule(Math.random);
    expect(gaps(s).every((g) => g > 0)).toBe(true);
    expect(s[s.length - 1]).toBeLessThanOrEqual(3000 + 2 * 4500);
  }
});

test('each glitch lasts 420ms', () => expect(GLITCH_MS).toBe(420));
