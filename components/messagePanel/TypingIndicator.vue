<template>
    <div class="typing-indicator" role="status" aria-live="polite">
        <Avatar
            :name="bot?.name ?? 'Demo Bot'"
            :image-url="bot?.avatarUrl"
            :status="bot?.status"
            class="typing-indicator__avatar"
        />
        <div class="typing-indicator__content">
            <span class="typing-indicator__label">Demo Bot is typing</span>
            <span class="typing-indicator__dots" aria-hidden="true">
                <i />
                <i />
                <i />
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from '~/components/ui/Avatar.vue';
import { useUsersStore } from '~/stores/usersStore';

const usersStore = useUsersStore();
const bot = computed(() => usersStore.getUserById('bot'));
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.typing-indicator {
    display: flex;
    align-items: center;
    gap: $spacing-m;
    margin: 0 $spacing-xxl;
    color: $color-gray-second;

    &__avatar {
        width: 28px;
        height: 28px;
        flex: 0 0 auto;
    }

    &__content {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-sm $spacing-m;
        font-size: $font-size-min;
        background: $color-info-light;
        border-radius: 12px;
    }

    &__dots {
        display: flex;
        gap: 3px;

        i {
            width: 4px;
            height: 4px;
            background: $color-gray-second;
            border-radius: 50%;
            animation: typing-bounce 1s infinite ease-in-out;

            &:nth-child(2) {
                animation-delay: 0.15s;
            }

            &:nth-child(3) {
                animation-delay: 0.3s;
            }
        }
    }
}

@keyframes typing-bounce {
    0%,
    60%,
    100% {
        transform: translateY(0);
    }

    30% {
        transform: translateY(-3px);
    }
}
</style>
