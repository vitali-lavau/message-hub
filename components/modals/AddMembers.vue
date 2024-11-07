<template>
    <div class="add-members">
        <div class="add-members__title">Add Members</div>
        <UserSearch
            @updateSearch="updateSearchQuery"
            class="add-members__search"
        />

        <div class="add-members__list">
            <DirectMessageItem
                v-for="message in filteredMessages"
                :key="message.id"
                :id="message.id"
                :name="message.name"
                :imageUrl="message.imageUrl"
                :chatId="message.chatId"
                :isIcon="true"
                @toggle-select="toggleSelect"
                :isActive="selectedItems.includes(message.id)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import UserSearch from "~/components/sidebar/UserSearch.vue";
import DirectMessageItem from "~/components/sidebar/DirectMessageItem.vue";
import {useChatStore} from "~/stores/chatStore";

const chatStore = useChatStore();
const searchQuery = ref('');
const selectedItems = ref<number[]>([]);
const emit = defineEmits<{
    (event: 'update:selected-items', items: number[]): void;
}>();

function updateSearchQuery(query: string) {
    searchQuery.value = query;
}

const filteredMessages = computed(() => {
    return chatStore.contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

function toggleSelect(id: number, isSelected: boolean) {
    if (isSelected) {
        if (!selectedItems.value.includes(id)) {
            selectedItems.value.push(id);
        }
    } else {
        selectedItems.value = selectedItems.value.filter(itemId => itemId !== id);
    }
    emit('update:selected-items', selectedItems.value);
}
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.add-members {

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