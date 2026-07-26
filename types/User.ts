export type UserStatus = 'online' | 'offline' | 'away';

export interface User {
    id: string;
    name: string;
    avatarUrl?: string;
    status: UserStatus;
    role: string;
    bio: string;
}
