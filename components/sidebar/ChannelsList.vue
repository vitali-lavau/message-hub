<template>
    <div class="channels">
        <div class="channels__head">
            <h2 class="channels__title subtitle">Channels</h2>
            <ButtonAdd label="Add"/>
        </div>

        <div class="channels__list">
            <ChannelItem
                v-for="channel in channels"
                :key="channel.id"
                :name="channel.name"
                :imageUrl="channel.imageUrl"
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
    activeMessageId: number | null;
}>();

const emit = defineEmits<{
    (e: 'setActiveChannel', id: number): void;
}>();

const channels = [
    { id: 1, name: "General Discussion", imageUrl: "" },
    { id: 2, name: "Announcements", imageUrl: "/images/channels/announcements.png" },
    { id: 3, name: "Project Updates", imageUrl: "" },
    { id: 4, name: "Marketing Team Insights", imageUrl: "/images/channels/marketing.png" },
    { id: 5, name: "Design Team", imageUrl: "" },
    { id: 6, name: "Technical Support and Issues", imageUrl: "/images/channels/support.png" },
    { id: 7, name: "Customer Success Stories", imageUrl: "" },
    { id: 8, name: "Random Thoughts and Ideas", imageUrl: "" },
    { id: 9, name: "Sales", imageUrl: "/images/channels/sales.png" },
    { id: 10, name: "HR Announcements and Policies", imageUrl: "" }
];

function setActiveChannel(id: number) {
    emit('setActiveChannel', id);
}
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.channels {

    &__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
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