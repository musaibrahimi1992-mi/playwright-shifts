import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  retries: 0,
  workers: 1,
  reporter: 'html',
  timeout: 30000,
  use: {
  baseURL: 'https://werkstattplanung.net/demo/api/kic/da/index.html',
  headless: true,
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
},
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});