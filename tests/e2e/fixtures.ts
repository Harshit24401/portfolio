import { test as base } from '@playwright/test';

/**
 * Every spec except intro.spec.ts starts as a visitor who has already seen the
 * landing loader this session, so the hero is immediately interactive and its
 * delays aren't offset. intro.spec.ts imports @playwright/test directly.
 */
export const test = base.extend({
  page: async ({ page }, run) => {
    await page.addInitScript(() => sessionStorage.setItem('intro-seen', '1'));
    await run(page);
  },
});
export { expect } from '@playwright/test';
