<template>
    <div
        class="avatar flex items-center justify-center"
        :style="{ backgroundColor: imageUrl ? 'transparent' : bgColor || 'var(--color-primary)' }"
    >
        <template v-if="imageUrl">
            <img
                :src="imageUrl"
                alt="Channel Avatar"
                class="avatar__img img-responsive"
            />
        </template>
        <template v-else>
            <span class="avatar__name">{{ initials }}</span>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { AvatarProps } from "~/types/AvatarProps";

const props = defineProps<AvatarProps>();

const initials = computed(() => {
   const words = props.name.split(' ');
   if (words.length === 1) {
       return words[0][0];
   } else {
       return words[0][0] + words[1][0];
   }
});
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.avatar {
    width: 42px;
    height: 42px;
    border-radius: 30px;
    overflow: hidden;

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
}
</style>