import { expect, test } from "@playwright/test";
import { desktop, mobile, slugs } from "./site";

test("the home page links to every work", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/2083/);
  const cards = page.locator(".rail a");
  await expect(cards).toHaveCount(slugs.length);
  const hrefs = await cards.evaluateAll((as) => as.map((a) => a.getAttribute("href")));
  expect(hrefs.toSorted()).toEqual(slugs.map((s) => `/${s}/`).toSorted());
});

for (const slug of slugs) {
  test(`work page /${slug}/`, async ({ page }) => {
    const res = await page.goto(`/${slug}/`);
    expect(res?.status()).toBe(200);
    await expect(page.locator("title")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).not.toBeEmpty();
    await expect(page.locator(".gallery li").first()).toBeVisible();
    // the footer menu marks the current work and leads back home
    const nav = page.getByRole("navigation", { name: "Works" });
    await expect(nav.locator('[aria-current="page"]')).toHaveAttribute("href", `/${slug}/`);
    await page.getByRole("link", { name: "2083, home" }).click();
    await expect(page).toHaveURL("/");
  });
}

test("the footer menu is in reach on a short window", async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 480 });
  await page.goto("/tops/");
  const last = page.getByRole("navigation", { name: "Works" }).getByRole("link").last();
  await last.scrollIntoViewIfNeeded();
  await expect(last).toBeInViewport();
});

test.describe("mobile", () => {
  test.use({ viewport: mobile, hasTouch: true, isMobile: true });

  test("every work shows its title", async ({ page }) => {
    await page.goto("/");
    for (const caption of await page.locator(".rail .caption").all()) {
      await caption.scrollIntoViewIfNeeded();
      await expect(caption).toBeVisible();
      await expect(caption).not.toBeEmpty();
    }
  });
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false, viewport: desktop });

  test("the rail scrolls to every work and the page does not", async ({ page }) => {
    await page.goto("/");
    const rail = page.locator(".rail");
    const { scrolls, pageOverflow } = await rail.evaluate((el) => ({
      scrolls: el.scrollWidth > el.clientWidth && getComputedStyle(el).overflowX === "auto",
      pageOverflow: document.documentElement.scrollWidth > innerWidth,
    }));
    expect(scrolls).toBe(true);
    expect(pageOverflow).toBe(false);
    const last = page.locator(".rail a").last();
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeInViewport();
  });
});

test("unknown pages get the 404 page", async ({ page }) => {
  const res = await page.goto("/no-such-work/");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Page not found");
  await expect(page.locator(".index a")).toHaveCount(slugs.length);
});

test("/page2/ redirects home", async ({ page }) => {
  await page.goto("/page2/");
  await expect(page).toHaveURL("/");
});
