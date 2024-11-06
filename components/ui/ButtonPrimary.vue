<template>
    <button class="btn-primary">{{ props.label }}</button>
</template>

<script setup lang="ts">
import type {ButtonPrimaryProps} from "~/types/ButtonPrimaryProps";

const props = defineProps<ButtonPrimaryProps>();
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.btn-primary {
    padding: $btn-padding $spacing-lg;
    color: $btn-primary-color;
    text-align: center;
    font-size: $font-size-base;
    line-height: $line-height-base;
    border-radius: $btn-border-radius;
    background: $btn-primary-bg;
    transition: background-color .4s ease;

    &:hover {
        background-color: $color-accent;
    }
}
</style>