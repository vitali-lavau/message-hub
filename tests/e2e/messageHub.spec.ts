import { expect, test, type Page } from '@playwright/test';

const demoMessage = 'Playwright quality message';

async function openFreshDemo(page: Page) {
    await page.goto('/');
    await page.evaluate(() => {
        localStorage.clear();
        localStorage.setItem('message-hub-onboarding-completed-v1', 'true');
    });
    await page.reload();
    await expect(page.getByText('Demo ready', { exact: true })).toBeVisible();
}

async function sendMessage(page: Page, text: string) {
    const editor = page.getByRole('textbox', { name: 'Rich-Text Editor' });
    await editor.fill(text);
    await page.getByRole('button', { name: 'Send', exact: true }).click();
    await expect(
        page.getByLabel('Active conversation').getByText(text, { exact: true })
    ).toBeVisible();
}

test.beforeEach(async ({ page }) => {
    await openFreshDemo(page);
});

test('opens a direct conversation and sends a message', async ({ page }) => {
    await page.getByRole('button', { name: /James Anderson/ }).click();

    await expect(page.getByRole('heading', { level: 1, name: 'James Anderson' })).toBeVisible();
    await sendMessage(page, demoMessage);
});

test('creates a channel with selected members', async ({ page }) => {
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    const dialog = page.getByRole('dialog');
    await expect(dialog.getByRole('textbox', { name: 'Type name...' })).toBeVisible();
    await dialog.getByRole('textbox', { name: 'Type name...' }).fill('Quality Guild');
    await dialog.getByRole('button', { name: 'James Anderson', exact: true }).click();
    await dialog.getByRole('button', { name: 'Create', exact: true }).click();

    await expect(page.getByRole('heading', { level: 1, name: 'Quality Guild' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Quality Guild', exact: true })).toBeVisible();
});

test('switches the current mock user and filters unavailable conversations', async ({ page }) => {
    const userSwitcher = page.getByRole('combobox', { name: 'View demo as' });

    await userSwitcher.selectOption('user-olivia');

    await expect(userSwitcher).toHaveValue('user-olivia');
    await expect(page.getByRole('heading', { level: 1, name: 'Demo Bot' })).toBeVisible();
    await expect(page.getByRole('button', { name: /Frontend Team/ })).toHaveCount(0);
});

test('persists sent messages after reload', async ({ page }) => {
    await page.getByRole('button', { name: 'General', exact: true }).click();
    await sendMessage(page, demoMessage);
    await expect(page.getByText('Saved locally', { exact: true })).toBeVisible();

    await page.reload();

    await expect(page.getByRole('heading', { level: 1, name: 'General' })).toBeVisible();
    await expect(
        page.getByLabel('Active conversation').getByText(demoMessage, { exact: true })
    ).toBeVisible();
});

test('resets all modified demo data', async ({ page }) => {
    await page.getByRole('button', { name: 'General', exact: true }).click();
    await sendMessage(page, demoMessage);
    await expect(page.getByText('Saved locally', { exact: true })).toBeVisible();

    await page.getByRole('button', { name: 'Reset demo data', exact: true }).click();

    await expect(page.getByText('Demo data restored', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { level: 1, name: 'Demo Bot' })).toBeVisible();
    await expect(
        page.getByLabel('Active conversation').getByText(demoMessage, { exact: true })
    ).toHaveCount(0);
});

test('shows onboarding only on the first visit', async ({ page }) => {
    await page.evaluate(() => {
        localStorage.removeItem('message-hub-onboarding-completed-v1');
    });
    expect(
        await page.evaluate(() => localStorage.getItem('message-hub-onboarding-completed-v1'))
    ).toBeNull();
    await page.goto('/?onboarding=first-visit');
    expect(
        await page.evaluate(() => localStorage.getItem('message-hub-onboarding-completed-v1'))
    ).toBeNull();

    await expect(page.getByText('Welcome to Message Hub', { exact: true })).toBeVisible();
    await expect(page.getByText('Demo data is stored locally in your browser.')).toBeVisible();
    await page.getByRole('button', { name: 'Explore the demo', exact: true }).click();

    await page.reload();

    await expect(page.getByText('Welcome to Message Hub', { exact: true })).toHaveCount(0);
});

test('keeps the mobile chat and composer inside a 320px viewport', async ({ page }) => {
    await expect(page.getByRole('combobox', { name: 'View demo as' })).toContainText('Elena Novak');

    await page.setViewportSize({ width: 320, height: 700 });

    const metrics = await page.evaluate(() => {
        const composer = document.querySelector('.message-input__inner')?.getBoundingClientRect();
        const sendButton = document.querySelector('.message-input__send')?.getBoundingClientRect();

        return {
            viewportWidth: window.innerWidth,
            documentWidth: document.documentElement.scrollWidth,
            composerLeft: composer?.left ?? -1,
            composerRight: composer?.right ?? Number.POSITIVE_INFINITY,
            sendButtonRight: sendButton?.right ?? Number.POSITIVE_INFINITY,
        };
    });

    expect(metrics.documentWidth).toBe(metrics.viewportWidth);
    expect(metrics.composerLeft).toBeGreaterThanOrEqual(0);
    expect(metrics.composerRight).toBeLessThanOrEqual(metrics.viewportWidth);
    expect(metrics.sendButtonRight).toBeLessThanOrEqual(metrics.viewportWidth);
});
