<template>
    <div
        class="avatar flex items-center justify-center"
        :aria-label="`${name}${status ? `, ${status}` : ''}`"
    >
        <div
            class="avatar__media flex items-center justify-center"
            :style="{
                backgroundColor: imageUrl ? 'transparent' : bgColor || 'var(--color-primary)',
            }"
        >
            <template v-if="imageUrl">
                <img :src="imageUrl" :alt="name" class="avatar__img img-responsive" />
            </template>
            <template v-else>
                <span class="avatar__name">{{ initials }}</span>
            </template>
        </div>
        <span
            v-if="status"
            class="avatar__status"
            :class="`avatar__status--${status}`"
            aria-hidden="true"
        />
    </div>
</template>

<script setup lang="ts">
import type { AvatarProps } from '~/types/AvatarProps';

const props = defineProps<AvatarProps>();

const initials = computed(() => {
    const words = props.name.trim().split(/\s+/);
    const firstInitial = words[0]?.[0] ?? '?';
    const secondInitial = words[1]?.[0] ?? '';
    return `${firstInitial}${secondInitial}`;
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.avatar {
    position: relative;
    width: 42px;
    height: 42px;
    border-radius: 30px;

    &__media {
        width: 100%;
        height: 100%;
        overflow: hidden;
        border-radius: inherit;
    }

    &__img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        object-position: center;
    }

    &__name {
        padding: $spacing-sm $spacing-xs;
        font-size: $font-size-lg;
        color: $color-white;
        line-height: 2.2;
        text-align: center;
    }

    &__status {
        position: absolute;
        right: -1px;
        bottom: -1px;
        width: 11px;
        height: 11px;
        border: 2px solid $color-white;
        border-radius: 50%;

        &--online {
            background: $color-success;
        }

        &--away {
            background: $color-warning;
        }

        &--offline {
            background: $color-gray;
        }
    }
}
</style>
