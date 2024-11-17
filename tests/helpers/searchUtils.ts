import { Page, expect } from "@playwright/test";

export const searchBusiness = async (page: Page, business: string) => {
  console.log("search for " + business);
  await page.locator("li").nth(3).click();
  await page.getByPlaceholder("Enter business name...").fill(business);
  await page.getByPlaceholder("Enter business name...").press("Enter");
  // await page.waitForURL("http://127.0.0.1:3000/find?query=" + business);
  await expect(page.getByRole("link", { name: "Business logo " + business })).toBeHidden();
  console.log("found" + business);
};
