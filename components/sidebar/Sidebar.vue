<template>
    <aside class="sidebar flex flex-col">
        <UserSearch/>
        <ChannelsList
            class="section flex flex-col"
            :activeChannelId="activeChannelId"
            @setActiveChannel="setActiveChannel"
            :activeMessageId="activeMessageId"
        />
        <DirectMessages
            class="section flex flex-col"
            :activeMessageId="activeMessageId"
            @setActiveMessage="setActiveMessage"
            :activeChannelId="activeChannelId"
        />
    </aside>
</template>

<script setup lang="ts">
import UserSearch from "~/components/sidebar/UserSearch.vue";
import ChannelsList from "~/components/sidebar/ChannelsList.vue";
import DirectMessages from "~/components/sidebar/DirectMessages.vue";

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
    width: 340px;
    height: 100%;
    padding: $spacing-lg $spacing-xl;
    flex-shrink: 0;
    background-color: $color-white;
    box-shadow: $box-shadow;
    border-radius: $border-radius;

    .search,
    .channels {
        margin: 0 0 $spacing-xl;
    }

    .section {
        flex: 1 1 40%;
        overflow: hidden;
    }
}
</style>