<template>
    <div
        class="channel-item flex"
        :class="{ 'channel-item--active': props.isActive }"
        @click="$emit('click')"
    >
        <div class="channel-item__name">
            # {{ name }}
        </div>
    </div>
</template>

<script setup lang="ts">
import type {ChannelItemProps} from "~/types/ChannelItemProps";

const props = defineProps<ChannelItemProps & { isActive?: boolean }>();
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.channel-item {
    width: 100%;
    cursor: pointer;

    &__name {
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

    .avatar {
        flex-shrink: 0;
        margin: 0 $spacing-sm 0 0;
    }

    &:hover {

        .channel-item__name {
            background-color: $color-info-light;
        }
    }

    &.channel-item--active {

        .channel-item__name {
            background-color: $color-info;
        }
    }
}
</style>