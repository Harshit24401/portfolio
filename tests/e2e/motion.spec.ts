import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

const anim = (page: Page, sel: string) =>
  page.locator(sel).first().evaluate((e) => getComputedStyle(e).animationName);

test.describe('with motion', () => {
  test('hero lines rise, marquee scrolls, blocks reveal, progress bar grows', async ({ page }) => {
    await page.goto('/');
    expect(await anim(page, '.rise > span')).toBe('rise');
    expect(await anim(page, '.marquee-track')).toBe('marquee');
    expect(await anim(page, '.reveal')).toBe('revealup');
    expect(await anim(page, '.progress')).toBe('grow');
    expect(await anim(page, '.verdict-fill')).toBe('verdict');
  });

  test('hero line delays stack on the intro offset', async ({ page }) => {
    await page.goto('/');
    const delays = await page
      .locator('.rise > span')
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).animationDelay));
    expect(delays).toEqual(['0.08s', '0.17s', '0.26s', '0.35s']);
  });

  test('marquee pauses on hover', async ({ page }) => {
    await page.goto('/');
    await page.locator('.marquee').hover();
    expect(await page.locator('.marquee-track').evaluate((e) => getComputedStyle(e).animationPlayState)).toBe('paused');
  });
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('nothing animates and everything is fully visible', async ({ page }) => {
    await page.goto('/');
    for (const sel of ['.rise > span', '.marquee-track', '.reveal', '.focus-in', '.verdict-fill', '.rank', '.poemline']) {
      expect(await anim(page, sel), sel).toBe('none');
    }
    const opacities = await page
      .locator('.rise > span, .reveal, .focus-in, .poemline')
      .evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
    expect(opacities.every((o) => o === '1')).toBe(true);
    await expect(page.locator('.progress')).toBeHidden();
  });
});
