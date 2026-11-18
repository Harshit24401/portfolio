import { expect, test } from '@playwright/test';

test('home has title and dark ground', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Harshit Arora/);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(14, 14, 14)');
});
