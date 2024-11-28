import { expect, test } from "@playwright/test";
import { loginUtils } from "./helpers/loginUtils";
import { selectFirstOption } from "./helpers/dropdownUtils";
import mockData from "./assets/mockData.json";
import { searchBusiness } from "./helpers/searchUtils";

test("test", async ({ page }) => {
  await loginUtils(page, "user");
  await page.getByRole("button", { name: "Businesses" }).hover();
  await page.getByRole("link", { name: "Business Apply to raise on on" }).click();

  await selectFirstOption(page, page.locator("button").filter({ hasText: "Select an industry" }));
  await selectFirstOption(page, page.locator("button").filter({ hasText: "Select a country" }));
  await page.getByPlaceholder("$").fill(mockData.company.raised);
  await page.getByRole("button", { name: "Yes" }).first().click();
  await page.getByRole("button", { name: "Yes" }).nth(1).click();
  await page.getByRole("button", { name: "Yes" }).nth(2).click();
  await page.getByPlaceholder("https:// ").fill(mockData.company.url);
  await selectFirstOption(page, page.locator("button").filter({ hasText: "Select" }));
  await page.locator("#companyName").fill(mockData.company.name);
  await page.getByRole("button", { name: "Submit application" }).click();
  const okButton = page.getByRole("button", { name: "OK" });
  await expect(okButton).toBeVisible();
  await okButton.click();

  await searchBusiness(page, mockData.company.name);
});
