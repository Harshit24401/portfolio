import { defineConfig, devices } from '@playwright/test';

// Playwright drives the installed Google Chrome (channel: 'chrome') against the dev server,
// so no separate browser download is needed.
// `webServer` starts `npm run dev` for the run (or reuses one already on :3000).
export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:3000' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
