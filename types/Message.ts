export interface Message {
    id: string;
    text: string;
    createdAt: string;
    created_at?: string;
    user: {
        id: string;
        name: string;
        avatarUrl: string;
    };
    files: Array<any>;
    reactions: Array<any>;
    channelId: string;
    edited: boolean;
}
