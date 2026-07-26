<template>
    <div class="app">
        <NuxtPage />
    </div>
</template>

<script setup lang="ts">
const requestUrl = useRequestURL();
const title = 'Message Hub — Frontend Messenger Demo';
const description =
    'A responsive corporate messenger portfolio demo built with Nuxt, Vue, TypeScript, Pinia, and a local mock API.';
const socialImageUrl = new URL('/og.png', requestUrl.origin).toString();

useSeoMeta({
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogType: 'website',
    ogImage: socialImageUrl,
    ogImageAlt: 'Message Hub frontend messenger demo',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: socialImageUrl,
});
</script>
