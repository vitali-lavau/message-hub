<template>
    <div
        class="direct-message-item"
        :class="{ 'direct-message-item--active': isActive }"
        @click="$emit('setActive')"
    >
        <Avatar :name="name" :imageUrl="imageUrl" />
        <div
            class="direct-message-item__name"
            :style="{ paddingRight: unreadCount ? '32px' : '' }"
        >
            {{ name }}

            <div v-if="unreadCount" class="direct-message-item__unread">
                {{ unreadCount }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from "~/components/ui/Avatar.vue";
import type {DirectMessageItemProps} from "~/types/DirectMessageItemProps";

defineProps<DirectMessageItemProps & { isActive: boolean }>();
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.direct-message-item {
    width: 100%;
    display: flex;
    cursor: pointer;

    &__name {
        position: relative;
        flex: 1;
        padding: $spacing-sm $spacing-md;
        font-size: $font-size-base;
        font-weight: $font-weight-semibold;
        line-height: $line-height-lg;
        color: $color-text;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-radius: 20px;
        background-color: $color-background-gray-second;
        transition: background-color .4s ease;
    }

    &__unread {
        position: absolute;
        top: 50%;
        right: $spacing-sm;
        padding: 2px 4px;
        color: $color-white;
        font-size: 10px;
        font-weight: $font-weight-semibold;
        line-height: $line-height-base;
        border-radius: 20px;
        background-color: $color-accent;
        transform: translateY(-50%);
    }

    .avatar {
        flex-shrink: 0;
        margin: 0 $spacing-sm 0 0;
    }

    &:hover {

        .direct-message-item__name {
            background-color: $color-info-light;
        }
    }

    &.direct-message-item--active {

        .direct-message-item__name {
            background-color: $color-info;
        }
    }
}
</style>