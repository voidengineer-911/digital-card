import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  webServer: {
    command: 'npm run build && npm run start -- -p 3001',
    url: 'http://localhost:3001',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
  use: {
    baseURL: 'http://localhost:3001',
  },
});
