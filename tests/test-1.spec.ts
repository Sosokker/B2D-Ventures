import { test, expect } from '@playwright/test';

test.use({
  storageState: './storageState.json'
});

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');
  await page.getByLabel('Main').getByRole('img').click();
  await page.getByPlaceholder('Enter business name...').click();
  await page.getByPlaceholder('Enter business name...').fill('neon');
  await page.getByPlaceholder('Enter business name...').press('Enter');
});