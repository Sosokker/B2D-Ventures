import { test, expect } from '@playwright/test';

test.use({
  storageState: './storageState.json'
});

test('test', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');
  await page.getByRole('button', { name: 'Start Investing' }).click();
  await page.getByRole('heading', { name: 'Investment Opportunities' }).click();
});