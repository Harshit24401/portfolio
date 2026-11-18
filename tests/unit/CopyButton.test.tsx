import { act, cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, test, vi } from 'vitest';
import { CopyButton } from '@/components/ui/CopyButton';

const setClipboard = (writeText: (t: string) => Promise<void>) =>
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });

beforeEach(() => vi.useFakeTimers());
afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

test('success: label becomes "Copied", then reverts after 1800ms', async () => {
  const writeText = vi.fn().mockResolvedValue(undefined);
  setClipboard(writeText);
  render(<CopyButton text="harshit24401@gmail.com" />);
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy address' }));
  });
  expect(writeText).toHaveBeenCalledWith('harshit24401@gmail.com');
  expect(screen.getByRole('button')).toHaveTextContent('Copied');
  act(() => vi.advanceTimersByTime(1799));
  expect(screen.getByRole('button')).toHaveTextContent('Copied');
  act(() => vi.advanceTimersByTime(1));
  expect(screen.getByRole('button')).toHaveTextContent('Copy address');
});

test('failure: label stays "Copy address"', async () => {
  setClipboard(vi.fn().mockRejectedValue(new Error('denied')));
  render(<CopyButton text="x" />);
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: 'Copy address' }));
  });
  expect(screen.getByRole('button')).toHaveTextContent('Copy address');
});

test('label sits in a polite live region', () => {
  setClipboard(vi.fn());
  render(<CopyButton text="x" />);
  expect(screen.getByRole('button')).toHaveAttribute('aria-live', 'polite');
});
