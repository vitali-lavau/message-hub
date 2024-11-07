<template>
    <div class="message-panel flex flex-col">
        <Header :title="chatStore.activeUser?.name || 'No User Selected'" />
        <MessageList :messages="chatStore.activeMessages" />
        <MessageInput/>
    </div>
</template>

<script setup lang="ts">
import { watchEffect } from 'vue';
import { useNuxtApp } from '#app';
import Header from "~/components/messagePanel/Header.vue";
import MessageList from "~/components/messagePanel/MessageList.vue";
import MessageInput from "~/components/messagePanel/MessageInput.vue";
import { useChatStore } from '~/stores/chatStore';

const chatStore = useChatStore();
const { isClient } = useNuxtApp();

watchEffect(() => {
    if (isClient && chatStore.activeUser) {
        console.log("Активный пользователь изменен на:", chatStore.activeUser.name);
    }
});
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.message-panel {
    height: 100%;
    background-color: $color-white;
    box-shadow: $box-shadow;
    border-radius: $border-radius;
}
</style>