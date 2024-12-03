// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    compatibilityDate: '2024-04-03',
    devtools: {enabled: true},
    modules: ['@pinia/nuxt'],
    css: [
        'normalize.css',
        '@/assets/scss/main.scss'
    ],
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
                }
            }
        }
    },
    vue: {
        compilerOptions: {
            isCustomElement: (tag) => tag === 'emoji-picker'
        }
    },
    runtimeConfig: {
        public: {
            wsServerUrl: process.env.WS_SERVER_URL || 'ws://127.0.0.1:8090',
            baseApiUrl: process.env.BASE_API_URL || 'http://127.0.0.1:80',
            userToken: process.env.USER_TOKEN || '',
        },
    },
})