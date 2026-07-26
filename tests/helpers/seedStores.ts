import { createPinia, setActivePinia } from 'pinia';
import { initialConversations } from '~/mocks/conversations';
import { initialMessages } from '~/mocks/messages';
import { initialUsers } from '~/mocks/users';
import { useConversationsStore } from '~/stores/conversationsStore';
import { useMessagesStore } from '~/stores/messagesStore';
import { useSessionStore } from '~/stores/sessionStore';
import { useUsersStore } from '~/stores/usersStore';

interface SeedStoreOptions {
    currentUserId?: string;
    activeConversationId?: string;
}

export function seedStores(options: SeedStoreOptions = {}) {
    setActivePinia(createPinia());

    const sessionStore = useSessionStore();
    const usersStore = useUsersStore();
    const conversationsStore = useConversationsStore();
    const messagesStore = useMessagesStore();

    sessionStore.currentUserId = options.currentUserId ?? 'user-elena';
    usersStore.users = structuredClone(initialUsers);
    conversationsStore.conversations = structuredClone(initialConversations);
    conversationsStore.activeConversationId = options.activeConversationId ?? 'channel-general';
    messagesStore.messages = structuredClone(initialMessages);

    return {
        sessionStore,
        usersStore,
        conversationsStore,
        messagesStore,
    };
}
