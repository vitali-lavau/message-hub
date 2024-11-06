<template>
    <button class="btn-delete">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
            <path
                d="M11.3438 11.875C11.3438 12.3723 11.1462 12.8492 10.7946 13.2008C10.4429 13.5525 9.96603 13.75 9.46875 13.75H5.09375C4.59647 13.75 4.11956 13.5525 3.76792 13.2008C3.41629 12.8492 3.21875 12.3723 3.21875 11.875V4.375H2.59375V2.5H5.40625L6.03125 1.875H8.53125L9.15625 2.5H11.9688V4.375H11.3438V11.875ZM3.84375 4.375V11.875C3.84375 12.2065 3.97545 12.5245 4.20987 12.7589C4.44429 12.9933 4.76223 13.125 5.09375 13.125H9.46875C9.80027 13.125 10.1182 12.9933 10.3526 12.7589C10.5871 12.5245 10.7188 12.2065 10.7188 11.875V4.375H3.84375ZM11.3438 3.75V3.125H8.84375L8.21875 2.5H6.34375L5.71875 3.125H3.21875V3.75H11.3438ZM5.09375 5.625H5.71875V11.875H5.09375V5.625ZM8.84375 5.625H9.46875V11.875H8.84375V5.625Z"
                fill="#1E2EB7"/>
        </svg>
    </button>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.btn-delete {
    width: $spacing-md;
    height: $spacing-md;

    svg {

        path {
            transition: fill .4s ease;
        }
    }

    &:hover {

        svg {

            path {
                fill: $color-danger;
            }
        }
    }
}
</style>