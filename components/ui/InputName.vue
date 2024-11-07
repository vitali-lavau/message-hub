<template>
    <label class="name">
        <input
            type="text"
            class="name__input"
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            :placeholder="placeholder"
        >
    </label>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: String,
    placeholder: string,
}>()
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.name {
    width: 100%;

    &__input {
        width: 100%;
        background-color: $color-white;
        border: 1px solid $color-gray-border;
    }
}
</style>