import { test, expect } from '@playwright/test';

test.use({
  storageState: './storageState.json'
});

test('Test filter with tags', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/');
  await page.getByRole('button', { name: 'Start Investing' }).click();

  await page.locator('button').filter({ hasText: 'Tags' }).click();
  await page.getByLabel('AI', { exact: true }).click();
  await page.locator('span#tag', { hasText: 'AI' });

  await page.locator('button').filter({ hasText: 'AI' }).click();
  await page.getByLabel('Technology').click();
  await page.locator('span#tag', { hasText: 'Technology' });

  await page.locator('button').filter({ hasText: 'Technology' }).click();
  await page.getByText('Consumer Electronics').click();
  await page.locator('span#tag', { hasText: 'Consumer Electronics' });

  await page.locator('button').filter({ hasText: 'Consumer Electronics' }).click();
  await page.getByLabel('Software').click();
  await page.locator('span#tag', { hasText: 'Software' });

  await page.locator('button').filter({ hasText: 'Software' }).click();
  await page.getByLabel('Internet').click();
  await page.locator('span#tag', { hasText: 'Internet' });
});