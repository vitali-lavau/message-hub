import { defineStore } from 'pinia';
import { useSessionStore } from '~/stores/sessionStore';
import { useUsersStore } from '~/stores/usersStore';
import type { Conversation } from '~/types/Conversation';
import { createId } from '~/utils/createId';

export const useConversationsStore = defineStore('conversations', {
    state: () => ({
        conversations: [] as Conversation[],
        activeConversationId: null as string | null,
    }),

    getters: {
        activeConversation(state): Conversation | null {
            const sessionStore = useSessionStore();
            return (
                state.conversations.find(
                    (conversation) =>
                        conversation.id === state.activeConversationId &&
                        conversation.participantIds.includes(sessionStore.currentUserId)
                ) ?? null
            );
        },

        directConversations(state): Conversation[] {
            const sessionStore = useSessionStore();
            return state.conversations
                .filter(
                    (conversation) =>
                        conversation.type === 'direct' &&
                        conversation.participantIds.includes(sessionStore.currentUserId)
                )
                .sort(
                    (first, second) =>
                        (second.unreadCountByUserId[sessionStore.currentUserId] ?? 0) -
                        (first.unreadCountByUserId[sessionStore.currentUserId] ?? 0)
                );
        },

        channelConversations(state): Conversation[] {
            const sessionStore = useSessionStore();
            return state.conversations.filter(
                (conversation) =>
                    conversation.type === 'group' &&
                    conversation.groupKind === 'channel' &&
                    conversation.participantIds.includes(sessionStore.currentUserId)
            );
        },

        privateGroupConversations(state): Conversation[] {
            const sessionStore = useSessionStore();
            return state.conversations.filter(
                (conversation) =>
                    conversation.type === 'group' &&
                    conversation.groupKind === 'private' &&
                    conversation.participantIds.includes(sessionStore.currentUserId)
            );
        },

        availableConversations(state): Conversation[] {
            const sessionStore = useSessionStore();
            return state.conversations.filter((conversation) =>
                conversation.participantIds.includes(sessionStore.currentUserId)
            );
        },

        getConversationById: (state) => (conversationId: string) =>
            state.conversations.find((conversation) => conversation.id === conversationId) ?? null,

        getOtherParticipantId:
            () =>
            (conversation: Conversation): string | null => {
                const sessionStore = useSessionStore();
                return (
                    conversation.participantIds.find(
                        (participantId) => participantId !== sessionStore.currentUserId
                    ) ?? null
                );
            },

        getUnreadCount:
            () =>
            (conversation: Conversation): number => {
                const sessionStore = useSessionStore();
                return conversation.unreadCountByUserId[sessionStore.currentUserId] ?? 0;
            },

        getConversationTitle(): (conversation: Conversation | null) => string {
            const usersStore = useUsersStore();

            return (conversation: Conversation | null) => {
                if (!conversation) {
                    return 'Select a conversation';
                }

                if (conversation.type === 'group') {
                    return conversation.name ?? 'Untitled group';
                }

                const participantId = this.getOtherParticipantId(conversation);
                return participantId
                    ? (usersStore.getUserById(participantId)?.name ?? 'Unknown user')
                    : 'Direct message';
            };
        },
    },

    actions: {
        selectConversation(conversationId: string) {
            const sessionStore = useSessionStore();
            const conversation = this.conversations.find((item) => item.id === conversationId);

            if (
                !conversation ||
                !conversation.participantIds.includes(sessionStore.currentUserId)
            ) {
                return;
            }

            this.activeConversationId = conversationId;
            conversation.unreadCountByUserId[sessionStore.currentUserId] = 0;
        },

        ensureActiveConversationForCurrentUser() {
            const sessionStore = useSessionStore();
            const activeConversation = this.conversations.find(
                (conversation) =>
                    conversation.id === this.activeConversationId &&
                    conversation.participantIds.includes(sessionStore.currentUserId)
            );

            if (activeConversation) {
                this.selectConversation(activeConversation.id);
                return;
            }

            const botConversation = this.conversations.find(
                (conversation) =>
                    conversation.type === 'direct' &&
                    conversation.participantIds.includes(sessionStore.currentUserId) &&
                    conversation.participantIds.includes('bot')
            );
            const fallbackConversation = this.conversations.find((conversation) =>
                conversation.participantIds.includes(sessionStore.currentUserId)
            );
            const nextConversation = botConversation ?? fallbackConversation;

            this.activeConversationId = null;

            if (nextConversation) {
                this.selectConversation(nextConversation.id);
            }
        },

        createGroup(
            name: string,
            participantIds: string[],
            groupKind: 'channel' | 'private' = 'channel'
        ): Conversation {
            const sessionStore = useSessionStore();
            const uniqueParticipantIds = Array.from(
                new Set([sessionStore.currentUserId, ...participantIds])
            );
            const conversation: Conversation = {
                id: createId('group'),
                type: 'group',
                groupKind,
                name: name.trim(),
                participantIds: uniqueParticipantIds,
                unreadCountByUserId: Object.fromEntries(
                    uniqueParticipantIds.map((userId) => [userId, 0])
                ),
            };

            this.conversations.push(conversation);
            this.selectConversation(conversation.id);
            return conversation;
        },

        findOrCreateDirect(userId: string): Conversation {
            const sessionStore = useSessionStore();
            const existingConversation = this.conversations.find(
                (conversation) =>
                    conversation.type === 'direct' &&
                    conversation.participantIds.includes(sessionStore.currentUserId) &&
                    conversation.participantIds.includes(userId)
            );

            if (existingConversation) {
                this.selectConversation(existingConversation.id);
                return existingConversation;
            }

            const conversation: Conversation = {
                id: createId('direct'),
                type: 'direct',
                participantIds: [sessionStore.currentUserId, userId],
                unreadCountByUserId: {
                    [sessionStore.currentUserId]: 0,
                    [userId]: 0,
                },
            };

            this.conversations.push(conversation);
            this.selectConversation(conversation.id);
            return conversation;
        },

        updateLastMessage(conversationId: string, messageId?: string) {
            const conversation = this.conversations.find((item) => item.id === conversationId);

            if (conversation) {
                conversation.lastMessageId = messageId;
            }
        },

        addParticipants(conversationId: string, participantIds: string[]) {
            const sessionStore = useSessionStore();
            const conversation = this.conversations.find((item) => item.id === conversationId);

            if (
                !conversation ||
                conversation.type !== 'group' ||
                !conversation.participantIds.includes(sessionStore.currentUserId)
            ) {
                return;
            }

            participantIds.forEach((participantId) => {
                if (conversation.participantIds.includes(participantId)) {
                    return;
                }

                conversation.participantIds.push(participantId);
                conversation.unreadCountByUserId[participantId] = 0;
            });
        },

        removeParticipant(conversationId: string, participantId: string) {
            const sessionStore = useSessionStore();
            const conversation = this.conversations.find((item) => item.id === conversationId);

            if (
                !conversation ||
                conversation.type !== 'group' ||
                participantId === sessionStore.currentUserId ||
                !conversation.participantIds.includes(sessionStore.currentUserId)
            ) {
                return;
            }

            conversation.participantIds = conversation.participantIds.filter(
                (userId) => userId !== participantId
            );
            conversation.unreadCountByUserId = Object.fromEntries(
                Object.entries(conversation.unreadCountByUserId).filter(
                    ([userId]) => userId !== participantId
                )
            );
        },
    },
});
