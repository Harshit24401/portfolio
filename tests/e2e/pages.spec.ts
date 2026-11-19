import { expect, test } from './fixtures';

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
  await expect(head.getByRole('link', { name: /Live demo/ })).toHaveCount(0);
  await expect(head.getByRole('link', { name: /GitHub/ })).toHaveAttribute('href', 'https://github.com/Harshit24401/video-chat');
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

test('subpage nav jumps back to home sections', async ({ page }) => {
  await page.goto('/work/face-sort');
  await expect(page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Experience' })).toHaveAttribute(
    'href',
    '/#experience',
  );
});

test('face-sort and PeerCall case studies are written (no bracketed prompts left)', async ({ page }) => {
  for (const slug of ['face-sort', 'peercall']) {
    await page.goto(`/work/${slug}`);
    const text = await page.locator('article .prose').innerText();
    expect(text, slug).not.toMatch(/\[[A-Z][^\]]*\]/);
    expect(text.length, slug).toBeGreaterThan(1200);
  }
});

test('each case study has a pipeline diagram and a GitHub link where public', async ({ page }) => {
  await page.goto('/work/face-sort');
  await expect(page.locator('.pipeline li').first()).toBeVisible();
  await expect(page.locator('article header').getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/Harshit24401/face-sort-fde',
  );
  await page.goto('/work/peercall');
  await expect(page.locator('article header').getByRole('link', { name: /GitHub/ })).toHaveAttribute(
    'href',
    'https://github.com/Harshit24401/video-chat',
  );
  await page.goto('/work/eagleeye');
  await expect(page.locator('.pipeline li')).not.toHaveCount(0);
  await expect(page.locator('article header').getByRole('link', { name: /GitHub/ })).toHaveCount(0);
});
