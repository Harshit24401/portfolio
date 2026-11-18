import { expect, test } from './fixtures';

test('nav anchor glides to its section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Experience' }).click();
  // Smooth, not a jump: shortly after the click we're still on the way.
  await page.waitForTimeout(120);
  const mid = await page.locator('#experience').evaluate((e) => e.getBoundingClientRect().top);
  expect(mid).toBeGreaterThan(40);
  await expect
    .poll(() => page.locator('#experience').evaluate((e) => Math.abs(e.getBoundingClientRect().top)), { timeout: 2500 })
    .toBeLessThan(40);
});

test('wheel scrolling still moves the page', async ({ page }) => {
  await page.goto('/');
  await page.mouse.move(600, 400);
  await page.mouse.wheel(0, 900);
  await expect.poll(() => page.evaluate(() => scrollY), { timeout: 2500 }).toBeGreaterThan(500);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('native scrolling, no Lenis', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
    await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
  });
});

test.describe('touch device', () => {
  test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });
  test('native scrolling, no Lenis', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
    await expect(page.locator('html')).not.toHaveClass(/\blenis\b/);
  });
});
