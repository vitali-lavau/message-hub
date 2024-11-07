export interface Message {
    id: number;
    sender: string;
    content: string;
    timestamp: Date | string;
    avatarUrl: string;
    reactions: Record<string, number>;
    chatId: number;
}