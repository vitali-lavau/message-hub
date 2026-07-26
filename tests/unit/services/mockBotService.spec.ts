import { afterEach, describe, expect, it, vi } from 'vitest';
import { getMockBotResponse } from '~/services/mockBotService';

describe('mockBotService', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it('returns a keyword response after the configured delay', async () => {
        vi.useFakeTimers();

        const request = getMockBotResponse('Which technologies are in the stack?');
        await vi.advanceTimersByTimeAsync(700);

        await expect(request).resolves.toContain('Nuxt 3');
    });

    it('returns the same fallback for the same message', async () => {
        vi.useFakeTimers();

        const firstRequest = getMockBotResponse('A message without known keywords');
        const secondRequest = getMockBotResponse('A message without known keywords');
        await vi.advanceTimersByTimeAsync(700);

        await expect(firstRequest).resolves.toBe(await secondRequest);
    });
});
