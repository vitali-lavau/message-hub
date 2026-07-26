import { initialConversations } from '~/mocks/conversations';
import { initialMessages } from '~/mocks/messages';
import { initialUsers } from '~/mocks/users';
import type { DemoData } from '~/types/DemoData';

const STORAGE_KEY = 'message-hub-demo-data-v3';
const MIN_DELAY = 200;
const MAX_DELAY = 500;

export type MockApiOperation = 'load' | 'save' | 'reset';

export interface MockApiOptions {
    forceError?: boolean;
}

export class MockApiError extends Error {
    operation: MockApiOperation;

    constructor(operation: MockApiOperation) {
        super(`Mock API could not ${operation} demo data. Please try again.`);
        this.name = 'MockApiError';
        this.operation = operation;
    }
}

function cloneDemoData(data: DemoData): DemoData {
    return JSON.parse(JSON.stringify(data)) as DemoData;
}

function createSeedData(): DemoData {
    return cloneDemoData({
        version: 3,
        currentUserId: 'user-elena',
        activeConversationId: 'direct-bot-elena',
        users: initialUsers,
        conversations: initialConversations,
        messages: initialMessages,
    });
}

function getStorage(): Storage {
    if (!import.meta.client) {
        throw new Error('Mock API is only available in the browser.');
    }

    return window.localStorage;
}

function isDemoData(value: unknown): value is DemoData {
    if (!value || typeof value !== 'object') {
        return false;
    }

    const data = value as Partial<DemoData>;
    return (
        data.version === 3 &&
        typeof data.currentUserId === 'string' &&
        (typeof data.activeConversationId === 'string' || data.activeConversationId === null) &&
        Array.isArray(data.users) &&
        Array.isArray(data.conversations) &&
        Array.isArray(data.messages)
    );
}

function removeTemporaryAttachmentUrls(data: DemoData): DemoData {
    return {
        ...data,
        messages: data.messages.map((message) => ({
            ...message,
            attachments: message.attachments.map(({ previewUrl, ...attachment }) => ({
                ...attachment,
                ...(previewUrl && !previewUrl.startsWith('blob:') ? { previewUrl } : {}),
            })),
        })),
    };
}

async function simulateRequest(
    operation: MockApiOperation,
    options: MockApiOptions
): Promise<void> {
    const delay = Math.round(MIN_DELAY + Math.random() * (MAX_DELAY - MIN_DELAY));
    await new Promise((resolve) => window.setTimeout(resolve, delay));

    if (options.forceError) {
        throw new MockApiError(operation);
    }
}

export async function fetchDemoData(options: MockApiOptions = {}): Promise<DemoData> {
    await simulateRequest('load', options);
    const storage = getStorage();
    const storedValue = storage.getItem(STORAGE_KEY);

    if (!storedValue) {
        const seedData = createSeedData();
        storage.setItem(STORAGE_KEY, JSON.stringify(seedData));
        return seedData;
    }

    try {
        const parsedValue: unknown = JSON.parse(storedValue);

        if (!isDemoData(parsedValue)) {
            throw new Error('Unsupported demo data shape.');
        }

        return cloneDemoData(parsedValue);
    } catch {
        const seedData = createSeedData();
        storage.setItem(STORAGE_KEY, JSON.stringify(seedData));
        return seedData;
    }
}

export async function saveDemoData(data: DemoData, options: MockApiOptions = {}): Promise<void> {
    await simulateRequest('save', options);
    const persistableData = removeTemporaryAttachmentUrls(cloneDemoData(data));
    getStorage().setItem(STORAGE_KEY, JSON.stringify(persistableData));
}

export async function resetDemoData(options: MockApiOptions = {}): Promise<DemoData> {
    await simulateRequest('reset', options);
    const seedData = createSeedData();
    getStorage().setItem(STORAGE_KEY, JSON.stringify(seedData));
    return seedData;
}
