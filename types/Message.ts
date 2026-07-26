import type { Attachment } from './Attachment';
import type { Reaction } from './Reaction';

export interface Message {
    id: string;
    conversationId: string;
    authorId: string;
    text: string;
    createdAt: string;
    editedAt?: string;
    attachments: Attachment[];
    reactions: Reaction[];
}
