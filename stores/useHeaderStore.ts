import { defineStore } from 'pinia';

export const useHeaderStore = defineStore('header', {
    state: () => ({
        title: 'No User Selected',
    }),
    actions: {
        setTitle(newTitle: string) {
            this.title = newTitle;
        },
    },
});
