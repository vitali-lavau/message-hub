<template>
    <aside class="sidebar flex flex-col">
        <UserSearch @updateSearch="updateSearchQuery"/>
        <ChannelsList
            class="section flex flex-col"
            :searchQuery="searchQuery"
            :activeItem="activeItem"
            @setActiveItem="setActiveItem"
        />
        <DirectMessages
            class="section flex flex-col"
            :searchQuery="searchQuery"
            :activeItem="activeItem"
            @setActiveItem="setActiveItem"
        />
    </aside>
</template>

<script setup lang="ts">
import UserSearch from "~/components/sidebar/UserSearch.vue";
import ChannelsList from "~/components/sidebar/ChannelsList.vue";
import DirectMessages from "~/components/sidebar/DirectMessages.vue";

const searchQuery = ref('');
const activeItem = ref<{ type: 'channel' | 'directMessage'; id: string | number } | null>(null);

function updateSearchQuery(query: string) {
    searchQuery.value = query;
}

function setActiveItem(type: 'channel' | 'directMessage', id: string | number) {
    activeItem.value = { type, id };
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