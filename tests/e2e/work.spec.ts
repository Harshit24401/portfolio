import { expect, test } from '@playwright/test';

const card = (page: import('@playwright/test').Page, name: string) =>
  page.locator('[data-card]').filter({ has: page.getByRole('heading', { name, exact: true }) });

test('Full-stack filter dims EagleEye only', async ({ page }) => {
  await page.goto('/?track=fs');
  await expect(card(page, 'EagleEye')).toHaveClass(/is-dim/);
  await expect(card(page, 'face-sort')).not.toHaveClass(/is-dim/);
  await expect(card(page, 'PeerCall')).not.toHaveClass(/is-dim/);
});

test('EagleEye has no public links and shows its private note', async ({ page }) => {
  await page.goto('/');
  const e = card(page, 'EagleEye');
  await expect(e.getByRole('link', { name: /GitHub|Live demo/ })).toHaveCount(0);
  await expect(e.getByText('Internal to Optum, so the code is private.')).toBeVisible();
  await expect(e.getByRole('link', { name: /case study/i })).toHaveAttribute('href', '/work/eagleeye');
});

test('a project with no live URL renders no Live demo link', async ({ page }) => {
  await page.goto('/');
  await expect(card(page, 'face-sort').getByRole('link', { name: /Live demo/ })).toHaveCount(0);
  await expect(card(page, 'PeerCall').getByRole('link', { name: /Live demo/ })).toHaveAttribute(
    'href',
    'https://video-chat-ruddy-kappa.vercel.app',
  );
});

test('"Everything else is on GitHub" goes to the profile', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Everything else is on GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/Harshit24401',
  );
});

test('job-hunt card: one current step, no GitHub link yet', async ({ page }) => {
  await page.goto('/');
  const job = card(page, 'Job-hunt autopilot');
  await expect(job.locator('li[data-state="now"]')).toHaveText('Read replies');
  await expect(job.getByRole('link')).toHaveCount(0);
});

test('Recognition: one lead award and five tiles', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#recognition .award-lead')).toHaveCount(1);
  await expect(page.locator('#recognition .award')).toHaveCount(5);
});

for (const width of [360, 768, 1280, 1440]) {
  test(`no horizontal overflow in award tiles or page at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const tiles = await page
      .locator('#recognition .award, #recognition .award-lead')
      .evaluateAll((els) => els.map((e) => e.scrollWidth <= e.clientWidth));
    expect(tiles.every(Boolean)).toBe(true);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });
}
