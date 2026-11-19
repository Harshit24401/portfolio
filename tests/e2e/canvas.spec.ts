import { expect, test } from './fixtures';

const frames = (page: import('@playwright/test').Page) =>
  page.evaluate(() => (window as unknown as { __fieldFrames?: number }).__fieldFrames ?? 0);

test('flow-field sits behind the whole page and keeps flowing as you scroll', async ({ page }) => {
  await page.goto('/');
  const canvas = page.locator('canvas.field');
  await expect(canvas).toHaveCount(1);
  expect(await canvas.evaluate((e) => getComputedStyle(e).position)).toBe('fixed');
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight / 2));
  await page.waitForTimeout(200);
  const a = await frames(page);
  await page.waitForTimeout(400);
  expect(await frames(page)).toBeGreaterThan(a + 5);
});

test('flow-field is on case study pages too', async ({ page }) => {
  await page.goto('/work/face-sort');
  await expect(page.locator('canvas.field')).toHaveCount(1);
});

test('content stays above the field and clickable', async ({ page }) => {
  await page.goto('/');
  const btn = page.locator('#resume').getByRole('link', { name: /Download/ });
  await btn.scrollIntoViewIfNeeded();
  const box = (await btn.boundingBox())!;
  const hit = await page.evaluate(([x, y]) => document.elementFromPoint(x, y)?.closest('a')?.textContent ?? '', [
    box.x + box.width / 2,
    box.y + box.height / 2,
  ]);
  expect(hit).toContain('Download');
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
