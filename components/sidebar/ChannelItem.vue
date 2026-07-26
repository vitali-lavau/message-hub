<template>
    <button
        type="button"
        class="channel-item flex"
        :class="{ 'channel-item--active': props.isActive }"
        :aria-current="props.isActive ? 'true' : undefined"
        :aria-label="`${name}${unreadCount ? `, ${unreadCount} unread` : ''}`"
        @click="emit('select', props.id)"
    >
        <div class="channel-item__content">
            <div class="channel-item__header">
                <span class="channel-item__name"># {{ name }}</span>
                <time v-if="lastMessageTime" class="channel-item__time">
                    {{ lastMessageTime }}
                </time>
                <span v-if="unreadCount" class="channel-item__unread">{{ unreadCount }}</span>
            </div>
            <span class="channel-item__preview">{{ lastMessage }}</span>
        </div>
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    id: string;
    name: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
    isActive?: boolean;
}>();

const emit = defineEmits<{
    (event: 'select', id: string): void;
}>();
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.channel-item {
    width: 100%;
    min-width: 0;
    cursor: pointer;
    color: inherit;
    text-align: left;
    border: 0;
    background: transparent;

    &__content {
        position: relative;
        min-width: 0;
        flex: 1;
        padding: $spacing-sm $spacing-md;
        color: $color-text;
        border-radius: 20px;
        background-color: $color-background-gray-second;
        transition: background-color 0.4s ease;
    }

    &__header {
        min-width: 0;
        display: flex;
        align-items: center;
        gap: $spacing-sm;
    }

    &__name,
    &__preview {
        display: block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__name {
        min-width: 0;
        flex: 1;
        font-size: $font-size-base;
        font-weight: $font-weight-semibold;
        line-height: $line-height-lg;
    }

    &__preview,
    &__time {
        color: $color-gray-second;
        font-size: $font-size-xs;
        font-weight: $font-weight-normal;
    }

    &__preview {
        line-height: $line-height-base;
    }

    &__time {
        flex-shrink: 0;
    }

    &__unread {
        min-width: 18px;
        flex: 0 0 auto;
        padding: 2px 5px;
        color: $color-white;
        font-size: $font-size-xs;
        line-height: 14px;
        text-align: center;
        background: $color-accent;
        border-radius: 20px;
    }

    .avatar {
        flex-shrink: 0;
        margin: 0 $spacing-sm 0 0;
    }

    &:hover {
        .channel-item__content {
            background-color: $color-info-light;
        }
    }

    &.channel-item--active {
        .channel-item__content {
            background-color: $color-info;
        }
    }
}
</style>
