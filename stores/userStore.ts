import { defineStore } from 'pinia';
import type { User } from '~/types/user';

export const useUserStore = defineStore('user', {
    state: () => ({
        isAuthorized: false,
        token: '',
        user: null as User | null,
    }),
    actions: {
        setAuthorized(status: boolean) {
            this.isAuthorized = status;
        },
        setToken(token: string) {
            this.token = token;
        },
        setUser(user: User) {
            this.user = user;
        },
        clearUser() {
            this.isAuthorized = false;
            this.token = '';
            this.user = null;
        },
    },
});
