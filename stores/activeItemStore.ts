import { defineStore } from 'pinia';

export const useActiveItemStore = defineStore('activeItem', {
    state: () => ({
        activeId: null as string | number | null,
    }),
    actions: {
        setActiveId(id: string | number) {
            this.activeId = id;
        },
        clearActiveId() {
            this.activeId = null;
        },
    },
});