<template>
    <div class="write-to">
        <div class="write-to__title">Write to...</div>
        <UserSearch
            @updateSearch="updateSearchQuery"
            class="write-to__search"
        />

        <div class="write-to__list">
            <DirectMessageItem
                v-for="message in filteredMessages"
                :key="message.id"
                :id="message.id"
                :name="message.name"
                :imageUrl="message.imageUrl"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import {useDirectsStore} from "~/stores/directsStore";
import UserSearch from "~/components/sidebar/UserSearch.vue";
import DirectMessageItem from "~/components/sidebar/DirectMessageItem.vue";

const chatStore = useDirectsStore();
const searchQuery = ref('');

function updateSearchQuery(query: string) {
    searchQuery.value = query;
}

const filteredMessages = computed(() => {
    return chatStore.directs.filter(direct =>
        direct.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.write-to {

    &__title {
        margin: 0 0 $spacing-l;
        color: $color-text;
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
    }

    &__search {
        margin: 0 0 $spacing-l;
    }

    &__list {
        max-height: 300px;
        padding: 0 $spacing-l 0 0;
        overflow: auto;

        .direct-message-item {
            margin:  0 0 $spacing-m;
        }
    }
}
</style>