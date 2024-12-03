import { useRuntimeConfig } from '#app';

export async function fetchUserChannels() {
    const config = useRuntimeConfig();

    const url = `${config.public.baseApiUrl}/api/channels`;
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${config.public.userToken}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch user channels: ${response.statusText}`);
    }

    return await response.json();
}