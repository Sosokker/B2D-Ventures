// import { test, expect, Page } from '@playwright/test';
//
// test.use({
//   storageState: './storageState.json',
// });
//
// test('Investment process test', async ({ page }) => {
//   await page.goto('http://127.0.0.1:3000/');
//
//   // Navigate to the investment page
//   // await page.getByRole('link', { name: 'Card image NVDA Founded in' }).click();
//   await page.click('a[href="/invest"]');
//   await page.getByRole('button', { name: 'Invest in NVIDIA' }).click();
//
//   // Fill investment amount
//   await fillInvestmentAmount(page, '10000');
//
//   // Fill card information
//   await fillCardInformation(page, {
//     name: 'Dummy',
//     city: 'Bangkok',
//     cardNumber: '4111 1111 1111 1111',
//     expirationMonth: 'August',
//     expirationYear: '2032',
//     cvc: '111',
//   });
//
//   // Accept terms
//   await acceptTerms(page, [
//     'Minimum Investment',
//     'Investment Horizon',
//     'Fees',
//     'Returns',
//   ]);
//
//   // Click Invest button and confirm
//   await page.getByRole('button', { name: 'Invest' }).click();
//   await page.getByRole('button', { name: 'Confirm' }).click();
//
//   // Ensure error message is displayed when not all terms are accepted
//   await ensureErrorMessageDisplayed(page, 'Please accept all terms');
//
//   // Close the error dialog
//   await closeErrorDialog(page);
//
//   // Accept remaining terms
//   await acceptTerms(page, [
//     'Risk Disclosure',
//     'Withdrawal Policy',
//   ]);
//
//   // Click Invest button and confirm again
//   await page.getByRole('button', { name: 'Invest' }).click();
//   await page.getByRole('button', { name: 'Confirm' }).click();
//
//   // Ensure that success toast is displayed when investment is successful
//   await expect(
//     page.locator('div[role="status"][aria-live="polite"]').filter({ hasText: /^You successfully invested!$/ })
//   ).toBeVisible();
//
// // Helper functions
// async function fillInvestmentAmount(page: Page, amount: string): Promise<void> {
//   await page.getByPlaceholder('min $').click();
//   await page.getByPlaceholder('min $').fill(amount);
// }
//
// interface CardInfo {
//   name: string;
//   city: string;
//   cardNumber: string;
//   expirationMonth: string;
//   expirationYear: string;
//   cvc: string;
// }
//
// async function fillCardInformation(
//   page: Page,
//   { name, city, cardNumber, expirationMonth, expirationYear, cvc }: CardInfo
// ): Promise<void> {
//   await page.getByPlaceholder('First Last').click();
//   await page.getByPlaceholder('First Last').fill(name);
//   await page.getByLabel('City').click();
//   await page.getByLabel('City').fill(city);
//   await page.getByLabel('Card number').click();
//   await page.getByLabel('Card number').fill(cardNumber);
//   await page.getByLabel('Month').click();
//   await page.getByText(expirationMonth).click();
//   await page.getByLabel('Year').click();
//   await page.getByLabel(expirationYear).click();
//   await page.getByPlaceholder('CVC').click();
//   await page.getByPlaceholder('CVC').fill(cvc);
// }
//
// async function acceptTerms(page: Page, terms: string[]): Promise<void> {
//   for (const term of terms) {
//     await page.getByRole('row', { name: new RegExp(term) }).getByRole('checkbox').check();
//   }
// }
//
// async function ensureErrorMessageDisplayed(page: Page, message: string): Promise<void> {
//   await expect(page.getByText(message)).toBeVisible();
// }
//
// async function closeErrorDialog(page: Page): Promise<void> {
//   await page.getByRole('button', { name: 'Close' }).first().click();
// }
// });

import { test, expect } from "@playwright/test";

test.use({
  storageState: "./storageState.json",
});

test("Investment process test", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.getByRole("link", { name: "Card image Project Blackwell" }).click();
  await page.getByRole("link", { name: "Invest in Project Blackwell" }).click();

  await page.getByPlaceholder("min $").click();
  await page.getByPlaceholder("min $").fill("99");

  await page.getByRole("checkbox").first().check();
  await page
    .locator("div")
    .filter({ hasText: /^I have read and accept the terms of investment\.$/ })
    .getByRole("checkbox")
    .check();
  await page.getByRole("button", { name: "Proceed to Payment" }).click();

  const paymentInfo = page.getByLabel("Payment Information");
  await expect(paymentInfo).toBeVisible();

  const cardNumber = page.getByText("Card Number");
  await expect(cardNumber).toBeVisible();

  const expirationDate = page.getByText("Expiration Date");
  await expect(expirationDate).toBeVisible();

  const cvc = page.getByText("CVC");
  await expect(cvc).toBeVisible();

  const cancelButton = page.getByRole("button", { name: "Cancel" });
  await expect(cancelButton).toBeVisible();
});
