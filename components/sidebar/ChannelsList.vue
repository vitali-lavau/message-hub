<template>
    <div class="channels">
        <div class="channels__head flex items-center justify-between">
            <h2 class="channels__title subtitle">Channels</h2>
            <ButtonAdd label="Add"/>
        </div>

        <div class="channels__list">
            <ChannelItem
                v-for="channel in channels"
                :key="channel.id"
                :name="channel.name"
                :isActive="channel.id === activeChannelId"
                @click="setActiveChannel(channel.id)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import ButtonAdd from "~/components/ui/ButtonAdd.vue";
import ChannelItem from "~/components/sidebar/ChannelItem.vue";

defineProps<{
    activeChannelId: number | null;
    activeMessageId?: number | null;
}>();

const emit = defineEmits<{
    (e: 'setActiveChannel', id: number): void;
}>();

const channels = [
    {id: 1, name: "General Discussion"},
    {id: 2, name: "Announcements"},
    {id: 3, name: "Project Updates"},
    {id: 4, name: "Marketing Team Insights"},
    {id: 5, name: "Design Team"},
    {id: 6, name: "Technical Support and Issues"},
    {id: 7, name: "Customer Success Stories"},
    {id: 8, name: "Random Thoughts and Ideas"},
    {id: 9, name: "Sales"},
    {id: 10, name: "HR Announcements and Policies"}
];

function setActiveChannel(id: number) {
    emit('setActiveChannel', id);
}
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.channels {

    &__head {
        margin: 0 0 $spacing-lg;
    }

    &__list {
        padding: 0 $spacing-lg 0 0;
        overflow-y: auto;
        overflow-x: visible;

        .channel-item {
            margin: 0 0 $spacing-md;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>