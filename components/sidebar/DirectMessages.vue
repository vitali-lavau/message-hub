<template>
    <div class="direct-messages">
        <div class="direct-messages__head flex items-center justify-between">
            <h2 class="direct-messages__title subtitle">Conversations</h2>
            <ButtonAddDirectMessage @click="openModal" />
        </div>

        <div class="direct-messages__list">
            <p v-if="!filteredConversationItems.length" class="direct-messages__empty">
                {{
                    uiStore.searchQuery.trim()
                        ? 'No matching conversations'
                        : 'No conversations yet. Start one with +.'
                }}
            </p>
            <DirectMessageItem
                v-for="item in filteredConversationItems"
                :id="item.conversation.id"
                :key="item.conversation.id"
                :name="item.name"
                :avatar-url="item.avatarUrl"
                :status="item.status"
                :subtitle="item.subtitle"
                :last-message-time="item.lastMessageTime"
                :unread-count="conversationsStore.getUnreadCount(item.conversation)"
                :is-active="conversationsStore.activeConversationId === item.conversation.id"
                @select="selectConversation"
            />
        </div>

        <ModalBase
            :open="uiStore.isNewDirectModalOpen"
            :show-header="false"
            :show-body="true"
            :show-footer="false"
            :body-margin-bottom="0"
            @close="closeModal"
        >
            <template #body>
                <WriteTo @conversation-selected="emit('conversation-selected')" />
            </template>
        </ModalBase>
    </div>
</template>

<script setup lang="ts">
import DirectMessageItem from '~/components/sidebar/DirectMessageItem.vue';
import ButtonAddDirectMessage from '~/components/ui/ButtonAddDirectMessage.vue';
import ModalBase from '~/components/modals/ModalBase.vue';
import WriteTo from '~/components/modals/WriteTo.vue';
import { useConversationsStore } from '~/stores/conversationsStore';
import { useUiStore } from '~/stores/uiStore';
import { useUsersStore } from '~/stores/usersStore';
import type { Conversation } from '~/types/Conversation';
import type { UserStatus } from '~/types/User';
import { useMessagesStore } from '~/stores/messagesStore';
import { formatConversationTime, getMessagePreview } from '~/utils/conversationPreview';

interface ConversationListItem {
    conversation: Conversation;
    name: string;
    avatarUrl?: string;
    status?: UserStatus;
    subtitle: string;
    lastMessageTime: string;
}

const conversationsStore = useConversationsStore();
const uiStore = useUiStore();
const usersStore = useUsersStore();
const messagesStore = useMessagesStore();
const emit = defineEmits<{
    (event: 'conversation-selected'): void;
}>();

const conversationItems = computed((): ConversationListItem[] => {
    const directItems = conversationsStore.directConversations.flatMap((conversation) => {
        const participantId = conversationsStore.getOtherParticipantId(conversation);
        const user = participantId ? usersStore.getUserById(participantId) : null;

        if (!user) {
            return [];
        }

        return [
            {
                conversation,
                name: user.name,
                avatarUrl: user.avatarUrl,
                status: user.status,
                subtitle: conversation.lastMessageId
                    ? getMessagePreview(messagesStore.getMessageById(conversation.lastMessageId))
                    : user.role,
                lastMessageTime: formatConversationTime(
                    messagesStore.getMessageById(conversation.lastMessageId)?.createdAt
                ),
            },
        ];
    });

    const privateGroupItems = conversationsStore.privateGroupConversations.map((conversation) => ({
        conversation,
        name: conversation.name ?? 'Untitled group',
        subtitle: conversation.lastMessageId
            ? getMessagePreview(messagesStore.getMessageById(conversation.lastMessageId))
            : `${conversation.participantIds.length} members`,
        lastMessageTime: formatConversationTime(
            messagesStore.getMessageById(conversation.lastMessageId)?.createdAt
        ),
    }));

    return [...privateGroupItems, ...directItems].sort(
        (first, second) =>
            conversationsStore.getUnreadCount(second.conversation) -
            conversationsStore.getUnreadCount(first.conversation)
    );
});

const filteredConversationItems = computed(() => {
    const searchQuery = uiStore.searchQuery.toLowerCase();
    return conversationItems.value.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery) ||
            item.subtitle.toLowerCase().includes(searchQuery)
    );
});

function openModal() {
    uiStore.openNewDirectModal();
}

function closeModal() {
    uiStore.closeNewDirectModal();
}

function selectConversation(conversationId: string) {
    conversationsStore.selectConversation(conversationId);
    emit('conversation-selected');
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.direct-messages {
    &__head {
        margin: 0 0 $spacing-m;
    }

    &__list {
        min-width: 0;

        .direct-message-item {
            margin: 0 0 $spacing-sm;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    &__empty {
        margin: 0;
        color: $color-gray-second;
        font-size: $font-size-sm;
    }
}
</style>
