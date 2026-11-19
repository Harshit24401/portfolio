import { expect, test } from './fixtures';

test('playlist player loads only when opened, and keeps playing when hidden', async ({ page }) => {
  await page.goto('/');
  const toggle = page.getByRole('button', { name: /playlist/i });
  await expect(toggle).toBeVisible();
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  // Nothing from Spotify loads until the visitor asks for it.
  await expect(page.locator('iframe[src*="open.spotify.com/embed"]')).toHaveCount(0);

  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  const frame = page.locator('iframe[src*="open.spotify.com/embed/playlist/1KhWrcQqRsMrtWIZH0jdAN"]');
  await expect(frame).toBeVisible();
  await expect(frame).toHaveAttribute('title', /playlist/i);
  await expect(frame).toHaveAttribute('allow', /encrypted-media/);

  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(frame).toBeHidden();
  // Hidden, not removed: the music keeps playing while you browse.
  await expect(frame).toHaveCount(1);
});

test('player toggle is a comfortable tap target on phones and does not cause overflow', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const box = (await page.getByRole('button', { name: /playlist/i }).boundingBox())!;
  expect(box.height).toBeGreaterThanOrEqual(44);
  expect(box.x + box.width).toBeLessThanOrEqual(360);
  await page.getByRole('button', { name: /playlist/i }).click();
  const panel = (await page.locator('[data-player-panel]').boundingBox())!;
  expect(panel.x).toBeGreaterThanOrEqual(0);
  expect(panel.x + panel.width).toBeLessThanOrEqual(360);
});

test('player is on case study pages too', async ({ page }) => {
  await page.goto('/work/peercall');
  await expect(page.getByRole('button', { name: /playlist/i })).toBeVisible();
});

test('equaliser bars render and move while the player is open', async ({ page }) => {
  await page.goto('/');
  const bar = page.locator('.player-toggle .eq i').first();
  expect(await bar.evaluate((e) => e.getBoundingClientRect().width)).toBeGreaterThan(0);
  await page.getByRole('button', { name: /playlist/i }).click();
  expect(await bar.evaluate((e) => getComputedStyle(e).animationName)).toBe('eq');
});
