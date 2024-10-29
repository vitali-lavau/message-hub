<template>
    <Sidebar/>
    <MessageView/>
</template>

<script setup lang="ts">

import MessageView from "~/components/chat/MessageView.vue";
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.sidebar {
    margin: 0 $spacing-xl 0 0;
}
</style>