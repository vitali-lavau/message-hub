// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2026-07-24',
    devtools: { enabled: false },
    modules: ['@pinia/nuxt', '@nuxt/eslint'],
    typescript: {
        strict: true,
        typeCheck: false,
    },
    css: ['normalize.css', '@/assets/css/tailwind.css', '@/assets/scss/main.scss'],
    postcss: {
        plugins: {
            tailwindcss: {},
            autoprefixer: {},
        },
    },
    vite: {
        css: {
            preprocessorOptions: {
                scss: {
                    api: 'modern-compiler',
                },
            },
        },
    },
    vue: {
        compilerOptions: {
            isCustomElement: (tag) => tag === 'emoji-picker',
        },
    },
});
