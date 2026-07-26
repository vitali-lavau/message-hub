import type { UserStatus } from './User';

export interface AvatarProps {
    name: string;
    imageUrl?: string;
    bgColor?: string;
    status?: UserStatus;
}
