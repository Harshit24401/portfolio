import { defineConfig, devices } from '@playwright/test';

// Playwright drives the installed Google Chrome (channel: 'chrome') against the dev server,
// so no separate browser download is needed.
// `webServer` starts `npm run dev` for the run (or reuses one already on :3000).
export default defineConfig({
  testDir: 'tests/e2e',
  use: { baseURL: 'http://localhost:3100' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], channel: 'chrome' } }],
  webServer: {
    // Own port and build folder, so tests never collide with a `npm run dev`
    // you have open on :3000.
    command: 'npx next dev -p 3100',
    env: { NEXT_DIST_DIR: '.next-test' },
    url: 'http://localhost:3100',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
