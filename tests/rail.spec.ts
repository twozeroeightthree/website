import { expect, test, type Page } from "@playwright/test";
import { desktop } from "./site";

test.use({ viewport: desktop, reducedMotion: "reduce" });

const scrollLeft = (page: Page) => page.locator(".rail").evaluate((el) => el.scrollLeft);

test.beforeEach(async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".rail-controls")).toBeVisible();
});

test("works with the keyboard alone", async ({ page }) => {
  const layout = page.locator(".layout");
  const next = page.getByRole("button", { name: "Next works" });
  const prev = page.getByRole("button", { name: "Previous works" });
  const pages = page.getByRole("group", { name: "Pages" }).getByRole("button");

  // the arrow is reachable with Tab
  for (let i = 0; i < 20 && !(await next.evaluate((b) => b === document.activeElement)); i++) {
    await page.keyboard.press("Tab");
  }
  await expect(next).toBeFocused();

  // first press: the text makes room for the rail
  await page.keyboard.press("Enter");
  await expect(layout).toHaveAttribute("data-expanded");
  await expect(page).toHaveURL(/#works$/);
  await expect(page.getByRole("button", { name: "About" })).toBeVisible();
  expect(await scrollLeft(page)).toBe(0);

  // then it moves a page at a time
  await page.keyboard.press("Enter");
  await expect.poll(() => scrollLeft(page)).toBeGreaterThan(0);
  await expect(pages.nth(1)).toHaveAttribute("aria-current", "true");

  await prev.focus();
  await page.keyboard.press("Enter");
  await expect.poll(() => scrollLeft(page)).toBe(0);
  await expect(pages.nth(0)).toHaveAttribute("aria-current", "true");

  // back at the start, "previous" brings the text back
  await page.keyboard.press("Enter");
  await expect(layout).not.toHaveAttribute("data-expanded");
  await expect(page).toHaveURL(/\/$/);
});

test("page buttons jump to their page", async ({ page }) => {
  const pages = page.getByRole("group", { name: "Pages" }).getByRole("button");
  const last = pages.last();
  await last.focus();
  await page.keyboard.press("Enter");
  await expect(last).toHaveAttribute("aria-current", "true");
  await expect(page.locator(".rail a").last()).toBeInViewport();
});

test("arrow keys scroll the focused rail", async ({ page }) => {
  await page.locator(".rail").focus();
  await page.keyboard.press("ArrowRight");
  await expect.poll(() => scrollLeft(page)).toBeGreaterThan(0);
});

test("the mouse wheel scrolls the rail", async ({ page }) => {
  await page.locator(".rail a").first().hover();
  await page.mouse.wheel(600, 0);
  await expect.poll(() => scrollLeft(page)).toBeGreaterThan(0);
});

test("coming back from a work keeps the rail where it was", async ({ page }) => {
  await page.getByRole("group", { name: "Pages" }).getByRole("button").nth(1).click();
  await expect.poll(() => scrollLeft(page)).toBeGreaterThan(0);
  const x = await scrollLeft(page);
  // wait for the position to be saved on scrollend
  await expect.poll(() => page.evaluate(() => history.state?.rail?.x)).toBe(x);

  const card = page.locator(".rail a").nth(3);
  await expect(card).toBeInViewport();
  await card.click();
  await expect(page).not.toHaveURL(/#works$/);
  await page.goBack();

  await expect(page.locator(".layout")).toHaveAttribute("data-expanded");
  await expect.poll(() => scrollLeft(page)).toBe(x);
});
