import { defineStore } from 'pinia';

export const useParticipantsStore = defineStore('participants', {
    state: () => ({
        participants: [] as { name: string; avatarUrl: string }[],
    }),
    actions: {
        setParticipants(newParticipants: { name: string; avatarUrl: string }[]) {
            this.participants = newParticipants;
        },
    },
});