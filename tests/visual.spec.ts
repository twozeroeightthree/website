import { expect, test } from "@playwright/test";
import { settle } from "./site";

// Regenerate after an intended change: npx playwright test visual --update-snapshots
const widths = [390, 900, 1440];
const paths = { home: "/", tops: "/tops/" };

test.use({ reducedMotion: "reduce" });

for (const width of widths) {
  for (const [name, path] of Object.entries(paths)) {
    test(`${name} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(path);
      await settle(page);
      await expect(page).toHaveScreenshot(`${name}-${width}.png`, {
        fullPage: true,
        // the long mobile pages take a while to stabilise
        timeout: 20_000,
        // the year changes with each build
        mask: [page.locator(".copyright")],
      });
    });
  }
}
