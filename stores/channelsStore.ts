import { defineStore } from 'pinia';
import type { Channel } from '@/types/Channel';

export const useChannelsStore = defineStore('channelsStore', {
    state: () => ({
        channels: [] as Channel[],
        currentChannel: null as Channel | null,
    }),
    actions: {
        setChannels(channels: Channel[]) {
            this.channels = channels;
        },
        addChannel(channel: Channel) {
            this.channels.push(channel);
        },
        setCurrentChannel(channel: Channel) {
            this.currentChannel = channel;
        },
    },
});
