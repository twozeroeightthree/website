import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/tops/");
});

test("opens, pages and closes with the keyboard", async ({ page }) => {
  const links = page.locator("[data-lightbox]");
  const n = await links.count();
  expect(n).toBeGreaterThan(1);
  const dialog = page.getByRole("dialog", { name: "Image viewer" });
  const count = dialog.locator(".count");

  await links.first().focus();
  await page.keyboard.press("Enter");
  await expect(dialog).toBeVisible();
  await expect(count).toHaveText(`1 / ${n}`);
  await expect(dialog.locator("img")).toHaveAttribute(
    "alt",
    (await links.first().getAttribute("data-alt"))!,
  );

  await page.keyboard.press("ArrowRight");
  await expect(count).toHaveText(`2 / ${n}`);
  await page.keyboard.press("ArrowLeft");
  await page.keyboard.press("ArrowLeft");
  await expect(count).toHaveText(`${n} / ${n}`);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  // focus goes back to the image shown last
  await expect(links.last()).toBeFocused();
});

test("buttons and backdrop work with the mouse", async ({ page }) => {
  const dialog = page.getByRole("dialog", { name: "Image viewer" });
  await page.locator("[data-lightbox]").nth(1).click();
  await expect(dialog.locator(".count")).toHaveText(/^2 \//);
  await dialog.getByRole("button", { name: "Next image" }).click();
  await expect(dialog.locator(".count")).toHaveText(/^3 \//);
  await dialog.getByRole("button", { name: "Close" }).click();
  await expect(dialog).toBeHidden();

  await page.locator("[data-lightbox]").first().click();
  await page.mouse.click(5, 5);
  await expect(dialog).toBeHidden();
});

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  test("images link to the large JPEG", async ({ page }) => {
    const href = await page.locator("[data-lightbox]").first().getAttribute("href");
    expect(href).toMatch(/\.jpg$/);
    const res = await page.request.get(href!);
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"]).toBe("image/jpeg");
  });
});
