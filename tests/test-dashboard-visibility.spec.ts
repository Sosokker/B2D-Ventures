import { test, expect } from '@playwright/test';
test.use({
  storageState: './storageState.json'
});

test('Test dashboard visibility', async ({ page }) => {
  await page.goto('http://127.0.0.1:3000/dashboard');

  const dashboardHeading = page.locator('h2', { hasText: 'Dashboard' });
  await expect(dashboardHeading).toBeVisible();

  const profileViewHeading = page.locator('h3', { hasText: 'Profile Views' });
  await expect(profileViewHeading).toBeVisible();

  const totalFollowerHeading = page.locator('h3', { hasText: 'Total Followers' });
  await expect(totalFollowerHeading).toBeVisible();

  const fundsRaisedHeading = page.locator('h3', { hasText: 'Total Funds Raised' });
  await expect(fundsRaisedHeading).toBeVisible();

  const overviewHeading = page.locator('h3', { hasText: 'Overview' });
  await expect(overviewHeading).toBeVisible();

  const recentFundHeading = page.locator('h3', { hasText: 'Recent Funds' });
  await expect(recentFundHeading).toBeVisible();
});
