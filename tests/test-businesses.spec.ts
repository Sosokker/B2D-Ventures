// import { test, expect } from "@playwright/test";
//
// test.use({
//   storageState: "./storageState.json",
// });
//
// test("Test search businesses", async ({ page }) => {
//   await page.goto("http://127.0.0.1:3000/");
//   await page.getByLabel("Main").getByRole("img").click();
//
//   const businessInput = page.getByPlaceholder("Enter business name...");
//   await expect(businessInput).toBeVisible();
//   await businessInput.fill("Project Blackwell");
//   await businessInput.press("Enter");
//
//   const heading = page.getByRole("heading", { name: "Project Blackwell" });
//   await expect(heading).toBeVisible();
//   await heading.click();
//
//   const fundSection = page.locator("div").filter({ hasText: /^Project Blackwell$/ });
//   await expect(fundSection).toBeVisible();
//   await fundSection.click();
// });
