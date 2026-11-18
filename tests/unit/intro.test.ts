import { describe, expect, test } from 'vitest';
import { INTRO, INTRO_KEY, introBootScript, shouldPlayIntro } from '@/lib/intro';

describe('shouldPlayIntro', () => {
  test('first visit plays', () => expect(shouldPlayIntro({ getItem: () => null }, false)).toBe(true));
  test('seen this session: skip', () => expect(shouldPlayIntro({ getItem: () => '1' }, false)).toBe(false));
  test('reduced motion: never', () => expect(shouldPlayIntro({ getItem: () => null }, true)).toBe(false));
  test('no storage: skip', () => expect(shouldPlayIntro(null, false)).toBe(false));
  test('storage that throws (blocked cookies): skip', () =>
    expect(
      shouldPlayIntro(
        {
          getItem: () => {
            throw new Error('SecurityError');
          },
        },
        false,
      ),
    ).toBe(false));
});

test('timings match the spec', () => {
  expect(INTRO).toEqual({ countMs: 1100, curtainMs: 950, heroOffsetMs: 1300 });
  expect(INTRO_KEY).toBe('intro-seen');
});

test('boot script is self-contained and uses the same key and offset', () => {
  const s = introBootScript();
  expect(s).toContain(`'${INTRO_KEY}'`);
  expect(s).toContain('1300ms');
  expect(s).toContain('prefers-reduced-motion');
  expect(s).not.toMatch(/\bimport\b|\brequire\b/);
});
