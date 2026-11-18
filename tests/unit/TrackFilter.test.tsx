import { afterEach, beforeEach, expect, test } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { TrackProvider } from '@/components/track/TrackProvider';
import { TrackFilter } from '@/components/track/TrackFilter';

beforeEach(() => window.history.replaceState(null, '', '/'));
afterEach(cleanup);

const twoFilters = () =>
  render(
    <TrackProvider>
      <TrackFilter label="Filter work" />
      <TrackFilter label="Filter skills" />
    </TrackProvider>,
  );

test('clicking AI / ML presses only that button', () => {
  twoFilters();
  const work = screen.getByRole('group', { name: 'Filter work' });
  fireEvent.click(within(work).getByRole('button', { name: 'AI / ML' }));
  const pressed = within(work)
    .getAllByRole('button')
    .filter((b) => b.getAttribute('aria-pressed') === 'true')
    .map((b) => b.textContent);
  expect(pressed).toEqual(['AI / ML']);
});

test('every filter on the page follows the shared state', () => {
  twoFilters();
  fireEvent.click(within(screen.getByRole('group', { name: 'Filter work' })).getByRole('button', { name: 'Full-stack' }));
  const skills = screen.getByRole('group', { name: 'Filter skills' });
  expect(within(skills).getByRole('button', { name: 'Full-stack' })).toHaveAttribute('aria-pressed', 'true');
});

test('choosing a track writes ?track= and All removes it', () => {
  twoFilters();
  const work = screen.getByRole('group', { name: 'Filter work' });
  fireEvent.click(within(work).getByRole('button', { name: 'AI / ML' }));
  expect(window.location.search).toBe('?track=ml');
  fireEvent.click(within(work).getByRole('button', { name: 'All' }));
  expect(window.location.search).toBe('');
});

test('reads the starting track from the URL', () => {
  window.history.replaceState(null, '', '/?track=fs');
  twoFilters();
  const work = screen.getByRole('group', { name: 'Filter work' });
  expect(within(work).getByRole('button', { name: 'Full-stack' })).toHaveAttribute('aria-pressed', 'true');
});
