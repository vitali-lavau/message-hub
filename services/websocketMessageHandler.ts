import { useChannelsStore } from '@/stores/channelsStore';
import { useDirectsStore } from '@/stores/directsStore';
import { useUserStore } from '@/stores/userStore';
import { useMessagesStore } from '@/stores/messagesStore';
import type { Channel} from "~/types/Channel";
import type { DirectChannel } from '@/types/directChannel';

let chunks: string[] = [];
let totalChunks: number = 0;

export function handleParsedMessage(parsedMessage: any) {
    console.log('Обработано сообщение:', parsedMessage);

    if (parsedMessage.type === 'authorize' && parsedMessage.body) {
        const userStore = useUserStore();

        const userData = {
            id: parsedMessage.body.id,
            name: parsedMessage.body.name,
            email: parsedMessage.body.email,
            organization: parsedMessage.body.organization,
        };
        userStore.setUser(userData);
        userStore.setAuthorized(true);

        console.log('Пользователь авторизован:', userStore.user);
    }

    if (parsedMessage.type === 'create_channel' && parsedMessage.body) {
        const newChannel: Channel = {
            id: parsedMessage.body.id,
            name: parsedMessage.body.name,
            type: parsedMessage.body.type,
            users: parsedMessage.body.users,
        };

        const channelsStore = useChannelsStore();
        channelsStore.addChannel(newChannel);

        console.log('Новый канал добавлен в хранилище:', newChannel);
    }

    if (parsedMessage.type === 'send_message' && parsedMessage.body) {
        const messagesStore = useMessagesStore();

        const newMessage = {
            id: parsedMessage.body.id,
            text: parsedMessage.body.text,
            createdAt: parsedMessage.body.created_at,
            user: {
                id: parsedMessage.body.user.id,
                name: parsedMessage.body.user.name,
                avatarUrl: '',
            },
            channelId: parsedMessage.body.channel_id,
        };

        if (!messagesStore.messages[newMessage.channelId]?.some(msg => msg.id === newMessage.id)) {
            messagesStore.addMessage(newMessage);
            console.log('Новое сообщение добавлено:', newMessage);
        } else {
            console.warn('Сообщение с этим ID уже существует:', newMessage.id);
        }
    }
}

export function handleWebSocketMessage(event: MessageEvent) {
    console.log('Сработал socket.onmessage. Получены данные:', event.data);

    const channelsStore = useChannelsStore();
    const directsStore = useDirectsStore();

    try {
        const message = JSON.parse(event.data);

        if (message.chunk && message.total) {
            const chunkIndex = parseInt(message.id.split('_')[1]);
            chunks[chunkIndex] = message.chunk;
            totalChunks = message.total;

            if (chunks.filter(Boolean).length === totalChunks) {
                const fullMessage = chunks.join('');
                chunks = [];
                totalChunks = 0;

                const parsedMessage = JSON.parse(fullMessage);
                console.log('Собранный JSON:', parsedMessage);

                if (parsedMessage.type === 'authorize') {
                    if (parsedMessage.body?.channels) {
                        const allChannels = Object.values(parsedMessage.body.channels) as (Channel | DirectChannel)[];

                        const customChannels = allChannels.filter((channel): channel is Channel => channel.type === 'custom');
                        channelsStore.setChannels(customChannels);

                        const privateChannels = allChannels.filter((channel): channel is DirectChannel => channel.type === 'private');
                        directsStore.setDirects(
                            privateChannels.map((channel) => ({
                                id: channel.id,
                                name: channel.name,
                                type: channel.type,
                                channel_id: channel.channel_id || undefined,
                                imageUrl: channel.imageUrl || undefined,
                            }))
                        );

                        console.log('Only the channels are stored in the vault:', channelsStore.channels);
                        console.log('Только private каналы сохранены в хранилище (директы):', directsStore.directs);
                    } else {
                        console.warn('Поле channels отсутствует или не соответствует ожидаемой структуре:', parsedMessage.body?.channels);
                    }
                }

                handleParsedMessage(parsedMessage);
            }
        } else {
            console.log('Получено неразбитое сообщение:', message);
            handleParsedMessage(message);
        }
    } catch (error) {
        console.error('Ошибка обработки сообщения:', error);
    }
}
