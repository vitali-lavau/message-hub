<template>
    <button class="btn-dots">
        <svg width="7" height="27" viewBox="0 0 7 27" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="3.17578" cy="23.0293" r="3" transform="rotate(-90 3.17578 23.0293)" fill="#808080"/>
            <circle cx="3.17578" cy="13.0293" r="3" transform="rotate(-90 3.17578 13.0293)" fill="#808080"/>
            <circle cx="3.17578" cy="3.0293" r="3" transform="rotate(-90 3.17578 3.0293)" fill="#808080"/>
        </svg>
    </button>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.btn-dots {

    svg {

        circle {
            transition: fill .4s ease;
        }
    }

    &:hover {

        svg {

            circle {
                fill: $color-secondary;
            }
        }
    }
}
</style>