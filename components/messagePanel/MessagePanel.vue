<template>
    <div class="message-panel flex flex-col">
        <Header />
        <MessageList :messages="messages" :currentUser="currentUser" />
        <MessageInput/>
    </div>
</template>

<script setup lang="ts">
import Header from "~/components/messagePanel/Header.vue";
import MessageList from "~/components/messagePanel/MessageList.vue";
import MessageInput from "~/components/messagePanel/MessageInput.vue";
import { useMessagesStore } from '~/stores/messagesStore';
import { useUserStore } from '~/stores/userStore';

const messagesStore = useMessagesStore();
const messages = computed(() => messagesStore.currentMessages);
const userStore = useUserStore();
const currentUser = computed(() => userStore.user ? { name: userStore.user.name } : { name: '' });
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