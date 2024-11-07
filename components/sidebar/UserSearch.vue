<template>
    <label class="search">
        <input
            @input="onInput"
            type="text"
            class="search__input input"
            placeholder="Search..."
        />
    </label>
</template>

<script setup lang="ts">
const emit = defineEmits(['updateSearch']);

function onInput(event: Event) {
    const target = event.target as HTMLInputElement;
    emit('updateSearch', target.value);
}
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.search {
    width: 100%;
    display: inline-block;

    &__input {
        width: 100%;
    }
}
</style>