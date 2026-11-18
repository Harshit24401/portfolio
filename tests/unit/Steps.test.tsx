import { afterEach, expect, test } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Steps } from '@/components/ui/Steps';

afterEach(cleanup);

test('renders an ordered list with one item per milestone and its state', () => {
  render(
    <Steps
      milestones={[
        { label: 'Design', state: 'done' },
        { label: 'Build', state: 'now' },
        { label: 'Ship', state: 'todo' },
      ]}
    />,
  );
  const items = screen.getAllByRole('listitem');
  expect(screen.getByRole('list').tagName).toBe('OL');
  expect(items.map((li) => [li.textContent, li.dataset.state])).toEqual([
    ['Design', 'done'],
    ['Build', 'now'],
    ['Ship', 'todo'],
  ]);
});

test('the current step is announced as current', () => {
  render(<Steps milestones={[{ label: 'Build', state: 'now' }]} />);
  expect(screen.getByRole('listitem')).toHaveAttribute('aria-current', 'step');
});
