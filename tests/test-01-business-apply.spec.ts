import { test } from "@playwright/test";
import { login } from "./helpers/login";
import { selectFirstOption } from "./helpers/dropdownUtils";

test("test", async ({ page }) => {
  await login(page, "user");
  await page.getByRole('button', { name: 'Businesses' }).hover();
  await page.getByRole("link", { name: "Business Apply to raise on on" }).click();

  await selectFirstOption(page, page.locator("button").filter({ hasText: "Select an industry" }));
  await selectFirstOption(page, page.locator("button").filter({ hasText: "Select a country" }));
  await page.getByPlaceholder("$").fill("999998");
  await page.getByRole("button", { name: "Yes" }).first().click();
  await page.getByRole("button", { name: "Yes" }).nth(1).click();
  await page.getByRole("button", { name: "Yes" }).nth(2).click();
  await page.getByPlaceholder('https:// ').fill('https://www.test.md');
  await selectFirstOption(page, page.locator("button").filter({ hasText: "Select" }));
  await page.locator("#companyName").fill("kasetsart");
  await page.getByRole('button', { name: 'Submit application' }).click();
});
