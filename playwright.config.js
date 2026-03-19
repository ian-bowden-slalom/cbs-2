// playwright.config.js

/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: './tests/e2e',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  reporter: 'list',
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 5000,
    baseURL: 'http://localhost:3000',
  },
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
};

module.exports = config;
