import { firefox, FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const email = process.env.NEXT_PUBLIC_DUMMY_EMAIL;
  const password = process.env.NEXT_PUBLIC_DUMMY_PASSWORD;
  const baseUrl = 'http://127.0.0.1:3000';

  if (!email || !password) {
    throw new Error('NEXT_PUBLIC_DUMMY_EMAIL and NEXT_PUBLIC_DUMMY_PASSWORD must be set');
  }

  const browser = await firefox.launch();
  const page = await browser.newPage();
  await page.goto(baseUrl + '/auth');
  await page.fill('id=email', email);
  await page.fill('id=password', password);
  await Promise.all([
    page.waitForURL(baseUrl),
    page.click('id=login')
  ]);
  await page.context().storageState({ path: 'storageState.json' });
  await browser.close();
}

export default globalSetup;