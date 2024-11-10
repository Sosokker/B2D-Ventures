import { Page, Locator } from '@playwright/test';

export const selectFirstOption = async (page: Page, triggerLocator: Locator) => {
    let selected = false
    while (!selected) {
        try {
            await triggerLocator.click({ force: true });

            // Select the first available option
            const firstOption = page.getByRole("option").first();
            await firstOption.waitFor({ state: 'visible', timeout: 1000 });

            // Retrieve and log the text content of the first option
            const optionText = await firstOption.textContent();
            console.log(`${optionText}`);
            await firstOption.click();
            selected = true
        } catch (error) {
            console.log("Retrying as the combobox disappeared.");
            await page.waitForTimeout(100);
        }
    }
};
