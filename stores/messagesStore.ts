import { defineStore } from 'pinia';
import type { Message } from '~/types/Message';
import { fetchChannelMessages } from '~/api/messages';

export const useMessagesStore = defineStore('messages', {
    state: () => ({
        messages: {} as { [channelId: string]: Array<Message> },
        currentChannelId: null as string | null,
    }),
    getters: {
        currentMessages: (state) => {
            if (!state.currentChannelId) return [];
            const channelMessages = state.messages[state.currentChannelId] || [];
            return channelMessages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        },
    },
    actions: {
        setCurrentChannel(channelId: string) {
            this.currentChannelId = channelId;
        },
        addMessage(message: Message) {
            if (!this.messages[message.channelId]) {
                this.messages[message.channelId] = [];
            }
            this.messages[message.channelId].push(message);
        },
        setMessages(channelId: string, messages: Array<Message>) {
            this.messages[channelId] = messages.map((message) => ({
                ...message,
                createdAt: message.created_at || message.createdAt,
            }));
        },
        async loadMessages(channelId: string, limit: number = 10, beforeMessageId?: string) {
            try {
                const messages = await fetchChannelMessages(channelId, limit, beforeMessageId);
                this.setMessages(channelId, messages);
                console.log(`Сообщения для канала ${channelId} загружены.`, messages);
            } catch (error) {
                console.error('Ошибка загрузки сообщений:', error);
            }
        },
    },
});
