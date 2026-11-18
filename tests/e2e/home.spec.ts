import { expect, test } from './fixtures';

test('home has title and dark ground', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Harshit Arora/);
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe('rgb(14, 14, 14)');
});

test('hero headline is Engineer Dreamer Reader', async ({ page }) => {
  await page.goto('/');
  const h1 = (await page.locator('h1').innerText()).replace(/\s+/g, ' ').trim();
  expect(h1).toBe('Engineer Dreamer Reader.');
});

test('hero has both calls to action and the availability line', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /Download résumé/ })).toHaveAttribute('href', '#resume');
  await expect(page.getByRole('link', { name: 'Email me' })).toHaveAttribute('href', '#contact');
  await expect(page.getByText('Open to 6-month internships, Jan–Jun 2027').first()).toBeVisible();
});

test('every nav link points at a section that exists', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: 'Primary' });
  const hrefs = await nav.getByRole('link').evaluateAll((as) => as.map((a) => a.getAttribute('href')));
  expect(hrefs).toEqual(['#experience', '#work', '#resume', '#contact']);
  for (const h of hrefs) await expect(page.locator(h!)).toHaveCount(1);
});

test('experience lists both internships with dates', async ({ page }) => {
  await page.goto('/');
  const exp = page.locator('#experience');
  await expect(exp.getByRole('heading', { name: 'Optum' })).toBeVisible();
  await expect(exp.getByText('Jun – Aug 2026')).toBeVisible();
  await expect(exp.getByRole('heading', { name: 'CoE-DSAI, Thapar' })).toBeVisible();
  await expect(exp.getByText('Jul – Nov 2025')).toBeVisible();
});

test('marquee has every item, and its loop copy is hidden from screen readers', async ({ page }) => {
  await page.goto('/');
  const copies = page.locator('[data-marquee-copy]');
  await expect(copies).toHaveCount(2);
  await expect(copies.nth(0)).not.toHaveAttribute('aria-hidden', 'true');
  await expect(copies.nth(1)).toHaveAttribute('aria-hidden', 'true');
  for (const item of [
    'Open to 6-month internships, Jan–Jun 2027',
    'Full-stack',
    'AI / ML',
    '1st in India & Ireland, Optum Shark Tank',
    'Computer Engineering, Thapar ’27',
    'LangGraph · FastAPI · WebRTC · ONNX',
    'Patiala, Punjab',
  ]) {
    await expect(copies.nth(0).getByText(item, { exact: true })).toHaveCount(1);
  }
});

test('glitchable headline words carry data-w', async ({ page }) => {
  await page.goto('/');
  const words = await page.locator('h1 [data-w]').evaluateAll((els) => els.map((e) => e.getAttribute('data-w')));
  expect(words).toEqual(['Engineer', 'Dreamer', 'Reader.']);
});
