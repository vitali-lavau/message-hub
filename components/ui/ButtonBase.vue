<template>
    <button class="btn-base">{{ label }}</button>
</template>

<script setup lang="ts">
import type {ButtonBaseProps} from "~/types/ButtonBaseProps";

defineProps<ButtonBaseProps>();
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.btn-base {
    padding: $btn-padding $spacing-lg;
    color: $color-secondary;
    text-align: center;
    font-size: $font-size-base;
    line-height: $line-height-base;
    border-radius: $btn-border-radius;
    border: 1px solid $color-secondary;
    background: $color-white;
    transition: background-color .4s ease, color .4s ease;

    &:hover {
        background-color: $btn-primary-bg;
        color: $color-white;
    }
}
</style>