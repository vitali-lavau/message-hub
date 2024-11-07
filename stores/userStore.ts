import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
    state: () => ({
        user: {
            id: '1',
            name: 'Rene Bohnsack',
            avatarUrl: '/images/users/rene.png'
        },
        isAuthenticated: true,
    }),

    getters: {
        getUserName: (state) => state.user.name,
    },
});
