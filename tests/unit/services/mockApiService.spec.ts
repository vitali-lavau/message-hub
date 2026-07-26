import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { initialMessages } from '~/mocks/messages';
import {
    fetchDemoData,
    MockApiError,
    resetDemoData,
    saveDemoData,
} from '~/services/mockApiService';

async function finishRequest<T>(request: Promise<T>): Promise<T> {
    await vi.advanceTimersByTimeAsync(500);
    return request;
}

describe('mockApiService', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.useFakeTimers();
        vi.spyOn(Math, 'random').mockReturnValue(0);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it('seeds localStorage on first load and restores saved data', async () => {
        const seed = await finishRequest(fetchDemoData());
        seed.currentUserId = 'user-james';

        await finishRequest(saveDemoData(seed));
        const restored = await finishRequest(fetchDemoData());

        expect(restored.currentUserId).toBe('user-james');
        expect(restored.users.length).toBeGreaterThan(8);
        const primaryDemoUser = restored.users.find((user) => user.id === 'user-elena');
        expect(primaryDemoUser).toMatchObject({
            id: 'user-elena',
            name: 'Elena Novak',
        });
        expect(primaryDemoUser?.avatarUrl).toBeUndefined();
    });

    it('removes temporary blob URLs before persisting attachments', async () => {
        const data = await finishRequest(fetchDemoData());
        data.messages.push({
            id: 'message-with-local-file',
            conversationId: 'channel-general',
            authorId: 'user-elena',
            text: '',
            createdAt: new Date().toISOString(),
            attachments: [
                {
                    id: 'local-attachment',
                    name: 'preview.png',
                    size: 128,
                    type: 'image/png',
                    previewUrl: 'blob:http://localhost/local-preview',
                },
            ],
            reactions: [],
        });

        await finishRequest(saveDemoData(data));
        const restored = await finishRequest(fetchDemoData());
        const attachment = restored.messages
            .find((message) => message.id === 'message-with-local-file')
            ?.attachments.at(0);

        expect(attachment?.previewUrl).toBeUndefined();
        expect(attachment?.name).toBe('preview.png');
    });

    it('can simulate recoverable request failures', async () => {
        const request = fetchDemoData({ forceError: true });
        const assertion = expect(request).rejects.toBeInstanceOf(MockApiError);

        await vi.advanceTimersByTimeAsync(500);
        await assertion;
    });

    it('resets modified data to the original seed', async () => {
        const data = await finishRequest(fetchDemoData());
        data.messages = [];
        await finishRequest(saveDemoData(data));

        const reset = await finishRequest(resetDemoData());

        expect(reset.currentUserId).toBe('user-elena');
        expect(reset.activeConversationId).toBe('direct-bot-elena');
        expect(reset.messages).toHaveLength(initialMessages.length);
    });
});
