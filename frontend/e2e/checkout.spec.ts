import { test, expect } from "@playwright/test";

const email = `e2e_${Date.now()}@test.com`;
const password = "Password1";

test("happy path: register, browse, add to cart, checkout, view order history", async ({ page }) => {
  await page.goto("/register");

  await expect(page.getByRole("heading", { name: /register/i })).toBeVisible();
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/password/i).fill(password);
  await page.getByRole("button", { name: /register/i }).click();

  await expect(page.getByRole("heading", { name: /products/i })).toBeVisible();

  const firstProductLink = page.locator('a[href^="/products/"]').first();
  await expect(firstProductLink).toBeVisible();
  await firstProductLink.click();

const addToCartButton = page.getByRole("button", { name: /add .* to cart/i }).first();
await expect(addToCartButton).toBeVisible();
await addToCartButton.click();

  await page.getByRole("link", { name: /cart/i }).click();
  await expect(page.getByRole("heading", { name: /your cart/i })).toBeVisible();

  await page.getByRole("link", { name: /proceed to checkout/i }).click();
  await expect(page.getByRole("heading", { name: /checkout/i })).toBeVisible();

  await page.getByLabel(/shipping address/i).fill("123 Buckeye Lane, Columbus, OH");
  await page.getByRole("button", { name: /place order/i }).click();

  await expect(page.getByText(/your order was placed successfully/i)).toBeVisible();
  await expect(page.getByText(/pending/i)).toBeVisible();

  const confirmationText = await page.locator("body").textContent();
  expect(confirmationText).toMatch(/ORD-/i);

  await page.getByRole("link", { name: /my orders/i }).click();
  await expect(page.getByRole("heading", { name: /my orders/i })).toBeVisible();
  await expect(page.getByText(/123 Buckeye Lane, Columbus, OH/i)).toBeVisible();
});