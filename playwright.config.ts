import { defineConfig } from "@playwright/test";
import pkg from "@playwright/test/package.json" with { type: "json" };

// The Nix dev shell provides the browsers; they only work with the same version
const nixVersion = process.env.PLAYWRIGHT_DRIVER_VERSION;
if (nixVersion && nixVersion !== pkg.version) {
  throw new Error(
    `@playwright/test ${pkg.version} does not match the browsers from Nix (${nixVersion}): ` +
      `set it to ${nixVersion} in package.json`,
  );
}

// BASE_URL tests a deployed site (the muelle preview in CI); without it,
// `astro preview` serves the last build in dist/
const baseURL = process.env.BASE_URL ?? "http://127.0.0.1:4321";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
  snapshotPathTemplate: "tests/screenshots/{arg}{ext}",
  expect: {
    // text antialiasing differs slightly between machines (about 1% of the
    // pixels on text-heavy pages); layout changes move far more than 2%
    toHaveScreenshot: { maxDiffPixelRatio: 0.02, animations: "disabled", caret: "hide" },
  },
  use: {
    baseURL,
    browserName: "chromium",
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
  },
  webServer: process.env.BASE_URL
    ? undefined
    : {
        // --ignore-lock: stay in the foreground even when run by an agent
        command: "npx astro preview --host 127.0.0.1 --port 4321 --ignore-lock",
        url: baseURL,
        reuseExistingServer: !process.env.CI,
      },
});
