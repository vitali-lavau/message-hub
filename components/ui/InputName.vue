<template>
    <label class="name">
        <input
            type="text"
            class="name__input"
            :value="modelValue"
            :placeholder="placeholder"
            :aria-label="ariaLabel || placeholder"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        />
    </label>
</template>

<script setup lang="ts">
defineProps<{
    modelValue: string;
    placeholder: string;
    ariaLabel?: string;
}>();

defineEmits<{
    (event: 'update:modelValue', value: string): void;
}>();
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.name {
    width: 100%;

    &__input {
        width: 100%;
        background-color: $color-white;
        border: 1px solid $color-gray-border;
    }
}
</style>
