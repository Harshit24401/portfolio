import { expect, test } from './fixtures';

test('sitemap lists home, writing and every case study', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text();
  for (const path of ['/', '/writing', '/work/eagleeye', '/work/face-sort', '/work/peercall']) {
    expect(xml).toContain(`<loc>http://localhost:3000${path === '/' ? '' : path}</loc>`);
  }
});

test('robots allows everything and points at the sitemap', async ({ request }) => {
  const txt = await (await request.get('/robots.txt')).text();
  expect(txt).toMatch(/Allow: \//);
  expect(txt).toContain('Sitemap: http://localhost:3000/sitemap.xml');
});

test('home has an og:image that serves a PNG', async ({ page, request }) => {
  await page.goto('/');
  const og = await page.locator('meta[property="og:image"]').first().getAttribute('content');
  expect(og).toBeTruthy();
  const res = await request.get(new URL(og!).pathname + new URL(og!).search);
  expect(res.status()).toBe(200);
  expect(res.headers()['content-type']).toContain('image/png');
});

test('case study has its own og:image', async ({ page }) => {
  await page.goto('/work/face-sort');
  const og = await page.locator('meta[property="og:image"]').first().getAttribute('content');
  expect(og).toContain('/work/face-sort/opengraph-image');
});

test('home JSON-LD describes a Person with GitHub and LinkedIn', async ({ page }) => {
  await page.goto('/');
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(raw!);
  expect(data['@type']).toBe('Person');
  expect(data.name).toBe('Harshit Arora');
  expect(data.sameAs).toEqual(
    expect.arrayContaining(['https://github.com/Harshit24401', 'https://www.linkedin.com/in/harshit-arora-here']),
  );
});

test('each case study has a title naming the project', async ({ page }) => {
  for (const [slug, title] of [
    ['eagleeye', 'EagleEye'],
    ['peercall', 'PeerCall'],
  ]) {
    await page.goto(`/work/${slug}`);
    await expect(page).toHaveTitle(new RegExp(`^${title} — Harshit Arora`));
  }
});

test('pages declare a canonical URL', async ({ page }) => {
  await page.goto('/writing');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://localhost:3000/writing');
});
