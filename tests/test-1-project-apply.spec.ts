import { test } from '@playwright/test';
import { selectFirstOption } from './helpers/dropdownUtils';
import path from 'path';

test('test', async ({ page }) => {
  await page.goto("http://127.0.0.1:3000/");
  await page.getByRole('button', { name: 'Projects' }).hover();
  await page.getByRole('link', { name: 'Projects Start your new' }).click();

  const projectName = page.locator('#projectName')
  await projectName.pressSequentially('DummyTester');
  await projectName.click();
  
  const img = path.join(__dirname, 'mockup', '1x1.png');
  await page.locator('#projectLogo').click();
  await page.locator('#projectLogo').setInputFiles(img);   
  await page.locator('#projectPhotos').click();
  await page.locator('#projectPhotos').setInputFiles(img);  

  const projectTypeButton = page.locator('button').filter({ hasText: 'Select a Project type' });
  await selectFirstOption(page, projectTypeButton);

  await page.locator('#shortDescription').fill('0123456789');
  await page.getByPlaceholder('https:// ').fill('https://www.test.md');
  await page.getByPlaceholder('$   500').fill('499');
  await page.getByPlaceholder('$   1,000,000').fill('99999999');
  await page.locator('#deadline').fill('2024-11-29T21:19');

  const tag = page.getByRole('combobox').nth(1);
  await selectFirstOption(page, tag);

  await projectName.pressSequentially('1234');

  await page.getByRole('button', { name: 'Submit application' }).click();
});
