import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests/screenshots',
    fullyParallel: false,
    reporter: 'list',
    use: {
        baseURL: 'http://127.0.0.1:3101',
        colorScheme: 'light',
    },
});
