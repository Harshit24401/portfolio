import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

// Unit and component tests run in jsdom (a fake browser DOM in Node).
// End-to-end tests live in tests/e2e and are run by Playwright instead.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./', import.meta.url)),
      // `server-only` throws when imported outside a React Server Component build.
      // Tests run loaders directly in Node, so swap it for an empty module here.
      'server-only': fileURLToPath(new URL('./tests/empty.ts', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['tests/unit/**/*.test.{ts,tsx}'],
    setupFiles: ['tests/setup.ts'],
  },
});
