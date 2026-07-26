<template>
    <div class="write-to">
        <div class="write-to__title">Write to...</div>
        <UserSearch class="write-to__search" @update-search="updateSearchQuery" />

        <div class="write-to__list">
            <p v-if="!filteredUsers.length" class="write-to__empty">
                {{ searchQuery ? 'No matching people' : 'No people available' }}
            </p>
            <DirectMessageItem
                v-for="user in filteredUsers"
                :id="user.id"
                :key="user.id"
                :name="user.name"
                :avatar-url="user.avatarUrl"
                :status="user.status"
                :subtitle="user.role"
                @select="startConversation"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import UserSearch from '~/components/sidebar/UserSearch.vue';
import DirectMessageItem from '~/components/sidebar/DirectMessageItem.vue';
import { useConversationsStore } from '~/stores/conversationsStore';
import { useUiStore } from '~/stores/uiStore';
import { useUsersStore } from '~/stores/usersStore';

const conversationsStore = useConversationsStore();
const uiStore = useUiStore();
const usersStore = useUsersStore();
const searchQuery = ref('');
const emit = defineEmits<{
    (event: 'conversation-selected'): void;
}>();

function updateSearchQuery(query: string) {
    searchQuery.value = query;
}

const filteredUsers = computed(() => {
    return usersStore.selectableUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

function startConversation(userId: string) {
    conversationsStore.findOrCreateDirect(userId);
    uiStore.closeNewDirectModal();
    searchQuery.value = '';
    emit('conversation-selected');
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

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
            margin: 0 0 $spacing-m;
        }
    }

    &__empty {
        margin: $spacing-lg 0;
        color: $color-gray-second;
        text-align: center;
    }
}
</style>
