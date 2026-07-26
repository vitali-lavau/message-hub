<template>
    <div class="message-list flex items-center justify-center flex-1">
        <div v-if="!messages.length" class="message-list__empty">
            <span class="message-list__empty-icon" aria-hidden="true">💬</span>
            <strong>
                {{
                    conversationsStore.activeConversation
                        ? 'No messages yet'
                        : 'Choose a conversation'
                }}
            </strong>
            <span>
                {{
                    conversationsStore.activeConversation
                        ? 'Send the first message to start the conversation.'
                        : 'Select a channel or person from the sidebar.'
                }}
            </span>
        </div>

        <DynamicScroller
            v-else
            :key="listRevision"
            ref="scroller"
            :items="messagesWithSeparators"
            :key-field="'id'"
            class="message-list__scroller flex-1"
            :min-item-size="60"
        >
            <template #default="{ item, index, active }">
                <DynamicScrollerItem :item="item" :index="index" :active="active">
                    <component
                        :is="item.type"
                        v-bind="item.props"
                        :class="{
                            highlighted: item.props.message?.id === uiStore.highlightedMessageId,
                        }"
                        @edit-message="onEditMessage"
                        @delete-message="onDeleteMessage"
                        @toggle-reaction="onToggleReaction"
                    />
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>

        <ConfirmDeleteMessage
            :open="Boolean(pendingDeleteMessageId)"
            @cancel="pendingDeleteMessageId = null"
            @confirm="confirmDelete"
        />
    </div>
</template>

<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import MessageItem from './MessageItem.vue';
import DateSeparator from '~/components/ui/DateSeparator.vue';
import type { Message } from '~/types/Message';
import type { MessageItemWithSeparator } from '~/types/MessageItemWithSeparator';
import { useMessagesStore } from '~/stores/messagesStore';
import { useUiStore } from '~/stores/uiStore';
import { useConversationsStore } from '~/stores/conversationsStore';
import ConfirmDeleteMessage from '~/components/modals/ConfirmDeleteMessage.vue';

const messagesStore = useMessagesStore();
const uiStore = useUiStore();
const conversationsStore = useConversationsStore();
const pendingDeleteMessageId = ref<string | null>(null);
const scroller = ref<InstanceType<typeof DynamicScroller> | null>(null);
const listRevision = ref(0);
let highlightTimer: ReturnType<typeof setTimeout> | null = null;

const props = defineProps<{
    messages: readonly Message[];
}>();

const messagesWithSeparators = computed((): MessageItemWithSeparator[] => {
    const items: MessageItemWithSeparator[] = [];
    let lastDate: string | null = null;

    props.messages.forEach((message) => {
        const messageDate = new Date(message.createdAt).toDateString();

        if (lastDate !== messageDate) {
            items.push({
                id: `separator-${messageDate}`,
                type: DateSeparator,
                props: { date: new Date(message.createdAt) },
            });
            lastDate = messageDate;
        }

        items.push({
            id: message.id,
            type: MessageItem,
            props: { message },
        });
    });

    return items;
});

const onEditMessage = (payload: { messageId: string; text: string }) => {
    messagesStore.editMessage(payload.messageId, payload.text);
    uiStore.addNotification('Message updated', 'success');
};

const onDeleteMessage = (messageId: string) => {
    pendingDeleteMessageId.value = messageId;
};

const confirmDelete = () => {
    const messageId = pendingDeleteMessageId.value;

    if (!messageId) {
        return;
    }

    pendingDeleteMessageId.value = null;
    messagesStore.deleteMessage(messageId);
    listRevision.value += 1;
    uiStore.addNotification('Message deleted', 'info');
};

const onToggleReaction = (payload: { messageId: string; emoji: string }) => {
    messagesStore.toggleReaction(payload.messageId, payload.emoji);
};

watch(
    () => [conversationsStore.activeConversationId, props.messages.at(-1)?.id],
    async () => {
        if (uiStore.highlightedMessageId || !messagesWithSeparators.value.length) {
            return;
        }

        await scrollToBottom();
    },
    { immediate: true, flush: 'post' }
);

async function scrollToBottom() {
    await nextTick();
    const lastItemIndex = messagesWithSeparators.value.length - 1;

    if (lastItemIndex < 0) {
        return;
    }

    scroller.value?.scrollToItem(lastItemIndex);
    requestAnimationFrame(() => {
        scroller.value?.scrollToItem(lastItemIndex);
        requestAnimationFrame(() => {
            scroller.value?.scrollToItem(lastItemIndex);
        });
    });
}

watch(
    () => uiStore.highlightedMessageId,
    async (messageId) => {
        if (!messageId) {
            return;
        }

        await nextTick();
        const index = messagesWithSeparators.value.findIndex(
            (item) => item.props.message?.id === messageId
        );

        if (index >= 0) {
            scroller.value?.scrollToItem(index);
        }

        if (highlightTimer) {
            clearTimeout(highlightTimer);
        }

        highlightTimer = setTimeout(() => {
            uiStore.clearHighlightedMessage();
            highlightTimer = null;
        }, 2200);
    },
    { flush: 'post' }
);

onBeforeUnmount(() => {
    if (highlightTimer) {
        clearTimeout(highlightTimer);
    }
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;
@import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

.message-list {
    height: 100px;
    min-height: 0;
    padding: $spacing-xl $spacing-xxl;

    &__empty {
        max-width: 360px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: $spacing-xs;
        text-align: center;
        color: $color-gray-second;

        strong {
            color: $color-text;
            font-size: $font-size-lg;
        }
    }

    &__empty-icon {
        margin-bottom: $spacing-sm;
        font-size: 32px;
    }

    &__scroller {
        height: 100%;
        padding: 0 $spacing-xl 0 0;
    }

    .highlighted {
        animation: highlight-message 2.2s ease;
    }
}

@keyframes highlight-message {
    0%,
    35% {
        filter: drop-shadow(0 0 8px rgba(79, 70, 229, 0.65));
        transform: translateX(4px);
    }

    100% {
        filter: none;
        transform: none;
    }
}

@media (max-width: 1023px) {
    .message-list {
        padding: $spacing-lg;
    }
}

@media (max-width: 767px) {
    .message-list {
        padding: $spacing-m;

        &__scroller {
            padding-right: $spacing-sm;
            scrollbar-width: none;

            &::-webkit-scrollbar {
                display: none;
            }
        }
    }
}
</style>
