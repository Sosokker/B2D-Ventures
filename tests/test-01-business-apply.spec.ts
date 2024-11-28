// import { expect, test } from "@playwright/test";
// import { selectFirstOption } from "./helpers/dropdownUtils";
// import mockData from "./assets/mockData.json";
// import { searchBusiness } from "./helpers/searchUtils";
// import fs from "fs";

// const AUTH_USER_FILE = "./storageState.json";
// const SUPABASE_APP_ID = process.env.PROJECT_ID!;

// test("Submit a business application and search for it", async ({ page, context }) => {
//   const session = JSON.parse(fs.readFileSync(AUTH_USER_FILE, "utf-8"));

//   await context.addInitScript(
//     (data) => {
//       localStorage.setItem(`sb-${data.appId}-auth-token`, JSON.stringify(data.session));
//     },
//     { session, appId: SUPABASE_APP_ID }
//   );

//   await page.goto("http://localhost:3000/");

//   await page.getByRole("button", { name: "Businesses" }).hover();
//   await page.getByRole("link", { name: "Business Apply to raise on on" }).click();

//   await selectFirstOption(page, page.locator("button").filter({ hasText: "Select an industry" }));
//   await selectFirstOption(page, page.locator("button").filter({ hasText: "Select a country" }));
//   await page.getByPlaceholder("$").fill(mockData.company.raised);
//   await page.getByRole("button", { name: "Yes" }).first().click();
//   await page.getByRole("button", { name: "Yes" }).nth(1).click();
//   await page.getByRole("button", { name: "Yes" }).nth(2).click();
//   await page.getByPlaceholder("https:// ").fill(mockData.company.url);
//   await selectFirstOption(page, page.locator("button").filter({ hasText: "Select" }));
//   await page.locator("#companyName").fill(mockData.company.name);
//   await page.getByRole("button", { name: "Submit application" }).click();

//   const okButton = page.getByRole("button", { name: "OK" });
//   await expect(okButton).toBeVisible();
//   await okButton.click();

//   await searchBusiness(page, mockData.company.name);
// });

import { expect, test } from "@playwright/test";
import fs from "fs";

const AUTH_USER_FILE = "./storageState.json";
const SUPABASE_APP_ID = process.env.PROJECT_ID!;

test("Check visibility of elements on the business application page", async ({ page, context }) => {
  const session = JSON.parse(fs.readFileSync(AUTH_USER_FILE, "utf-8"));

  await context.addInitScript(
    (data) => {
      localStorage.setItem(`sb-${data.appId}-auth-token`, JSON.stringify(data.session));
    },
    { session, appId: SUPABASE_APP_ID }
  );

  await page.goto("http://localhost:3000/business/apply");

  await expect(page.locator('button:has-text("Select an industry")')).toBeVisible();
  await page.locator("#companyName").click();

  await expect(page.locator('button:has-text("Select a country")')).toBeVisible();
  await expect(page.getByPlaceholder("$")).toBeVisible();
  await expect(page.getByRole("button", { name: "Yes" }).first()).toBeVisible();
  await expect(page.getByPlaceholder("https:// ")).toBeVisible();
  await expect(page.locator("#companyName")).toBeVisible();
  await expect(page.getByRole("button", { name: "Submit application" })).toBeVisible();

  await page.locator("#companyName").fill("Hello Company");
  await page.locator("button").filter({ hasText: "Select a country" }).click();
  await page.getByLabel("Afghanistan").getByText("Afghanistan").click();
  await page.locator("button").filter({ hasText: "Select an industry" }).click();
  await page.getByLabel("LLC").getByText("LLC").click();
  await page.getByPlaceholder("$").click();
  await page.getByPlaceholder("$").fill("1000000");
  await page.getByRole("button", { name: "Yes" }).first().click();
  await page.getByRole("button", { name: "Yes" }).nth(1).click();
  await page.getByRole("button", { name: "Yes" }).nth(2).click();
  await page.getByPlaceholder("https:// ").click();
  await page.getByPlaceholder("https:// ").fill("https://example.com.md");
  await page.locator("button").filter({ hasText: "Select" }).click();
  await page.getByLabel("N/A").click();

  await page.getByRole("button", { name: "Submit application" }).click();

  const successLabel = page.getByLabel("success");
  await expect(successLabel).toBeVisible();
  await successLabel.click();
});
