import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import ChannelItem from '~/components/sidebar/ChannelItem.vue';

describe('ChannelItem', () => {
    it('exposes active and unread state accessibly and emits the selected id', async () => {
        const wrapper = await mountSuspended(ChannelItem, {
            props: {
                id: 'channel-frontend',
                name: 'Frontend Team',
                lastMessage: 'The test suite is ready.',
                lastMessageTime: '10:24',
                unreadCount: 2,
                isActive: true,
            },
        });
        const button = wrapper.get('button');

        expect(button.attributes('aria-current')).toBe('true');
        expect(button.attributes('aria-label')).toBe('Frontend Team, 2 unread');
        expect(wrapper.text()).toContain('# Frontend Team');
        expect(wrapper.text()).toContain('The test suite is ready.');

        await button.trigger('click');

        expect(wrapper.emitted('select')).toEqual([['channel-frontend']]);
    });
});
