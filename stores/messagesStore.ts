import { defineStore } from 'pinia';
import { getMockBotResponse } from '~/services/mockBotService';
import { useConversationsStore } from '~/stores/conversationsStore';
import { useSessionStore } from '~/stores/sessionStore';
import type { Attachment } from '~/types/Attachment';
import type { Message } from '~/types/Message';
import { createId } from '~/utils/createId';
import { MAX_MESSAGE_LENGTH } from '~/utils/demoLimits';

const MOCK_SEND_DELAY = 320;

export const useMessagesStore = defineStore('messages', {
    state: () => ({
        messages: [] as Message[],
        botTypingConversationIds: [] as string[],
        sendingConversationIds: [] as string[],
    }),

    getters: {
        activeConversationMessages(state): Message[] {
            const conversationsStore = useConversationsStore();
            const conversationId = conversationsStore.activeConversationId;

            if (!conversationId) {
                return [];
            }

            return state.messages
                .filter((message) => message.conversationId === conversationId)
                .sort(
                    (first, second) =>
                        new Date(first.createdAt).getTime() - new Date(second.createdAt).getTime()
                );
        },

        getMessagesByConversation:
            (state) =>
            (conversationId: string): Message[] =>
                state.messages
                    .filter((message) => message.conversationId === conversationId)
                    .sort(
                        (first, second) =>
                            new Date(first.createdAt).getTime() -
                            new Date(second.createdAt).getTime()
                    ),

        getMessageById:
            (state) =>
            (messageId?: string): Message | null =>
                messageId
                    ? (state.messages.find((message) => message.id === messageId) ?? null)
                    : null,

        isBotTypingInActiveConversation(): boolean {
            const conversationsStore = useConversationsStore();
            const conversationId = conversationsStore.activeConversationId;
            return Boolean(
                conversationId && this.botTypingConversationIds.includes(conversationId)
            );
        },

        isSendingInActiveConversation(): boolean {
            const conversationsStore = useConversationsStore();
            const conversationId = conversationsStore.activeConversationId;
            return Boolean(conversationId && this.sendingConversationIds.includes(conversationId));
        },
    },

    actions: {
        addMessage(input: {
            conversationId: string;
            authorId: string;
            text: string;
            attachments?: Attachment[];
        }): Message {
            const conversationsStore = useConversationsStore();
            const message: Message = {
                id: createId('message'),
                conversationId: input.conversationId,
                authorId: input.authorId,
                text: input.text.trim(),
                createdAt: new Date().toISOString(),
                attachments: (input.attachments ?? []).map((attachment) => ({ ...attachment })),
                reactions: [],
            };

            this.messages.push(message);
            conversationsStore.updateLastMessage(message.conversationId, message.id);

            const conversation = conversationsStore.getConversationById(message.conversationId);
            const sessionStore = useSessionStore();

            conversation?.participantIds.forEach((participantId) => {
                if (participantId === message.authorId) {
                    return;
                }

                const isViewingConversation =
                    participantId === sessionStore.currentUserId &&
                    conversationsStore.activeConversationId === message.conversationId;

                if (!isViewingConversation) {
                    conversation.unreadCountByUserId[participantId] =
                        (conversation.unreadCountByUserId[participantId] ?? 0) + 1;
                }
            });

            return message;
        },

        async sendCurrentUserMessage(
            text: string,
            attachments: Attachment[] = []
        ): Promise<Message | null> {
            const conversationsStore = useConversationsStore();
            const sessionStore = useSessionStore();
            const conversation = conversationsStore.activeConversation;
            const normalizedText = text.trim();

            if (
                !conversation ||
                (!normalizedText && attachments.length === 0) ||
                normalizedText.length > MAX_MESSAGE_LENGTH ||
                this.sendingConversationIds.includes(conversation.id)
            ) {
                return null;
            }

            const conversationId = conversation.id;
            const authorId = sessionStore.currentUserId;
            this.sendingConversationIds.push(conversationId);
            let sentMessage: Message;

            try {
                await new Promise((resolve) => setTimeout(resolve, MOCK_SEND_DELAY));
                sentMessage = this.addMessage({
                    conversationId,
                    authorId,
                    text: normalizedText,
                    attachments,
                });
            } finally {
                this.sendingConversationIds = this.sendingConversationIds.filter(
                    (id) => id !== conversationId
                );
            }

            const isBotConversation =
                conversation.type === 'direct' && conversation.participantIds.includes('bot');

            if (!isBotConversation || !normalizedText) {
                return sentMessage;
            }

            this.botTypingConversationIds.push(conversationId);

            try {
                const response = await getMockBotResponse(normalizedText);
                this.addMessage({
                    conversationId,
                    authorId: 'bot',
                    text: response,
                });
            } finally {
                this.botTypingConversationIds = this.botTypingConversationIds.filter(
                    (id) => id !== conversationId
                );
            }

            return sentMessage;
        },

        editMessage(messageId: string, text: string) {
            const sessionStore = useSessionStore();
            const message = this.messages.find((item) => item.id === messageId);

            if (
                !message ||
                message.authorId !== sessionStore.currentUserId ||
                !text.trim() ||
                text.trim().length > MAX_MESSAGE_LENGTH
            ) {
                return;
            }

            message.text = text.trim();
            message.editedAt = new Date().toISOString();
        },

        deleteMessage(messageId: string) {
            const sessionStore = useSessionStore();
            const conversationsStore = useConversationsStore();
            const message = this.messages.find((item) => item.id === messageId);

            if (!message || message.authorId !== sessionStore.currentUserId) {
                return;
            }

            this.messages = this.messages.filter((item) => item.id !== messageId);
            const remainingMessages = this.getMessagesByConversation(message.conversationId);
            conversationsStore.updateLastMessage(
                message.conversationId,
                remainingMessages.at(-1)?.id
            );
        },

        toggleReaction(messageId: string, emoji: string) {
            const sessionStore = useSessionStore();
            const message = this.messages.find((item) => item.id === messageId);

            if (!message) {
                return;
            }

            const reaction = message.reactions.find((item) => item.emoji === emoji);

            if (!reaction) {
                message.reactions.push({
                    emoji,
                    userIds: [sessionStore.currentUserId],
                });
                return;
            }

            if (reaction.userIds.includes(sessionStore.currentUserId)) {
                reaction.userIds = reaction.userIds.filter(
                    (userId) => userId !== sessionStore.currentUserId
                );

                if (reaction.userIds.length === 0) {
                    message.reactions = message.reactions.filter((item) => item.emoji !== emoji);
                }
            } else {
                reaction.userIds.push(sessionStore.currentUserId);
            }
        },
    },
});
