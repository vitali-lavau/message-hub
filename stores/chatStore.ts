import { defineStore } from 'pinia';
import type { ChannelItemProps } from '~/types/ChannelItemProps';
import type { DirectMessageItemProps } from '~/types/DirectMessageItemProps';
import type { Message } from '~/types/Message';
import type { UploadedFile } from '~/types/UploadedFile';
import { fetchChannels, createChannel } from '~/services/channelService';
import { useUserStore } from './userStore';
import { messagesForUser1, messagesForOtherUsers } from '~/mocks/users';
import { messageHistory } from '~/mocks/messageHistory';
import { fetchBotResponse } from '~/services/chatGPTService';

export const useChatStore = defineStore('chat', {
    state: () => ({
        contacts: [] as DirectMessageItemProps[],
        messages: [] as Message[],
        channels: [] as ChannelItemProps[],
        activeMessageId: null as number | null,
        activeChatId: null as number | null,
        activeUserId: null as number | null,
        activeMessages: [] as Message[],
        searchQuery: '',
        botChatId: 9999, // Уникальный ID для чата с ботом
    }),

    getters: {
        filteredAndSortedContacts(state) {
            return [...state.contacts]
                .filter((contact) =>
                    contact.name.toLowerCase().includes(state.searchQuery.toLowerCase())
                )
                .sort((a, b) => (b.unreadCount || 0) - (a.unreadCount || 0));
        },
        activeChatMessages(state) {
            return state.messages.filter((message) => message.chatId === state.activeChatId);
        },
        activeUser(state) {
            return state.contacts.find((contact) => contact.id === state.activeUserId) || null;
        },
    },

    actions: {
        setActiveUser(userId: number) {
            this.activeUserId = userId;
        },

        setActiveChat(chatId: number) {
            this.activeChatId = chatId;
            this.loadMessagesForChat(chatId);
        },

        loadMessagesForChat(chatId: number) {
            this.activeMessages = messageHistory[chatId] || [];
        },

        setSearchQuery(query: string) {
            this.searchQuery = query;
        },

        loadUserMessages() {
            const userStore = useUserStore();
            const userId = userStore.user.id;
            this.contacts = userId === '1' ? messagesForUser1 : messagesForOtherUsers;
        },

        async loadUserChannels() {
            const userStore = useUserStore();
            const userId = userStore.user.id;
            this.channels = await fetchChannels(userId);
        },

        async createNewChannel(name: string, members: any[]) {
            try {
                const newChannel = await createChannel({ name, members });
                this.channels.push(newChannel);
            } catch (error) {
                console.error('Error creating channel:', error);
            }
        },

        editMessage(updatedMessage: Message) {
            const index = this.messages.findIndex(msg => msg.id === updatedMessage.id);
            if (index !== -1) {
                this.messages[index] = updatedMessage;
            }
        },

        deleteMessage(messageId: number) {
            this.messages = this.messages.filter(msg => msg.id !== messageId);
        },

        addMessage(content: string, files: UploadedFile[], sender: string) {
            const newMessage: Message = {
                id: Date.now(),
                sender,
                content,
                timestamp: new Date(),
                avatarUrl: '/images/users/rene.png',
                reactions: {},
                chatId: this.activeChatId as number,
            };
            this.messages.push(newMessage);
            this.activeMessages.push(newMessage);
        },

        async sendMessageToBot(userMessage: string) {
            // Добавляем сообщение пользователя в чат сразу
            const userMessageObject: Message = {
                id: Date.now(),
                sender: 'Rene Bohnsack',
                content: userMessage,
                timestamp: new Date(),
                avatarUrl: '/images/users/rene.png',
                reactions: {},
                chatId: this.botChatId,
            };
            this.messages.push(userMessageObject);
            this.activeMessages.push(userMessageObject);

            try {
                // Отправляем запрос к API без задержки
                const botReply = await fetchBotResponse(userMessage);

                // Добавляем ответ бота в чат
                const botMessageObject: Message = {
                    id: Date.now() + 1,
                    sender: 'Emily Clark',
                    content: botReply,
                    timestamp: new Date(),
                    avatarUrl: '/images/users/emily.png',
                    reactions: {},
                    chatId: this.botChatId,
                };
                this.messages.push(botMessageObject);
                this.activeMessages.push(botMessageObject);
            } catch (error) {
                console.error('Ошибка при запросе к OpenAI API:', error);

                // Добавляем сообщение об ошибке от бота
                const errorMessageObject: Message = {
                    id: Date.now() + 1,
                    sender: 'Emily Clark',
                    content: 'Извините, я не смог ответить на ваш вопрос.',
                    timestamp: new Date(),
                    avatarUrl: '/images/users/emily.png',
                    reactions: {},
                    chatId: this.botChatId,
                };
                this.messages.push(errorMessageObject);
                this.activeMessages.push(errorMessageObject);
            }
        }
    },
});