export interface DirectMessageItemProps {
    id: number;
    name: string;
    imageUrl?: string;
    unreadCount?: number;
    isActive?: boolean;
    chatId: number;
}