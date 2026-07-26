import { describe, expect, it } from 'vitest';
import { seedStores } from '../../helpers/seedStores';

describe('useConversationsStore', () => {
    it('selects an available conversation and clears its unread count', () => {
        const { conversationsStore } = seedStores();
        const frontendChannel = conversationsStore.getConversationById('channel-frontend');

        expect(frontendChannel?.unreadCountByUserId['user-elena']).toBe(2);

        conversationsStore.selectConversation('channel-frontend');

        expect(conversationsStore.activeConversationId).toBe('channel-frontend');
        expect(frontendChannel?.unreadCountByUserId['user-elena']).toBe(0);
    });

    it('does not open a conversation unavailable to the current user', () => {
        const { conversationsStore } = seedStores({
            currentUserId: 'user-olivia',
            activeConversationId: 'channel-general',
        });

        conversationsStore.selectConversation('channel-frontend');

        expect(conversationsStore.activeConversationId).toBe('channel-general');
    });

    it('creates a channel with unique members and selects it', () => {
        const { conversationsStore } = seedStores();

        const channel = conversationsStore.createGroup('  Quality Guild  ', [
            'user-james',
            'user-james',
            'user-elena',
        ]);

        expect(channel.name).toBe('Quality Guild');
        expect(channel.participantIds).toEqual(['user-elena', 'user-james']);
        expect(channel.unreadCountByUserId).toEqual({
            'user-elena': 0,
            'user-james': 0,
        });
        expect(conversationsStore.activeConversationId).toBe(channel.id);
    });

    it('chooses the mock-bot conversation after switching to another user', () => {
        const { sessionStore, conversationsStore } = seedStores({
            activeConversationId: 'channel-frontend',
        });

        sessionStore.setCurrentUser('user-olivia');
        conversationsStore.ensureActiveConversationForCurrentUser();

        expect(conversationsStore.activeConversationId).toBe('direct-bot-olivia');
        expect(conversationsStore.activeConversation?.participantIds).toContain('user-olivia');
    });

    it('updates group members without allowing the current user to be removed', () => {
        const { conversationsStore } = seedStores();

        conversationsStore.addParticipants('group-launch-crew', ['user-noah']);
        conversationsStore.removeParticipant('group-launch-crew', 'user-james');
        conversationsStore.removeParticipant('group-launch-crew', 'user-elena');

        const group = conversationsStore.getConversationById('group-launch-crew');
        expect(group?.participantIds).toContain('user-noah');
        expect(group?.participantIds).not.toContain('user-james');
        expect(group?.participantIds).toContain('user-elena');
        expect(group?.unreadCountByUserId['user-james']).toBeUndefined();
    });
});
