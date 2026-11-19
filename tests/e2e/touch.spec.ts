import { expect, test } from './fixtures';

// On touch screens, browsers keep :hover applied after a tap ("sticky hover"),
// so a tapped card stayed lifted and highlighted. Hover styles must only apply
// on devices that can really hover.
test.use({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } });

test('tapping a card does not leave it stuck in its hover state', async ({ page }) => {
  await page.goto('/');
  const card = page.locator('[data-card]').first();
  await card.scrollIntoViewIfNeeded();
  const before = await card.evaluate((e) => [getComputedStyle(e).borderColor, getComputedStyle(e).transform]);
  const box = (await card.boundingBox())!;
  await page.touchscreen.tap(box.x + box.width - 20, box.y + 20);
  await page.waitForTimeout(600);
  const after = await card.evaluate((e) => [getComputedStyle(e).borderColor, getComputedStyle(e).transform]);
  expect(after).toEqual(before);
});

test('tapping an award tile does not leave it lifted', async ({ page }) => {
  await page.goto('/');
  const tile = page.locator('#recognition .award').first();
  await tile.scrollIntoViewIfNeeded();
  const box = (await tile.boundingBox())!;
  await page.touchscreen.tap(box.x + 10, box.y + 10);
  await page.waitForTimeout(600);
  expect(await tile.evaluate((e) => getComputedStyle(e).transform)).toBe('none');
});

test('tapping the marquee does not freeze it', async ({ page }) => {
  await page.goto('/');
  const m = page.locator('.marquee');
  const box = (await m.boundingBox())!;
  await page.touchscreen.tap(box.x + 50, box.y + box.height / 2);
  await page.waitForTimeout(300);
  expect(await page.locator('.marquee-track').evaluate((e) => getComputedStyle(e).animationPlayState)).toBe('running');
});
