import { useRuntimeConfig } from '#app';

export async function fetchChannelMessages(channelId: string, limit: number = 10, beforeMessageId?: string) {
    const config = useRuntimeConfig();

    const queryParams = new URLSearchParams();
    queryParams.append('limit', limit.toString());
    if (beforeMessageId) {
        queryParams.append('message_id', beforeMessageId);
    }

    const url = `${config.public.baseApiUrl}/api/messages/${channelId}?${queryParams.toString()}`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${config.public.userToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch messages for channel ${channelId}: ${response.statusText}`);
    }

    return await response.json();
}