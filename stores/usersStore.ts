import { defineStore } from 'pinia';
import { useSessionStore } from '~/stores/sessionStore';
import type { User } from '~/types/User';

export const useUsersStore = defineStore('users', {
    state: () => ({
        users: [] as User[],
    }),

    getters: {
        getUserById: (state) => (userId: string) =>
            state.users.find((user) => user.id === userId) ?? null,

        currentUser(): User | null {
            const sessionStore = useSessionStore();
            return this.getUserById(sessionStore.currentUserId);
        },

        selectableUsers(): User[] {
            const sessionStore = useSessionStore();
            return this.users.filter(
                (user) => user.id !== sessionStore.currentUserId && user.id !== 'bot'
            );
        },
    },
});
