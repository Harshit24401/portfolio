import { expect, test } from './fixtures';

const frames = (page: import('@playwright/test').Page) =>
  page.evaluate(() => (window as unknown as { __fieldFrames?: number }).__fieldFrames ?? 0);

test('flow-field animates while the hero is on screen and pauses when it is not', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('canvas.field');
  await expect(canvas).toHaveCount(1);
  const a = await frames(page);
  await page.waitForTimeout(400);
  expect(await frames(page)).toBeGreaterThan(a + 5);

  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(300);
  const b = await frames(page);
  await page.waitForTimeout(400);
  expect(await frames(page)).toBe(b);
});

test('grain overlay covers the viewport and ignores the pointer', async ({ page }) => {
  await page.goto('/');
  const grain = page.locator('canvas.grain');
  await expect(grain).toHaveCount(1);
  expect(await grain.evaluate((e) => getComputedStyle(e).pointerEvents)).toBe('none');
  expect(await grain.evaluate((e) => (e as HTMLCanvasElement).width)).toBeGreaterThan(0);
});

test('hero buttons stay clickable above the canvas', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Email me' }).click();
  await expect(page).toHaveURL(/#contact$/);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('draws one static frame and stops', async ({ page }) => {
    await page.goto('/');
    const box = await page.locator('canvas.field').boundingBox();
    expect(box!.width).toBeGreaterThan(0);
    expect(box!.height).toBeGreaterThan(0);
    await page.waitForTimeout(500);
    expect(await frames(page)).toBeLessThanOrEqual(1);
  });
});
