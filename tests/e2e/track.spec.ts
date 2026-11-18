import { expect, test } from './fixtures';

test('?track=foo renders All selected, no error, clean URL', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/?track=foo');
  const first = page.getByRole('group').first();
  await expect(first.getByRole('button', { name: 'All' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page).toHaveURL(/\/$/);
  expect(errors).toEqual([]);
});

test('one filter drives every filter and the URL', async ({ page }) => {
  await page.goto('/');
  const groups = page.getByRole('group');
  expect(await groups.count()).toBeGreaterThanOrEqual(2);
  await groups.nth(0).getByRole('button', { name: 'Full-stack' }).click();
  await expect(page).toHaveURL(/\?track=fs$/);
  await expect(groups.nth(1).getByRole('button', { name: 'Full-stack' })).toHaveAttribute('aria-pressed', 'true');
});

test('server HTML contains the page content (no client-only bailout)', async ({ request }) => {
  const html = await (await request.get('/?track=ml')).text();
  expect(html).toContain('Harshit Arora');
  expect(html).toContain('aria-pressed');
});
