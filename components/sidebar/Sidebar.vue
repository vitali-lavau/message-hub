<template>
    <aside class="sidebar flex flex-col">
        <UserSearch @updateSearch="updateSearchQuery" />
        <ChannelsList
            :searchQuery="searchQuery"
            :activeItem="activeItem"
            @setActiveItem="setActiveItem"
            class="section flex flex-col"
        />
        <DirectMessages
            :searchQuery="searchQuery"
            :activeItem="activeItem"
            @setActiveItem="setActiveItem"
            class="section flex flex-col"
        />
    </aside>
</template>

<script setup lang="ts">
import UserSearch from "~/components/sidebar/UserSearch.vue";
import ChannelsList from "~/components/sidebar/ChannelsList.vue";
import DirectMessages from "~/components/sidebar/DirectMessages.vue";
import { useMessagesStore } from '~/stores/messagesStore';

const searchQuery = ref('');
const activeItem = ref<{ type: 'channel' | 'directMessage'; id: string | number } | null>(null);
const messagesStore = useMessagesStore();

function updateSearchQuery(query: string) {
    searchQuery.value = query;
}

async function setActiveItem(type: 'channel' | 'directMessage', id: string | number) {
    activeItem.value = { type, id };
    if (type === 'channel') {
        messagesStore.setCurrentChannel(id.toString());
        console.log(`Выбран канал: ${id}`);
        await messagesStore.loadMessages(id.toString());
    } else if (type === 'directMessage') {
        messagesStore.setCurrentChannel(id.toString());
        console.log(`Выбрана директ-сообщение: ${id}`);
        await messagesStore.loadMessages(id.toString());
    }
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