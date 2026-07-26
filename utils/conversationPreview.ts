import type { Message } from '~/types/Message';

export function getMessagePreview(message?: Message | null): string {
    if (!message) {
        return 'No messages yet';
    }

    if (message.text.trim()) {
        return message.text.trim();
    }

    const attachment = message.attachments[0];
    return attachment ? `Attachment: ${attachment.name}` : 'New message';
}

export function formatConversationTime(createdAt?: string): string {
    if (!createdAt) {
        return '';
    }

    const date = new Date(createdAt);
    const now = new Date();

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    if (date.toDateString() === now.toDateString()) {
        return new Intl.DateTimeFormat('en', {
            hour: '2-digit',
            minute: '2-digit',
        }).format(date);
    }

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    return new Intl.DateTimeFormat('en', {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() === now.getFullYear() ? undefined : 'numeric',
    }).format(date);
}
