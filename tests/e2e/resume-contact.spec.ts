import { expect, test } from '@playwright/test';

test('AI/ML track picks the AI/ML résumé for download and view', async ({ page }) => {
  await page.goto('/?track=ml');
  const resume = page.locator('#resume');
  const dl = resume.getByRole('link', { name: /Download/ });
  await expect(dl).toHaveAttribute('href', '/resume/ai-ml.pdf');
  await expect(dl).toContainText('AI/ML');
  const view = resume.getByRole('link', { name: /View in browser/ });
  await expect(view).toHaveAttribute('href', '/resume/ai-ml.pdf');
  await expect(view).toHaveAttribute('target', '_blank');
});

test('résumé PDFs are served', async ({ request }) => {
  for (const f of ['general', 'web-dev', 'ai-ml']) {
    const r = await request.get(`/resume/${f}.pdf`);
    expect(r.status()).toBe(200);
    expect(r.headers()['content-type']).toContain('pdf');
  }
});

test('Toolkit dims full-stack-only skills under AI/ML', async ({ page }) => {
  await page.goto('/?track=ml');
  const row = (name: string) =>
    page.locator('#skills .skill').filter({ has: page.locator('> span').getByText(name, { exact: true }) });
  await expect(row('Express')).toHaveClass(/is-off/);
  await expect(row('LangGraph')).not.toHaveClass(/is-off/);
  await expect(row('Docker')).not.toHaveClass(/is-off/); // core skill, never dimmed
});

test('three filters on the page stay in sync', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('group', { name: 'Filter skills by track' }).getByRole('button', { name: 'AI / ML' }).click();
  for (const name of ['Filter work by track', 'Filter skills by track', 'Résumé version']) {
    await expect(page.getByRole('group', { name }).getByRole('button', { name: 'AI / ML' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  }
});

test('contact email is a modest mailto link with a copy button', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('/');
  const mail = page.locator('#contact').getByRole('link', { name: /harshit24401@gmail\.com/ });
  await expect(mail).toHaveAttribute('href', 'mailto:harshit24401@gmail.com');
  const size = await mail.evaluate((e) => parseFloat(getComputedStyle(e).fontSize));
  expect(size).toBeLessThanOrEqual(23);
  await expect(page.locator('#contact').getByRole('button', { name: 'Copy address' })).toBeVisible();
});

test('Off the clock links to the full poems', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#writing').getByRole('link', { name: /^Read / })).toHaveAttribute('href', '/writing');
});
