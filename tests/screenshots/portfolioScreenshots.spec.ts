import { expect, test, type Page } from '@playwright/test';

async function prepareDemo(page: Page) {
    await page.addInitScript(() => {
        localStorage.setItem('message-hub-onboarding-completed-v1', 'true');
    });
    await page.goto('/');
    await expect(page.getByText('Demo ready', { exact: true })).toBeVisible();
    await page.getByRole('button', { name: /Frontend Team/ }).click();
    await expect(page.getByRole('heading', { level: 1, name: 'Frontend Team' })).toBeVisible();
    await expect(page.getByText('Saved locally', { exact: true })).toBeVisible();
    await expect(
        page.getByText(
            'I extracted the shared message types and removed the remaining local mutations.'
        )
    ).toBeAttached();
    await page.evaluate(async () => {
        await document.fonts.ready;
        await new Promise<void>((resolve) => {
            requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
        });
    });
    await page.waitForTimeout(400);
}

test('captures desktop and mobile portfolio screenshots', async ({ browser }) => {
    const desktopPage = await browser.newPage({
        viewport: { width: 1440, height: 900 },
        colorScheme: 'light',
    });
    await prepareDemo(desktopPage);
    await desktopPage.screenshot({
        path: 'docs/screenshots/message-hub-desktop.png',
        animations: 'disabled',
    });
    await desktopPage.close();

    const mobilePage = await browser.newPage({
        viewport: { width: 390, height: 844 },
        colorScheme: 'light',
    });
    await prepareDemo(mobilePage);
    await mobilePage.screenshot({
        path: 'docs/screenshots/message-hub-mobile.png',
        animations: 'disabled',
    });
    await mobilePage.close();
});
