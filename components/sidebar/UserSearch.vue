<template>
    <label class="search">
        <input
            type="search"
            class="search__input input"
            placeholder="Search..."
        />
    </label>
</template>

<script setup lang="ts">

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