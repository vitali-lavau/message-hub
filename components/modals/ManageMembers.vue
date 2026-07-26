<template>
    <ModalBase
        :open="uiStore.isManageMembersModalOpen"
        :header-margin-bottom="24"
        :body-margin-bottom="24"
        @close="close"
    >
        <template #header>
            <h3>Manage members</h3>
            <p class="manage-members__summary">
                {{ conversation?.name }} · {{ currentMembers.length }} members
            </p>
        </template>

        <template #body>
            <section class="manage-members__section">
                <h4>Current members</h4>
                <div class="manage-members__list">
                    <div v-for="user in currentMembers" :key="user.id" class="manage-members__row">
                        <Avatar
                            :name="user.name"
                            :image-url="user.avatarUrl"
                            :status="user.status"
                        />
                        <div class="manage-members__identity">
                            <strong>{{ user.name }}</strong>
                            <span>{{ user.role }}</span>
                        </div>
                        <span
                            v-if="user.id === sessionStore.currentUserId"
                            class="manage-members__you"
                        >
                            You
                        </span>
                        <button
                            v-else
                            type="button"
                            class="manage-members__remove"
                            :aria-label="`Remove ${user.name}`"
                            @click="removeMember(user.id, user.name)"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            </section>

            <section class="manage-members__section">
                <h4>Add people</h4>
                <UserSearch
                    :value="searchQuery"
                    placeholder="Search people..."
                    @update-search="searchQuery = $event"
                />
                <div class="manage-members__list manage-members__list--available">
                    <p v-if="!availableUsers.length" class="manage-members__empty">
                        No people found
                    </p>
                    <div v-for="user in availableUsers" :key="user.id" class="manage-members__row">
                        <Avatar
                            :name="user.name"
                            :image-url="user.avatarUrl"
                            :status="user.status"
                        />
                        <div class="manage-members__identity">
                            <strong>{{ user.name }}</strong>
                            <span>{{ user.role }}</span>
                        </div>
                        <button
                            type="button"
                            class="manage-members__add"
                            :aria-label="`Add ${user.name}`"
                            @click="addMember(user.id, user.name)"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </section>
        </template>

        <template #footer>
            <ButtonPrimary label="Done" @click="close" />
        </template>
    </ModalBase>
</template>

<script setup lang="ts">
import Avatar from '~/components/ui/Avatar.vue';
import ButtonPrimary from '~/components/ui/ButtonPrimary.vue';
import ModalBase from '~/components/modals/ModalBase.vue';
import UserSearch from '~/components/sidebar/UserSearch.vue';
import { useConversationsStore } from '~/stores/conversationsStore';
import { useSessionStore } from '~/stores/sessionStore';
import { useUiStore } from '~/stores/uiStore';
import { useUsersStore } from '~/stores/usersStore';

const conversationsStore = useConversationsStore();
const sessionStore = useSessionStore();
const uiStore = useUiStore();
const usersStore = useUsersStore();
const searchQuery = ref('');

const conversation = computed(() => conversationsStore.activeConversation);
const currentMembers = computed(() =>
    (conversation.value?.participantIds ?? [])
        .map((userId) => usersStore.getUserById(userId))
        .filter((user) => user !== null)
);
const availableUsers = computed(() => {
    const participantIds = new Set(conversation.value?.participantIds ?? []);
    const query = searchQuery.value.trim().toLowerCase();

    return usersStore.selectableUsers.filter(
        (user) =>
            !participantIds.has(user.id) &&
            (!query ||
                user.name.toLowerCase().includes(query) ||
                user.role.toLowerCase().includes(query))
    );
});

function addMember(userId: string, userName: string) {
    if (!conversation.value) {
        return;
    }

    conversationsStore.addParticipants(conversation.value.id, [userId]);
    uiStore.addNotification(`${userName} added to ${conversation.value.name}`, 'success');
}

function removeMember(userId: string, userName: string) {
    if (!conversation.value) {
        return;
    }

    conversationsStore.removeParticipant(conversation.value.id, userId);
    uiStore.addNotification(`${userName} removed from ${conversation.value.name}`, 'info');
}

function close() {
    searchQuery.value = '';
    uiStore.closeManageMembersModal();
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.manage-members {
    &__summary {
        margin: 0;
        color: $color-gray-second;
        font-size: $font-size-sm;
    }

    &__section + &__section {
        margin-top: $spacing-lg;
        padding-top: $spacing-lg;
        border-top: 1px solid $color-border;
    }

    h4 {
        margin: 0 0 $spacing-m;
        color: $color-text;
        font-weight: $font-weight-bold;
    }

    &__list {
        max-height: 190px;
        overflow-y: auto;

        &--available {
            margin-top: $spacing-m;
        }
    }

    &__row {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-sm 0;
    }

    &__identity {
        min-width: 0;
        display: flex;
        flex: 1;
        flex-direction: column;

        strong,
        span {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        strong {
            color: $color-text;
            font-size: $font-size-sm;
        }

        span {
            color: $color-gray-second;
            font-size: $font-size-xs;
        }
    }

    &__you {
        color: $color-gray-second;
        font-size: $font-size-xs;
    }

    &__add,
    &__remove {
        padding: $spacing-xs $spacing-sm;
        font-size: $font-size-xs;
        border: 1px solid currentColor;
        border-radius: $btn-border-radius;
    }

    &__add {
        color: $color-secondary;
    }

    &__remove {
        color: $color-danger;
    }

    &__empty {
        margin: $spacing-md 0 0;
        color: $color-gray-second;
        font-size: $font-size-sm;
    }
}
</style>
