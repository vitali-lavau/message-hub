export const MAX_MESSAGE_LENGTH = 2_000;
export const MAX_ATTACHMENT_SIZE = 10 * 1024 * 1024;

export const SUPPORTED_ATTACHMENT_TYPES = [
    'image/png',
    'image/jpeg',
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const ATTACHMENT_ACCEPT = '.png,.jpg,.jpeg,.pdf,.pptx,.docx';
