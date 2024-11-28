import { test, expect } from "@playwright/test";

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_EMAIL!;
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD!;

test("Test admin page funtionality", async ({ page }) => {
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    throw new Error("NEXT_PUBLIC_TEST_USER_EMAIL and NEXT_PUBLIC_TEST_USER_PASSWORD must be set");
  }

  await page.goto("http://localhost:3000/");
  await page.getByRole("button", { name: "profile" }).click();
  await page.getByRole("button", { name: "Logout" }).click();
  await page.getByRole("button", { name: "Login" }).click();
  await page.reload();

  const emailInput = page.locator('input[id="email"]');
  const passwordInput = page.locator('input[id="password"]');
  const loginButton = page.locator('button[id="login"]');

  await emailInput.fill(ADMIN_USERNAME);
  await passwordInput.fill(ADMIN_PASSWORD);
  await loginButton.click();

  await expect(page.getByRole("button", { name: "profile" })).toBeVisible();
  await page.getByRole("button", { name: "profile" }).click();
  await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
  await page.getByRole("link", { name: "Admin" }).click();
  await page.locator("html").click();
  await page.getByRole("button", { name: "Go to Business Application" }).click();

  await expect(page.getByText("Admin Page")).toBeVisible();
  await expect(page.getByRole("cell", { name: "Hello Company" })).toBeVisible();
});
