<template>
    <label class="search">
        <input
            :value="value"
            type="text"
            class="search__input input"
            :placeholder="placeholder"
            :aria-label="ariaLabel"
            @input="onInput"
        />
    </label>
</template>

<script setup lang="ts">
withDefaults(
    defineProps<{
        value?: string;
        placeholder?: string;
        ariaLabel?: string;
    }>(),
    {
        value: '',
        placeholder: 'Search...',
        ariaLabel: 'Search',
    }
);

const emit = defineEmits<{
    (event: 'updateSearch', query: string): void;
}>();

function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('updateSearch', target.value);
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.search {
    width: 100%;
    display: inline-block;

    &__input {
        width: 100%;
    }
}
</style>
