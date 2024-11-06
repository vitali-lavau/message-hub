<template>
    <div class="date-separator">
        <span>{{ formatDate(date) }}</span>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    date: Date;
}>();
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.date-separator {
    display: flex;
    align-items: center;
    justify-content: center;
    color: $color-gray-second;
    font-size: $font-size-sm;
    position: relative;
}

.date-separator::before,
.date-separator::after {
    content: '';
    flex: 1;
    border-top: 1px solid rgba(0, 0, 0, .16);
    margin: 0 1em;
}
</style>
