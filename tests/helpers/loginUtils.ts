import { Page } from '@playwright/test';

export const loginUtils = async (page: Page, role: 'user' | 'admin') => {
    const email = role === 'user' ? process.env.NEXT_PUBLIC_TEST_USER_EMAIL : process.env.NEXT_PUBLIC_ADMIN_EMAIL;
    const password = role === 'user' ? process.env.NEXT_PUBLIC_TEST_USER_PASSWORD : process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

    if (!email || !password) {
        throw new Error(`${role === 'user' ? 'User' : 'Admin'} credentials must be set`);
    }

    await page.goto('/');
    const isLoginPage = await page.getByRole('button', { name: 'Login' }).isVisible();
    if (!isLoginPage) {
        console.log(`Logging out current session...`);
        await page.getByRole('button', { name: 'profile' }).click();
        await page.getByRole('menuitem', { name: 'Logout' }).click();
    }

    console.log(`Logging in as ${role}...`);
    await page.goto('/auth');
    await page.fill('id=email', email);
    await page.fill('id=password', password);
    await page.click('id=login');
};
