import { expect, test } from '@playwright/test';

const SECTIONS = ['Problem / context', 'What I built', 'How it works', 'Results or aim', "What I'd do next", 'Links'];

for (const [slug, title] of [
  ['eagleeye', 'EagleEye'],
  ['face-sort', 'face-sort'],
  ['peercall', 'PeerCall'],
]) {
  test(`/work/${slug} renders its case study skeleton`, async ({ page }) => {
    const res = await page.goto(`/work/${slug}`);
    expect(res?.status()).toBe(200);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(title);
    for (const s of SECTIONS) await expect(page.getByRole('heading', { level: 2, name: s })).toBeVisible();
  });
}

test('case study header: back link, track chips and only real links', async ({ page }) => {
  await page.goto('/work/peercall');
  await expect(page.getByRole('link', { name: /All work/ })).toHaveAttribute('href', '/#work');
  await expect(page.getByText('Full-stack', { exact: true }).first()).toBeVisible();
  const head = page.locator('article header');
  await expect(head.getByRole('link', { name: /Live demo/ })).toHaveAttribute(
    'href',
    'https://video-chat-ruddy-kappa.vercel.app',
  );
  await expect(head.getByRole('link', { name: /GitHub/ })).toHaveCount(0);
});

test('unknown case study is a styled 404', async ({ page }) => {
  const res = await page.goto('/work/nope');
  expect(res?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Nothing here');
  await expect(page.getByRole('link', { name: /Back to the home page/ })).toHaveAttribute('href', '/');
});

test('/writing lists every poem with an anchor', async ({ page }) => {
  await page.goto('/writing');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Writing');
  const poem = page.locator('article#first-poem');
  await expect(poem.getByRole('heading', { level: 2 })).toHaveText('[Poem title]');
});

test('home poem link leads to /writing', async ({ page }) => {
  await page.goto('/');
  await page.locator('#writing').getByRole('link', { name: /^Read / }).click();
  await expect(page).toHaveURL(/\/writing$/);
});

test('subpage nav jumps back to home sections', async ({ page }) => {
  await page.goto('/writing');
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Experience' })).toHaveAttribute(
    'href',
    '/#experience',
  );
});
