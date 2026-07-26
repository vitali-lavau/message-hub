import { mountSuspended } from '@nuxt/test-utils/runtime';
import { describe, expect, it } from 'vitest';
import Avatar from '~/components/ui/Avatar.vue';

describe('Avatar', () => {
    it('renders initials and an accessible presence label without an image', async () => {
        const wrapper = await mountSuspended(Avatar, {
            props: {
                name: 'Liam Wilson',
                status: 'away',
            },
        });

        expect(wrapper.text()).toContain('LW');
        expect(wrapper.attributes('aria-label')).toBe('Liam Wilson, away');
        expect(wrapper.find('img').exists()).toBe(false);
        expect(wrapper.get('.avatar__status').classes()).toContain('avatar__status--away');
    });

    it('uses the user name as image alternative text', async () => {
        const wrapper = await mountSuspended(Avatar, {
            props: {
                name: 'Ava Garcia',
                imageUrl: '/images/users/ava.png',
                status: 'online',
            },
        });

        expect(wrapper.get('img').attributes('alt')).toBe('Ava Garcia');
    });
});
