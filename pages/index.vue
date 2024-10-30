<template>
    <Sidebar
        :activeChannelId="activeChannelId"
        :activeMessageId="activeMessageId"
        @setActiveChannel="setActiveChannel"
        @setActiveMessage="setActiveMessage"
    />
    <MessagePanel
        class="flex-1"
        :activeChannelId="activeChannelId"
        :activeMessageId="activeMessageId"
    />
</template>

<script setup lang="ts">
import MessagePanel from "~/components/messagePanel/MessagePanel.vue";

const activeChannelId = ref<number | null>(null);
const activeMessageId = ref<number | null>(null);

function setActiveChannel(id: number) {
    activeChannelId.value = id;
    activeMessageId.value = null;
}

function setActiveMessage(id: number) {
    activeMessageId.value = id;
    activeChannelId.value = null;
}
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.sidebar {
    margin: 0 $spacing-xl 0 0;
}
</style>