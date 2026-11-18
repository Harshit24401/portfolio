import { expect, test } from '@playwright/test';

test('first visit plays the loader once, then never again this session', async ({ page }) => {
  await page.goto('/');
  const intro = page.locator('.intro');
  await expect(intro).toBeVisible();
  await expect(intro.locator('.intro-name')).toHaveText('Harshit Arora');
  await expect(intro).toHaveCount(0, { timeout: 3000 });
  await expect(page.locator('h1')).toBeVisible();

  await page.reload();
  await page.waitForTimeout(300);
  await expect(page.locator('.intro')).toHaveCount(0);
});

test('counter runs from 000 to 100', async ({ page }) => {
  await page.goto('/');
  const count = page.locator('.intro-count');
  await expect(count).toHaveText('100', { timeout: 2000 });
});

test('hero entrances are offset to start under the curtain', async ({ page }) => {
  await page.goto('/');
  const first = await page.locator('h1 .rise > span').first().evaluate((e) => getComputedStyle(e).animationDelay);
  expect(first).toBe('1.38s');
});

test('other pages never show the loader', async ({ page }) => {
  await page.goto('/work/face-sort');
  await page.waitForTimeout(300);
  await expect(page.locator('.intro')).toHaveCount(0);
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });
  test('never shows the loader', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(300);
    await expect(page.locator('.intro')).toHaveCount(0);
  });
});

test.describe('JavaScript off', () => {
  test.use({ javaScriptEnabled: false });
  test('hero is readable and nothing covers it', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toContainText('Engineer');
    await expect(page.locator('.intro')).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.dataset.intro)).toBeUndefined();
  });
});
