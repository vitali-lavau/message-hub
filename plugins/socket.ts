import { defineNuxtPlugin } from '#app';
import { createWebSocketConnection, reconnectWebSocket, getSocket } from '@/services/websocketService';
import { handleWebSocketMessage } from '@/services/websocketMessageHandler';
import { authorizeUser } from '@/services/socketAuthService';

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const wsServerUrl = config.public.wsServerUrl;
    const userToken = config.public.userToken;

    const connect = () => {
        createWebSocketConnection(
            wsServerUrl,
            () => {
                console.log('WebSocket успешно подключён');
                authorizeUser(userToken);
            },
            handleWebSocketMessage,
            (event) => {
                console.warn('WebSocket соединение закрыто:', event.reason);
                reconnectWebSocket(wsServerUrl, connect);
            }
        );
    };

    connect();

    return {
        provide: {
            socket: getSocket(),
        },
    };
});