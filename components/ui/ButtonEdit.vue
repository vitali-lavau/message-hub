<template>
    <button class="btn-edit">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
            <path
                d="M9.46875 3.75176L11.3438 5.62676M8.21875 12.5018H13.2188M3.21875 10.0018L2.59375 12.5018L5.09375 11.8768L12.335 4.63551C12.5693 4.4011 12.701 4.08322 12.701 3.75176C12.701 3.42031 12.5693 3.10242 12.335 2.86801L12.2275 2.76051C11.9931 2.52618 11.6752 2.39453 11.3438 2.39453C11.0123 2.39453 10.6944 2.52618 10.46 2.76051L3.21875 10.0018Z"
                stroke="#1E2EB7" stroke-width="0.6" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </button>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.btn-edit {
    width: $spacing-md;
    height: $spacing-md;

    svg {

        path {
            transition: stroke .4s ease;
        }
    }

    &:hover {

        svg {

            path {
                stroke: $color-warning;
            }
        }
    }
}
</style>