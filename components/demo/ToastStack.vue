<template>
    <Teleport to="body">
        <div class="toast-stack" aria-live="polite" aria-atomic="false">
            <TransitionGroup name="toast">
                <div
                    v-for="notification in uiStore.notifications"
                    :key="notification.id"
                    class="toast-stack__item"
                    :class="`toast-stack__item--${notification.type}`"
                    role="status"
                >
                    <span class="toast-stack__icon" aria-hidden="true">
                        {{ icons[notification.type] }}
                    </span>
                    <span>{{ notification.message }}</span>
                    <button
                        type="button"
                        class="toast-stack__close"
                        aria-label="Dismiss notification"
                        @click="dismiss(notification.id)"
                    >
                        ×
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { useUiStore, type UiNotification } from '~/stores/uiStore';

const AUTO_DISMISS_DELAY = 3_500;
const uiStore = useUiStore();
const timers = new Map<string, ReturnType<typeof setTimeout>>();
const icons: Record<UiNotification['type'], string> = {
    success: '✓',
    error: '!',
    info: 'i',
};

function dismiss(notificationId: string) {
    const timer = timers.get(notificationId);

    if (timer) {
        clearTimeout(timer);
        timers.delete(notificationId);
    }

    uiStore.removeNotification(notificationId);
}

watch(
    () => uiStore.notifications.map((notification) => notification.id),
    (notificationIds) => {
        notificationIds.forEach((notificationId) => {
            if (timers.has(notificationId)) {
                return;
            }

            timers.set(
                notificationId,
                setTimeout(() => dismiss(notificationId), AUTO_DISMISS_DELAY)
            );
        });

        Array.from(timers.keys()).forEach((notificationId) => {
            if (!notificationIds.includes(notificationId)) {
                const timer = timers.get(notificationId);
                if (timer) {
                    clearTimeout(timer);
                }
                timers.delete(notificationId);
            }
        });
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    timers.forEach((timer) => clearTimeout(timer));
    timers.clear();
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.toast-stack {
    position: fixed;
    top: $spacing-lg;
    right: $spacing-lg;
    z-index: $z-index-tooltip;
    width: min(360px, calc(100vw - #{$spacing-xl}));
    display: flex;
    flex-direction: column;
    gap: $spacing-sm;

    &__item {
        display: grid;
        grid-template-columns: 24px 1fr 24px;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-m $spacing-md;
        color: $color-text;
        background: $color-white;
        border-left: 4px solid $color-primary;
        box-shadow: 0 10px 30px rgba(24, 43, 80, 0.18);
        border-radius: 8px;

        &--success {
            border-left-color: $color-success;
        }

        &--error {
            border-left-color: $color-danger;
        }
    }

    &__icon {
        width: 22px;
        height: 22px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        color: $color-white;
        font-size: $font-size-min;
        font-weight: $font-weight-bold;
        background: $color-primary;
        border-radius: 50%;
    }

    &__item--success &__icon {
        background: $color-success;
    }

    &__item--error &__icon {
        background: $color-danger;
    }

    &__close {
        color: $color-gray-second;
        font-size: $font-size-lg;
        line-height: 1;
    }
}

.toast-enter-active,
.toast-leave-active {
    transition:
        opacity 0.2s ease,
        transform 0.2s ease;
}

.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    transform: translateX(24px);
}

@media (max-width: 767px) {
    .toast-stack {
        top: $spacing-sm;
        right: $spacing-sm;
        width: calc(100vw - #{$spacing-md});
    }
}
</style>
