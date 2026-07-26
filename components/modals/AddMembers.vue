<template>
    <div class="add-members">
        <div class="add-members__title">Add Members</div>
        <UserSearch class="add-members__search" @update-search="updateSearchQuery" />

        <div class="add-members__list">
            <p v-if="!filteredUsers.length" class="add-members__empty">
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
                :selectable="true"
                :is-selected="selectedItems.includes(user.id)"
                @select="toggleSelect"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import UserSearch from '~/components/sidebar/UserSearch.vue';
import DirectMessageItem from '~/components/sidebar/DirectMessageItem.vue';
import { useUsersStore } from '~/stores/usersStore';

const usersStore = useUsersStore();
const searchQuery = ref('');
const selectedItems = ref<string[]>([]);
const emit = defineEmits<{
    (event: 'update:selected-items', items: string[]): void;
}>();

function updateSearchQuery(query: string) {
    searchQuery.value = query;
}

const filteredUsers = computed(() => {
    return usersStore.selectableUsers.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

function toggleSelect(id: string) {
    if (selectedItems.value.includes(id)) {
        selectedItems.value = selectedItems.value.filter((itemId) => itemId !== id);
    } else {
        selectedItems.value.push(id);
    }

    emit('update:selected-items', [...selectedItems.value]);
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

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
