import { firefox, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const { baseURL, storageState } = config.projects[0].use;
  console.log('globalizing...');
  const email = process.env.NEXT_PUBLIC_TEST_USER_EMAIL;
  const password = process.env.NEXT_PUBLIC_TEST_USER_PASSWORD;

  if (!email || !password) {
    throw new Error('NEXT_PUBLIC_TEST_USER_EMAIL and NEXT_PUBLIC_TEST_USER_PASSWORD must be set');
  }

  const browser = await firefox.launch();
  const page = await browser.newPage();

  console.log('signing up user...'); 
  await page.goto(baseURL + '/auth/signup');
  await page.fill('id=email', email);
  await page.fill('id=password', password);
  await page.fill('id=confirmPassword', password);
  await page.click('id=signup')

  await page.context().storageState({ path: storageState as string });
  await browser.close();
}

export default globalSetup;