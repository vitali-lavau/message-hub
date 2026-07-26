import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it, vi } from 'vitest';
import ReactionButton from '~/components/ui/ReactionButton.vue';

describe('ReactionButton', () => {
    it('communicates selected state and emits an interaction', async () => {
        vi.useFakeTimers();
        const wrapper = await mountSuspended(ReactionButton, {
            props: {
                emoji: '🚀',
                count: 3,
                selected: true,
            },
        });
        const button = wrapper.get('button');

        expect(button.attributes('aria-pressed')).toBe('true');
        expect(button.attributes('aria-label')).toBe('Remove 🚀 reaction, 3');

        await button.trigger('click');

        expect(wrapper.emitted('click')).toHaveLength(1);
        expect(button.classes()).toContain('heartbeat');

        await vi.advanceTimersByTimeAsync(500);
        expect(button.classes()).not.toContain('heartbeat');
    });
});
