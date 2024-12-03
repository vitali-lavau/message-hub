let socket: WebSocket | null = null;

export const getSocket = (): WebSocket | null => socket;

export function createWebSocketConnection(
    wsServerUrl: string,
    onOpen: () => void,
    onMessage: (event: MessageEvent) => void,
    onClose: (event: CloseEvent) => void
) {
    console.log('Создание WebSocket соединения...');
    socket = new WebSocket(wsServerUrl);

    socket.onopen = onOpen;
    socket.onmessage = onMessage;
    socket.onclose = onClose;
    socket.onerror = (error) => {
        console.error('WebSocket ошибка соединения:', error);
    };

    return socket;
}

export function reconnectWebSocket(wsServerUrl: string, reconnectCallback: () => void) {
    console.warn('WebSocket соединение потеряно. Переподключение...');
    setTimeout(() => {
        reconnectCallback();
    }, 5000);
}
