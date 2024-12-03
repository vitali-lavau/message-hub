import { getSocket } from '@/services/websocketService';
import { useUserStore } from '@/stores/userStore';

export const authorizeUser = (token: string) => {
    const socket = getSocket();
    const userStore = useUserStore();

    if (!socket) {
        console.error('WebSocket is not connected');
        return;
    }

    const payload = {
        type: 'authorize',
        body: { token },
    };

    console.log('Send an authorization request:', payload);
    userStore.setToken(token);
    socket.send(JSON.stringify(payload));
};

export const sendMessage = (channelId: string, text: string) => {
    const socket = getSocket();

    if (!socket) {
        console.error('WebSocket is not connected');
        return;
    }

    const payload = {
        type: 'send_message',
        body: {
            channel_id: channelId,
            text: text,
        },
    };

    console.log('Sending message:', payload);
    socket.send(JSON.stringify(payload));
};