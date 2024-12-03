import { getSocket } from '@/services/websocketService';

export function createChannel(name: string, type: string, users: string[]) {
    const socket = getSocket();

    if (!socket || socket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket не подключён. Канал не может быть создан.');
        return;
    }

    const payload = {
        type: 'create_channel',
        body: {
            name,
            type,
            users,
        },
    };

    console.log('Отправка запроса на создание канала:', payload);
    socket.send(JSON.stringify(payload));
}