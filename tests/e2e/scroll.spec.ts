import { expect, test } from './fixtures';

test('nav anchor glides to its section', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('html')).toHaveClass(/\blenis\b/);
  // Sample scrollY every frame for a second after the click. A jump would give
  // one value; a glide gives many distinct in-between positions.
  const samples = page.evaluate(
    () =>
      new Promise<number[]>((done) => {
        // Start sampling at the click itself, so a slow click under load can't
        // make the window close before the scroll begins.
        addEventListener(
          'click',
          () => {
            const ys: number[] = [];
            const t0 = performance.now();
            const tick = (t: number) => {
              ys.push(Math.round(scrollY));
              if (t - t0 < 1000) requestAnimationFrame(tick);
              else done(ys);
            };
            requestAnimationFrame(tick);
          },
          { once: true, capture: true },
        );
      }),
  );
  await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Experience' }).click();
  const ys = await samples;
  const target = await page.locator('#experience').evaluate((e) => e.getBoundingClientRect().top + scrollY - 12);
  const between = new Set(ys.filter((y) => y > 0 && y < target - 2));
  expect(between.size).toBeGreaterThanOrEqual(5);
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
