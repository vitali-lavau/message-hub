import { describe, expect, it, vi } from 'vitest';
import { seedStores } from '../../helpers/seedStores';

describe('useMessagesStore', () => {
    it('adds a message, updates the conversation preview and unread counters', () => {
        const { conversationsStore, messagesStore } = seedStores();

        const message = messagesStore.addMessage({
            conversationId: 'channel-general',
            authorId: 'user-elena',
            text: '  The quality checks are ready.  ',
        });
        const conversation = conversationsStore.getConversationById('channel-general');

        expect(message.text).toBe('The quality checks are ready.');
        expect(conversation?.lastMessageId).toBe(message.id);
        expect(conversation?.unreadCountByUserId['user-elena']).toBe(0);
        expect(conversation?.unreadCountByUserId['user-james']).toBe(2);
    });

    it('sends a message asynchronously and exposes the sending state', async () => {
        vi.useFakeTimers();
        const { messagesStore } = seedStores();

        const request = messagesStore.sendCurrentUserMessage('Async message');

        expect(messagesStore.isSendingInActiveConversation).toBe(true);
        await vi.advanceTimersByTimeAsync(320);
        const message = await request;

        expect(message?.authorId).toBe('user-elena');
        expect(message?.text).toBe('Async message');
        expect(messagesStore.isSendingInActiveConversation).toBe(false);
    });

    it('allows editing and deleting only the current user messages', () => {
        const { conversationsStore, messagesStore } = seedStores();

        messagesStore.editMessage('general-2', '  Updated by Elena  ');
        messagesStore.editMessage('general-1', 'Should not change');
        messagesStore.deleteMessage('general-1');

        expect(messagesStore.getMessageById('general-2')).toMatchObject({
            text: 'Updated by Elena',
        });
        expect(messagesStore.getMessageById('general-2')?.editedAt).toBeTruthy();
        expect(messagesStore.getMessageById('general-1')?.text).toBe(
            'Good morning! What is everyone focusing on today?'
        );

        messagesStore.deleteMessage('general-2');

        expect(messagesStore.getMessageById('general-2')).toBeNull();
        expect(conversationsStore.getConversationById('channel-general')?.lastMessageId).toBe(
            'general-3'
        );
    });

    it('toggles a reaction for the current user without duplicating it', () => {
        const { messagesStore } = seedStores();

        messagesStore.toggleReaction('general-3', '✅');
        messagesStore.toggleReaction('general-3', '✅');

        expect(messagesStore.getMessageById('general-3')?.reactions).toEqual([]);

        messagesStore.toggleReaction('general-2', '👍');

        expect(
            messagesStore
                .getMessageById('general-2')
                ?.reactions.find((reaction) => reaction.emoji === '👍')?.userIds
        ).toContain('user-elena');
    });
});
