import { expect, test } from './fixtures';

const hasCursor = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.documentElement.classList.contains('has-cursor'));

test('desktop mouse gets the custom cursor; the ring grows over links', async ({ page }) => {
  await page.goto('/');
  await expect.poll(() => hasCursor(page)).toBe(true);
  await page.getByRole('link', { name: 'Email me' }).hover();
  await expect(page.locator('.cur-ring')).toHaveClass(/is-big/);
  await page.mouse.move(5, 300);
  await expect(page.locator('.cur-ring')).not.toHaveClass(/is-big/);
});

test('headline glitches 2–3 times after load, then stops', async ({ page }) => {
  test.setTimeout(40_000);
  // Record every time a word gains .glitch, so a 420ms flash can't be missed between polls.
  await page.addInitScript(() => {
    const w = window as unknown as { __glitches: number };
    w.__glitches = 0;
    new MutationObserver((ms) => {
      for (const m of ms) {
        const el = m.target as Element;
        if (el.classList.contains('glitch') && !(m.oldValue ?? '').includes('glitch')) w.__glitches++;
      }
    }).observe(document, { subtree: true, attributes: true, attributeFilter: ['class'], attributeOldValue: true });
  });
  await page.goto('/');
  await page.locator('h1').waitFor();
  await page.waitForTimeout(13_500); // longest schedule: 3s + 2 × 4.5s, plus the 420ms glitch
  const n = await page.evaluate(() => (window as unknown as { __glitches: number }).__glitches);
  expect(n).toBeGreaterThanOrEqual(2);
  expect(n).toBeLessThanOrEqual(3);
  await page.waitForTimeout(2000);
  expect(await page.evaluate(() => (window as unknown as { __glitches: number }).__glitches)).toBe(n);
  await expect(page.locator('h1 [data-w].glitch')).toHaveCount(0);
});

test('magnetic résumé button follows the pointer and settles on leave', async ({ page }) => {
  await page.goto('/');
  const mag = page.locator('[data-magnetic]');
  await expect(mag.getByRole('link', { name: /Download résumé/ })).toHaveCount(1);
  await mag.scrollIntoViewIfNeeded();
  const box = (await mag.boundingBox())!;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width - 4, box.y + box.height / 2, { steps: 4 });
  await expect.poll(() => mag.evaluate((e) => (e as HTMLElement).style.transform)).toMatch(/^translate\(\d/);
  await page.mouse.move(5, 5, { steps: 4 });
  await expect.poll(() => mag.evaluate((e) => (e as HTMLElement).style.transform)).toBe('translate(0px, 0px)');
});

test.describe('touch device', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  test('keeps the native pointer', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
    expect(await hasCursor(page)).toBe(false);
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('no custom cursor and no automatic glitch', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2500);
    expect(await hasCursor(page)).toBe(false);
    await expect(page.locator('h1 [data-w].glitch')).toHaveCount(0);
  });
});
