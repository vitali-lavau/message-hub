<template>
    <div class="message-list flex items-center justify-center flex-1">
        <p class="message-list__empty">No messages yet...</p>
    </div>
</template>

<script setup lang="ts">

</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.message-list {
    padding: $spacing-xl $spacing-xxl;

    &__empty {
        color: $color-gray-second;
        font-size: $font-size-lg;
    }
}
</style>