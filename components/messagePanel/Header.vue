<template>
    <div class="message-header flex justify-between items-center">
        <button
            type="button"
            class="message-header__sidebar-button"
            aria-label="Open conversations"
            aria-controls="conversation-sidebar"
            :aria-expanded="sidebarOpen"
            @click="emit('open-sidebar')"
        >
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path
                    d="M12.5 4L6.5 10L12.5 16"
                    stroke="currentColor"
                    stroke-width="1.8"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                />
            </svg>
        </button>
        <h1 class="message-header__title">{{ title }}</h1>
        <button
            v-if="showMembers"
            type="button"
            class="message-header__members"
            :aria-label="`Manage ${memberCount ?? 0} conversation members`"
            @click="emit('manage-members')"
        >
            {{ memberCount }} members
        </button>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
    showMembers?: boolean;
    memberCount?: number;
    sidebarOpen?: boolean;
}>();

const emit = defineEmits<{
    (event: 'open-sidebar'): void;
    (event: 'manage-members'): void;
}>();
</script>

<style lang="scss">
@use 'assets/scss/variables' as *;

.message-header {
    height: 56px;
    flex-shrink: 0;
    padding: $spacing-m $spacing-xxl;
    border-radius: $border-radius $border-radius 0 0;
    background: $color-info;

    &__title {
        min-width: 0;
        flex: 1;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: $color-text;
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        line-height: $line-height-base;
    }

    &__sidebar-button {
        width: 36px;
        height: 36px;
        display: none;
        flex: 0 0 auto;
        align-items: center;
        justify-content: center;
        margin-right: $spacing-sm;
        color: $color-secondary;
        border-radius: 50%;
    }

    &__members {
        padding: $spacing-xs $spacing-m;
        color: $color-secondary;
        font-size: $font-size-sm;
        font-weight: $font-weight-semibold;
        border: 1px solid rgba(30, 46, 183, 0.25);
        border-radius: $btn-border-radius;
        background: rgba(255, 255, 255, 0.55);
    }
}

@media (max-width: 1023px) {
    .message-header {
        padding-inline: $spacing-lg;

        &__sidebar-button {
            display: inline-flex;
        }
    }
}

@media (max-width: 767px) {
    .message-header {
        min-height: calc(56px + env(safe-area-inset-top));
        height: auto;
        padding: calc(#{$spacing-sm} + env(safe-area-inset-top)) $spacing-m $spacing-sm;
        border-radius: 0;

        &__sidebar-button {
            width: 40px;
            height: 40px;
            margin-right: $spacing-xs;
        }

        &__members {
            max-width: 116px;
            min-height: 36px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
    }
}
</style>
