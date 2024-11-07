import type {Channel} from '~/types/Channel';
import {channelsForOtherUsers, channelsForUser1} from '~/mocks/channels';

export async function fetchChannels(userId: string): Promise<Channel[]> {
    return new Promise((resolve) => {
        resolve(userId === '1' ? channelsForUser1 : channelsForOtherUsers);
    });
}

export async function createChannel(channelData: { name: string, members: any[] }): Promise<Channel> {
    return {
        id: Number(Date.now()),
        name: channelData.name,
        members: channelData.members,
    };
}
