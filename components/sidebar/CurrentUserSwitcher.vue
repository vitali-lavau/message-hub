<template>
    <section
        v-if="currentUser"
        class="current-user"
        :title="currentUser.bio"
        :aria-description="currentUser.bio"
    >
        <div class="current-user__profile">
            <Avatar
                :name="currentUser.name"
                :image-url="currentUser.avatarUrl"
                :status="currentUser.status"
                class="current-user__avatar"
            />
            <div class="current-user__identity">
                <strong>{{ currentUser.name }}</strong>
                <span>{{ currentUser.role }}</span>
            </div>
        </div>

        <label class="current-user__select-label" for="current-demo-user"> View demo as </label>
        <select
            id="current-demo-user"
            class="current-user__select"
            :value="sessionStore.currentUserId"
            @change="switchUser"
        >
            <option v-for="user in demoUsers" :key="user.id" :value="user.id">
                {{ user.name }} — {{ user.role }}
            </option>
        </select>
    </section>
</template>

<script setup lang="ts">
import Avatar from '~/components/ui/Avatar.vue';
import { useConversationsStore } from '~/stores/conversationsStore';
import { useSessionStore } from '~/stores/sessionStore';
import { useUiStore } from '~/stores/uiStore';
import { useUsersStore } from '~/stores/usersStore';

const sessionStore = useSessionStore();
const usersStore = useUsersStore();
const conversationsStore = useConversationsStore();
const uiStore = useUiStore();

const currentUser = computed(() => usersStore.currentUser);
const demoUsers = computed(() => usersStore.users.filter((user) => user.id !== 'bot'));

function switchUser(event: Event) {
    const userId = (event.target as HTMLSelectElement).value;
    const user = usersStore.getUserById(userId);

    if (!user || user.id === 'bot') {
        return;
    }

    sessionStore.setCurrentUser(user.id);
    conversationsStore.ensureActiveConversationForCurrentUser();
    uiStore.addNotification(`Viewing demo as ${user.name}`, 'info');
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.current-user {
    margin: 0 0 $spacing-m;
    padding: $spacing-sm;
    color: $color-text;
    background: $color-background-gray;
    border-radius: $border-radius-min;

    &__profile {
        display: flex;
        align-items: center;
        gap: $spacing-m;
    }

    &__avatar {
        flex: 0 0 auto;
    }

    &__identity {
        min-width: 0;

        strong,
        span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        strong {
            font-size: $font-size-sm;
        }

        span {
            margin-top: 2px;
            color: $color-gray-second;
            font-size: $font-size-xs;
        }
    }

    &__select-label {
        display: block;
        margin: $spacing-sm 0 $spacing-xs;
        font-size: $font-size-xs;
        font-weight: $font-weight-semibold;
    }

    &__select {
        width: 100%;
        padding: $spacing-xs $spacing-sm;
        color: $color-secondary;
        font-size: $font-size-xs;
        background: $color-white;
        border: 1px solid $color-border;
        border-radius: $border-radius-min;
    }
}
</style>
