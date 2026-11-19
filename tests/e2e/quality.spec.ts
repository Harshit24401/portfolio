import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

const PAGES = ['/', '/work/eagleeye'];
const WIDTHS = [360, 768, 1280, 1440];

for (const path of PAGES) {
  for (const width of WIDTHS) {
    test(`${path} has no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await page.waitForTimeout(200);
      const over = await page.evaluate(() => {
        const vw = document.documentElement.clientWidth;
        // Name the culprits so a failure says where to look.
        const wide = [...document.querySelectorAll('body *')]
          .filter((e) => {
            if (e.closest('.marquee, [aria-hidden="true"]')) return false;
            const r = e.getBoundingClientRect();
            return r.width > 0 && r.right > vw + 1;
          })
          .slice(0, 5)
          .map((e) => `${e.tagName.toLowerCase()}.${String((e as HTMLElement).className).slice(0, 40)}`);
        return { scroll: document.documentElement.scrollWidth - vw, wide };
      });
      expect(over.wide).toEqual([]);
      expect(over.scroll).toBeLessThanOrEqual(0);
    });
  }

  test(`${path} has no serious or critical axe violations`, async ({ page }) => {
    await page.goto(path);
    // Let one-off entrance animations finish: mid-fade, text is semi-transparent
    // and axe would measure a contrast that no visitor actually sees.
    await page.evaluate(() =>
      Promise.all(
        document
          .getAnimations()
          .filter((a) => a.timeline === document.timeline && a.effect?.getTiming().iterations !== Infinity)
          .map((a) => a.finished.catch(() => {})),
      ),
    );
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    const bad = violations
      .filter((v) => v.impact === 'serious' || v.impact === 'critical')
      .map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(' ')).slice(0, 3).join(' | ')}`);
    expect(bad).toEqual([]);
  });
}

test('keyboard order from the top: nav, résumé, email, then the first filter', async ({ page }) => {
  await page.goto('/');
  const seen: string[] = [];
  for (let i = 0; i < 10; i++) {
    await page.keyboard.press('Tab');
    seen.push(
      await page.evaluate(() => {
        const a = document.activeElement as HTMLElement;
        return (a.getAttribute('aria-label') ?? a.textContent ?? '').replace(/\s+/g, ' ').trim();
      }),
    );
  }
  expect(seen.slice(0, 7)).toEqual([
    'Harshit Arora',
    'Experience',
    'Work',
    'Résumé',
    'Contact',
    'Download résumé',
    'Email me',
  ]);
  // After the hero, the next stop is in Selected work: the first filter or the EagleEye case study link.
  expect(seen.slice(7)).toContainEqual(expect.stringMatching(/^(All|Read the case study)$/));
});

test('focus is always visible', async ({ page }) => {
  await page.goto('/');
  await page.keyboard.press('Tab');
  const outline = await page.evaluate(() => getComputedStyle(document.activeElement!).outlineStyle);
  expect(outline).toBe('solid');
});

test('track filter fits a 360px phone with gutters', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  for (const g of await page.getByRole('group').all()) {
    const b = (await g.boundingBox())!;
    expect(b.width).toBeLessThanOrEqual(360 - 32);
    expect(b.x).toBeGreaterThanOrEqual(15);
  }
});

test('every tap target on a phone is at least 44px tall', async ({ page }) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto('/');
  const small = await page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('main a, main button, header a, footer a, footer button')]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height < 44 && !e.closest('ol, .prose');
      })
      .map((e) => (e.textContent ?? '').trim().slice(0, 30)),
  );
  expect(small).toEqual([]);
});
