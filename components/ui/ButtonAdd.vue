<template>
    <button class="btn-add flex items-center">
        <span>{{ props.label }}</span>
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M9.00001 3C9.41422 3 9.75001 3.33579 9.75001 3.75V14.25C9.75001 14.6642 9.41422 15 9.00001 15C8.58579 15 8.25 14.6642 8.25 14.25V3.75C8.25 3.33579 8.58579 3 9.00001 3Z"
                  fill="#1E2EB7"/>
            <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M3 9.00001C3 8.58579 3.33579 8.25 3.75 8.25H14.25C14.6642 8.25 15 8.58579 15 9.00001C15 9.41422 14.6642 9.75001 14.25 9.75001H3.75C3.33579 9.75001 3 9.41422 3 9.00001Z"
                  fill="#1E2EB7"/>
        </svg>
    </button>
</template>

<script setup lang="ts">
import type { ButtonAddProps } from "~/types/ButtonAddProps";

const props = defineProps<ButtonAddProps>();
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.btn-add {

    span {
        color: $color-secondary;
        font-size: $font-size-sm;
        font-weight: $font-weight-semibold;
        line-height: $line-height-lg;
        transition: color .4s ease;
    }

    svg {
        width: 18px;
        height: 18px;
        margin: 0 0 0 $spacing-xs;

        path {
            transition: fill .4s ease;
        }
    }

    &:hover {

        span {
            color: $color-primary;
        }

        svg {

            path {
                fill: $color-primary;
            }
        }
    }
}
</style>