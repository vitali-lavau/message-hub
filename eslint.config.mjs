import withNuxt from './.nuxt/eslint.config.mjs';
import prettier from 'eslint-config-prettier';

export default withNuxt(
    prettier,
    {
        ignores: [
            '.nuxt/**',
            '.output/**',
            '.vercel/**',
            'coverage/**',
            'dist/**',
            'node_modules/**',
            'playwright-report/**',
            'test-results/**',
        ],
    },
    {
        rules: {
            '@typescript-eslint/unified-signatures': 'off',
            'vue/multi-word-component-names': 'off',
        },
    }
);
