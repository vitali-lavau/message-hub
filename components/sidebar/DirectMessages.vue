<template>
    <div class="direct-messages">
        <div class="direct-messages__head flex items-center justify-between">
            <h2 class="direct-messages__title subtitle">Direct messages</h2>
            <ButtonAddDirectMessage/>
        </div>

        <div class="direct-messages__list">
            <DirectMessageItem
                v-for="message in sortedMessages"
                :key="message.id"
                :name="message.name"
                :imageUrl="message.imageUrl"
                :unreadCount="message.unreadCount"
                :isActive="message.id === activeMessageId"
                @click="setActiveMessage(message.id)"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import DirectMessageItem from "~/components/sidebar/DirectMessageItem.vue";
import ButtonAddDirectMessage from "~/components/ui/ButtonAddDirectMessage.vue";

defineProps<{
    activeMessageId: number | null;
}>();

const emit = defineEmits<{
    (e: 'setActiveMessage', id: number): void;
}>();

const messages = [
    { id: 1, name: "Emily Clark", imageUrl: "/images/users/emily.png", unreadCount: 3 },
    { id: 2, name: "James Anderson", imageUrl: "/images/users/james.png" },
    { id: 3, name: "Sophia Turner", imageUrl: "/images/users/sophia.png", unreadCount: 5 },
    { id: 4, name: "Liam Wilson", imageUrl: "" },
    { id: 5, name: "Olivia Brown", imageUrl: "/images/users/olivia.png" },
    { id: 6, name: "Noah Martinez", imageUrl: "" },
    { id: 7, name: "Ava Garcia", imageUrl: "/images/users/ava.png" },
    { id: 8, name: "Mason Lee", imageUrl: "", unreadCount: 2 },
    { id: 9, name: "Isabella White", imageUrl: "" },
    { id: 10, name: "Lucas Hall", imageUrl: "/images/users/lucas.png" }
];

const sortedMessages = computed(() => {
    return [...messages].sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0));
});

function setActiveMessage(id: number) {
    emit('setActiveMessage', id);
}
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.direct-messages {

    &__head {
        margin: 0 0 $spacing-lg;
    }

    &__list {
        padding: 0 $spacing-lg 0 0;
        overflow: auto;

        .direct-message-item {
            margin: 0 0 $spacing-md;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>