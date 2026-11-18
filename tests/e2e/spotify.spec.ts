import { expect, test } from './fixtures';

test('/api/spotify always answers 200 with a valid payload and a CDN cache header', async ({ request }) => {
  const res = await request.get('/api/spotify');
  expect(res.status()).toBe(200);
  expect(res.headers()['cache-control']).toContain('s-maxage=60');
  const body = await res.json();
  expect(['playing', 'last', 'fallback']).toContain(body.mode);
});

test('home page survives with no Spotify credentials', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await page.locator('#writing').scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  expect(errors).toEqual([]);
  await expect(page.locator('#writing')).toContainText('Joint Secretary');
});
