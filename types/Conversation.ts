export type ConversationType = 'direct' | 'group';
export type GroupKind = 'channel' | 'private';

export interface Conversation {
    id: string;
    type: ConversationType;
    groupKind?: GroupKind;
    name?: string;
    participantIds: string[];
    unreadCountByUserId: Record<string, number>;
    lastMessageId?: string;
}
