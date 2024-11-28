import { test } from "@playwright/test";

const AUTH_USER_FILE = "./storageState.json";
const USER_EMAIL = process.env.NEXT_PUBLIC_TEST_USER_EMAIL!;
const USER_PASSWORD = process.env.NEXT_PUBLIC_TEST_USER_PASSWORD!;

test("Setup: Authenticate via login page and store session", async ({ page }) => {
  if (!USER_EMAIL || !USER_PASSWORD) {
    throw new Error("NEXT_PUBLIC_TEST_USER_EMAIL and NEXT_PUBLIC_TEST_USER_PASSWORD must be set");
  }

  await page.goto("http://localhost:3000/auth");
  // fill input with id = email
  await page.fill('input[id="email"]', USER_EMAIL);
  await page.fill('input[id="password"]', USER_PASSWORD);
  await page.click('button[id="login"]');

  await page.waitForURL("http://localhost:3000/");
  console.log("Login successful!");

  await page.context().storageState({ path: AUTH_USER_FILE });

  console.log("Storage state saved to:", AUTH_USER_FILE);
});
