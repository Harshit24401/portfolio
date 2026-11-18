import { describe, expect, test } from 'vitest';
import { matchesTrack, parseTrack, resumeFor, TRACK_OPTIONS } from '@/lib/track';

describe('parseTrack', () => {
  test.each([
    ['fs', 'fs'],
    ['ml', 'ml'],
    ['all', 'all'],
    ['foo', 'all'],
    ['', 'all'],
    ['ML', 'all'],
    [null, 'all'],
    [undefined, 'all'],
  ])('%j → %s', (input, out) => {
    expect(parseTrack(input as string | null | undefined)).toBe(out);
  });

  test('repeated params: first wins', () => {
    expect(parseTrack(['ml', 'fs'])).toBe('ml');
  });

  test('empty array → all', () => {
    expect(parseTrack([])).toBe('all');
  });
});

describe('matchesTrack', () => {
  test('all matches everything', () => expect(matchesTrack(['fs'], 'all')).toBe(true));
  test('core skills (no tracks) always match', () => expect(matchesTrack([], 'ml')).toBe(true));
  test('other track does not match', () => expect(matchesTrack(['fs'], 'ml')).toBe(false));
  test('shared track matches', () => expect(matchesTrack(['ml', 'fs'], 'fs')).toBe(true));
});

describe('resumeFor', () => {
  test('maps each track to its PDF and label', () => {
    expect(resumeFor('all')).toEqual({ file: '/resume/general.pdf', label: 'general' });
    expect(resumeFor('fs')).toEqual({ file: '/resume/web-dev.pdf', label: 'full-stack' });
    expect(resumeFor('ml')).toEqual({ file: '/resume/ai-ml.pdf', label: 'AI/ML' });
  });
});

test('options are All, Full-stack, AI / ML in that order', () => {
  expect(TRACK_OPTIONS.map((o) => o.label)).toEqual(['All', 'Full-stack', 'AI / ML']);
});
