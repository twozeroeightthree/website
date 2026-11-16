import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { desktop, mobile, slugs } from "./site";

const pages = ["/", ...slugs.map((s) => `/${s}/`), "/no-such-page/"];

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa", "best-practice"])
    // Accepted to keep the look of the old site: light grey text (2.3-3.6:1)
    // and the small links of the works menu (15px tall)
    .disableRules(["color-contrast", "target-size"])
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => ({ rule: v.id, help: v.help, nodes: v.nodes.map((n) => n.target.join(" ")) }));
}

for (const [name, viewport] of Object.entries({ desktop, mobile })) {
  test.describe(name, () => {
    test.use({ viewport });

    for (const path of pages) {
      test(`axe: ${path}`, async ({ page }) => {
        await page.goto(path);
        expect(await seriousViolations(page)).toEqual([]);
      });
    }
  });
}

test("axe: home with the rail expanded", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Next works" }).click();
  await expect(page.locator(".layout")).toHaveAttribute("data-expanded");
  expect(await seriousViolations(page)).toEqual([]);
});

test("axe: open lightbox", async ({ page }) => {
  await page.goto("/tops/");
  await page.locator("[data-lightbox]").first().click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(await seriousViolations(page)).toEqual([]);
});
