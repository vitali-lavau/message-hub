import { defineStore } from 'pinia';

export const useSessionStore = defineStore('session', {
    state: () => ({
        currentUserId: '',
    }),

    actions: {
        setCurrentUser(userId: string) {
            this.currentUserId = userId;
        },
    },
});
