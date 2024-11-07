<template>
    <div class="message-list flex items-center justify-center flex-1">
        <p v-if="!messages.length" class="message-list__empty">No messages yet...</p>

        <DynamicScroller
            v-else
            :items="messagesWithSeparators"
            :key-field="'id'"
            class="message-list__scroller flex-1"
            :min-item-size="60"
        >
            <template #default="{ item, index, active }">
                <DynamicScrollerItem
                    :item="item"
                    :index="index"
                    :active="active"
                >
                    <component
                        :is="item.type"
                        v-bind="item.props"
                        @editMessage="onEditMessage"
                        @deleteMessage="onDeleteMessage"
                        :class="{ 'deleting': item.isDeleting }"
                    />
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
</template>

<script setup lang="ts">
import {DynamicScroller, DynamicScrollerItem} from 'vue-virtual-scroller';
import MessageItem from './MessageItem.vue';
import DateSeparator from "~/components/ui/DateSeparator.vue";
import type {Message} from "~/types/Message";
import type { MessageItemWithSeparator } from '~/types/MessageItemWithSeparator';
import { useChatStore } from '~/stores/chatStore';

const userStore = useUserStore();
const chatStore = useChatStore();
const currentUser = userStore.user;

const props = defineProps<{
    messages: Message[];
}>();

const messagesWithSeparators = computed((): MessageItemWithSeparator[] => {
    const items: MessageItemWithSeparator[] = [];
    let lastDate: string | null = null;

    chatStore.activeMessages.forEach((message) => {
        const messageDate = new Date(message.timestamp).toDateString();

        if (lastDate !== messageDate) {
            items.push({
                id: `separator-${messageDate}`,
                type: DateSeparator,
                props: { date: new Date(message.timestamp) }
            });
            lastDate = messageDate;
        }

        items.push({
            id: message.id,
            type: MessageItem,
            props: { message, currentUser: currentUser.name },
            isDeleting: false
        });
    });

    return items;
});

const onEditMessage = (updatedMessage: Message) => {
    const index = props.messages.findIndex((msg) => msg.id === updatedMessage.id);
    if (index !== -1) {
        props.messages[index] = updatedMessage;
        chatStore.editMessage(updatedMessage);
    }
};

const onDeleteMessage = (message: Message) => {
    const item = messagesWithSeparators.value.find(m => m.id === message.id);
    if (item) {
        item.isDeleting = true;

        setTimeout(() => {
            const index = props.messages.findIndex(m => m.id === message.id);
            if (index !== -1) {
                props.messages.splice(index, 1);
            }
        }, 500);
    }
};
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;
@import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

.message-list {
    height: 100px;
    padding: $spacing-xl $spacing-xxl;

    &__empty {
        color: $color-gray-second;
        font-size: $font-size-lg;
    }

    &__scroller {
        height: 100%;
        padding: 0 $spacing-xl 0 0;
    }

    .deleting {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
}
</style>