import { describe, expect, test } from 'vitest';

// Proves the unit-test harness (Vitest + jsdom + jest-dom) is wired up.
describe('harness', () => {
  test('jsdom provides a document', () => {
    document.body.innerHTML = '<p>hi</p>';
    expect(document.querySelector('p')).toBeInTheDocument();
  });
});
