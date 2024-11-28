// import { test, expect } from '@playwright/test';

// test.use({
//   storageState: './storageState.json'
// });

// test('Test filter with tags', async ({ page }) => {
//   await page.goto('http://127.0.0.1:3000/');

//   // Start Investing
//   await page.getByRole('button', { name: 'Start Investing' }).click();

//   // Filter by AI tag
//   await page.locator('button').filter({ hasText: 'Tags' }).click();
//   await page.getByLabel('AI', { exact: true }).click();
//   const aiTag = page.locator('span#tag', { hasText: 'AI' });
//   await expect(aiTag).toBeVisible();

//   // Filter by Technology tag
//   await page.locator('button').filter({ hasText: 'AI' }).click();
//   await page.getByLabel('Technology').click();
//   const techTag = page.locator('span#tag', { hasText: 'Technology' });
//   await expect(techTag).toBeVisible();

//   // Filter by Consumer Electronics tag
//   await page.locator('button').filter({ hasText: 'Technology' }).click();
//   await page.getByLabel('Consumer Electronics').click();
//   const consumerElectronicsTag = page.locator('span#tag', { hasText: 'Consumer Electronics' });
//   await expect(consumerElectronicsTag).toBeVisible();

//   // Filter by Software tag
//   await page.locator('button').filter({ hasText: 'Consumer Electronics' }).click();
//   await page.getByLabel('Software').click();
//   const softwareTag = page.locator('span#tag', { hasText: 'Software' });
//   await expect(softwareTag).toBeVisible();

//   // Filter by Internet tag
//   await page.locator('button').filter({ hasText: 'Software' }).click();
//   await page.getByLabel('Internet').click();
//   const internetTag = page.locator('span#tag', { hasText: 'Internet' });
//   await expect(internetTag).toBeVisible();
// });

import { test, expect } from "@playwright/test";

test.use({
  storageState: "./storageState.json",
});

test("Test filter with tags", async ({ page }) => {
  await page.goto("http://localhost:3000/");
  await page.getByRole("link", { name: "View all" }).click();
  await page.getByPlaceholder("Search projects").fill("Chat");
  await page.getByPlaceholder("Search projects").press("Enter");

  const chatGPTCard = page.getByRole("link", { name: "Card image ChatGPT ChatGPT is" });
  await expect(chatGPTCard).toBeVisible();

  await page.locator("button").filter({ hasText: "All Types" }).click();
  await page.getByLabel("All Types").getByText("All Types").click();

  await page.locator("button").filter({ hasText: "All Statuses" }).click();
  await page.getByLabel("All Statuses").getByText("All Statuses").click();

  await page.locator("button").filter({ hasText: "All Tags" }).click();
  await page.getByLabel("All Tags").getByText("All Tags").click();
  await page.getByPlaceholder("Search projects").click();
});
