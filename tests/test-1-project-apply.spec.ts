import { test, Locator, Page } from '@playwright/test';

// Helper function to handle dropdown selection with retry mechanism, automatically selecting the first option
const selectFirstOption = async (page: Page, triggerLocator: Locator) => {
  
    try {
      await triggerLocator.hover();
      await triggerLocator.click({ force: true });

      // Select the first available option
      const firstOption = page.getByRole("option").first();
      await firstOption.waitFor({ state: 'visible', timeout: 1000 });
      await firstOption.click();
      console.log("First option selected.");
       
    } catch (error) {
      console.log("Retrying as the combobox disappeared...");
      await page.waitForTimeout(100);
    }
  
};

test('test', async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/");
  await page.getByRole('button', { name: 'Projects' }).hover();
  await page.getByRole('link', { name: 'Projects Start your new' }).click();

  await page.locator('#projectName').fill('DummyTester');
  await page.locator('#projectName').fill('DummyTester');

  // Select first option in 'Select a Project type'
  const projectTypeButton = page.locator('button').filter({ hasText: 'Select a Project type' });
  await selectFirstOption(page, projectTypeButton);

  await page.locator('#shortDescription').fill('0123456789');
  await page.getByPlaceholder('https:// ').fill('https://www.google.com/');
  await page.getByPlaceholder('$   500').fill('499');
  await page.getByPlaceholder('$   1,000,000').fill('99999999');
  await page.locator('#deadline').fill('2024-11-29T21:19');

  // Log the text content of the second combobox
  const tag = page.getByRole('combobox').nth(1);
  const tagText = await tag.textContent();
  console.log('Tag text:', tagText);

  // Select first option in the tag combobox
  await selectFirstOption(page, tag);

  // Submit the form
  await page.getByRole('button', { name: 'Submit application' }).click();
});
