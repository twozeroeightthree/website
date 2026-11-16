import { readdirSync } from "node:fs";
import type { Page } from "@playwright/test";

/** Slugs of every work, from the content folders */
export const slugs = readdirSync(new URL("../src/content/works/", import.meta.url), {
  withFileTypes: true,
})
  .filter((d) => d.isDirectory())
  .map((d) => d.name);

export const desktop = { width: 1440, height: 900 };
export const mobile = { width: 390, height: 844 };

/** Loads every image, lazy ones included, and waits for the fonts */
export async function settle(page: Page) {
  await page.evaluate(async () => {
    const imgs = [...document.images];
    imgs.forEach((img) => (img.loading = "eager"));
    await Promise.all(imgs.map((img) => img.decode().catch(() => {})));
    await document.fonts.ready;
  });
}
