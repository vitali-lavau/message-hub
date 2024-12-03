import {defineStore} from 'pinia';
import type {DirectChannel} from "~/types/directChannel";

export const useDirectsStore = defineStore('directsStore', {
    state: () => ({
        directs: [] as DirectChannel[],
        currentDirect: null as DirectChannel | null,
    }),
    actions: {
        setDirects(directs: DirectChannel[]) {
            this.directs = directs;
        },
        addDirect(direct: DirectChannel) {
            this.directs.push(direct);
        },
        setCurrentDirect(direct: DirectChannel) {
            this.currentDirect = direct;
        }
    },
});
