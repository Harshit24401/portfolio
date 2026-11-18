import { describe, expect, test } from 'vitest';
import { fieldAngle, hexToRgb, particleCount, strandAlpha, swirl } from '@/lib/field';

describe('particleCount', () => {
  test('desktop is capped at 1100', () => expect(particleCount(1440, 900, false)).toBe(1100));
  test('phones get 40% of the area-based count', () => expect(particleCount(375, 812, true)).toBe(122));
  test('small desktop scales with area', () => expect(particleCount(800, 600, false)).toBe(480));
});

describe('fieldAngle', () => {
  test('origin at t=0 is 0', () => expect(fieldAngle(0, 0, 0)).toBe(0));
  test('matches the mock formula', () => {
    const [x, y, t] = [300, 120, 2];
    const want =
      Math.sin(x * 0.0019 + t) * Math.cos(y * 0.0023 - t * 1.3) * Math.PI * 2 + Math.sin((x + y) * 0.0008 + t * 0.7);
    expect(fieldAngle(x, y, t)).toBeCloseTo(want, 12);
  });
});

describe('swirl', () => {
  test('no push outside the radius', () => expect(swirl(300, 0)).toEqual({ vx: 0, vy: 0, stir: 0 }));
  test('stir falls off linearly with distance', () => expect(swirl(100, 0).stir).toBe(0.5));
  test('push is mostly tangential (a vortex), with a little outward', () => {
    const { vx, vy } = swirl(100, 0); // point to the right of the cursor
    expect(vy).toBeCloseTo(1.3); // tangential: 0.5 * 2.6
    expect(vx).toBeCloseTo(0.39); // outward: 0.3 * 1.3
  });
  test('cursor exactly on a point does not divide by zero', () => {
    const r = swirl(0, 0);
    expect(Number.isFinite(r.vx) && Number.isFinite(r.vy)).toBe(true);
  });
});

describe('strandAlpha', () => {
  test('fades in from birth', () => expect(strandAlpha(0, 1000, 0, 300, 0)).toBe(0));
  test('brighter toward the right edge', () =>
    expect(strandAlpha(900, 1000, 100, 300, 0)).toBeGreaterThan(strandAlpha(100, 1000, 100, 300, 0)));
  test('right edge, full stir: 0.035 + 0.24 + 0.35', () => expect(strandAlpha(1000, 1000, 100, 300, 1)).toBeCloseTo(0.625));
  test('capped at 0.8', () => expect(strandAlpha(1000, 1000, 100, 300, 2)).toBe(0.8));
});

test('hexToRgb', () => {
  expect(hexToRgb('#9cc2ff')).toBe('156,194,255');
  expect(hexToRgb('#fff')).toBe('255,255,255');
  expect(hexToRgb(' #ECEAE6 ')).toBe('236,234,230');
});
