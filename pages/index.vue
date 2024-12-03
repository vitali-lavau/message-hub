<template>
    <Sidebar/>
    <MessagePanel class="flex-1"/>
</template>

<script setup lang="ts">
import Sidebar from "~/components/sidebar/Sidebar.vue";
import MessagePanel from "~/components/messagePanel/MessagePanel.vue";
import { fetchUserChannels } from "~/api/channels";

onMounted(async () => {
    try {
        const channels = await fetchUserChannels();
        console.log("Полученные каналы:", channels);
    } catch (error) {
        console.error("Ошибка при загрузке каналов:", error);
    }
});
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.sidebar {
    margin: 0 $spacing-xl 0 0;
}
</style>