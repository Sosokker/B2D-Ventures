// import { expect, test } from "@playwright/test";
// import { loginUtils } from "./helpers/loginUtils";
// import mockData from "./assets/mockData.json";
// import { searchBusiness } from "./helpers/searchUtils";

// test("test", async ({ page }) => {
//   await loginUtils(page, "admin");
//   await page.getByRole("button", { name: "profile" }).click();
//   await page.getByRole("link", { name: "Admin" }).click();
//   await page.locator("html").click();
//   await page.getByRole("button", { name: "Go to Business Application" }).click();

//   // if test 01 click no 'yes' use .first, or 'yes' n time use nth(n)
//   console.log('approving');
//   await page
//     .getByRole("row", { name: mockData.company.name + " " + mockData.company.url })
//     .getByRole("img")
//     .nth(3)
//     .click();
//   const approveButton = page.getByRole("button", { name: "Approve" });
//   await expect(approveButton).toBeVisible();
//   await approveButton.click();

//   await searchBusiness(page, mockData.company.name);
// });
