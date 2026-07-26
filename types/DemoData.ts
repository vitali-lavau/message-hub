import type { Conversation } from './Conversation';
import type { Message } from './Message';
import type { User } from './User';

export interface DemoData {
    version: 3;
    currentUserId: string;
    activeConversationId: string | null;
    users: User[];
    conversations: Conversation[];
    messages: Message[];
}
