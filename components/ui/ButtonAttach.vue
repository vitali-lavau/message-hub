<template>
    <button class="attach-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="20" viewBox="0 0 12 20" fill="none">
            <path opacity="0.4" fill-rule="evenodd" clip-rule="evenodd"
                  d="M0.000175476 3.75005C0.000175476 1.679 2.0149 0 4.5001 0C6.9854 0 9.00004 1.679 9.00004 3.75005V15.0001C9.00004 16.3808 7.65689 17.4999 6.00006 17.4999C4.34323 17.4999 3.00008 16.3808 3.00008 15.0001V5.00007H4.5001V15.0001C4.5001 15.6904 5.17161 16.2501 6.00006 16.2501C6.82852 16.2501 7.5001 15.6904 7.5001 15.0001V3.75005C7.5001 2.36931 6.15695 1.25004 4.5001 1.25004C2.84319 1.25004 1.50004 2.36931 1.50004 3.75005V15.0001C1.50004 17.0712 3.51478 18.7502 6.00006 18.7502C8.48534 18.7502 10.5001 17.0712 10.5001 15.0001V2.50006H12V15.625C11.6303 18.0907 9.0593 20.0001 6.00006 20.0001C2.94099 20.0001 0.369927 18.0907 0 15.625L0.000175476 3.75005Z"
                  fill="#808080"/>
        </svg>
    </button>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.attach-button {

    svg {

        path {
            transition: fill .4s ease;
        }
    }

    &:hover {

        svg {

            path {
                fill: $color-secondary;
            }
        }
    }
}
</style>