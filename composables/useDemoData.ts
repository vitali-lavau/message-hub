import {
    fetchDemoData,
    resetDemoData as resetStoredDemoData,
    saveDemoData,
    type MockApiOperation,
} from '~/services/mockApiService';
import { useConversationsStore } from '~/stores/conversationsStore';
import { useMessagesStore } from '~/stores/messagesStore';
import { useSessionStore } from '~/stores/sessionStore';
import { useUiStore } from '~/stores/uiStore';
import { useUsersStore } from '~/stores/usersStore';
import type { DemoData } from '~/types/DemoData';

const SAVE_DEBOUNCE = 300;

export function useDemoData() {
    const sessionStore = useSessionStore();
    const usersStore = useUsersStore();
    const conversationsStore = useConversationsStore();
    const messagesStore = useMessagesStore();
    const uiStore = useUiStore();

    let isApplyingSnapshot = true;
    let isSaveRunning = false;
    let isResetting = false;
    let saveRequestedWhileRunning = false;
    let saveTimer: ReturnType<typeof setTimeout> | null = null;
    let activeSavePromise: Promise<void> | null = null;

    function createSnapshot(): DemoData {
        return {
            version: 3,
            currentUserId: sessionStore.currentUserId,
            activeConversationId: conversationsStore.activeConversationId,
            users: usersStore.users,
            conversations: conversationsStore.conversations,
            messages: messagesStore.messages,
        };
    }

    function applySnapshot(data: DemoData) {
        isApplyingSnapshot = true;
        sessionStore.currentUserId = data.currentUserId;
        usersStore.users = data.users;
        conversationsStore.conversations = data.conversations;
        conversationsStore.activeConversationId = data.activeConversationId;
        messagesStore.messages = data.messages;
        messagesStore.botTypingConversationIds = [];
        messagesStore.sendingConversationIds = [];
        conversationsStore.ensureActiveConversationForCurrentUser();
        uiStore.markDemoDataApplied();

        void nextTick(() => {
            isApplyingSnapshot = false;
        });
    }

    async function persistDemoData() {
        if (!uiStore.isHydrated || isResetting) {
            return;
        }

        if (isSaveRunning) {
            saveRequestedWhileRunning = true;
            return;
        }

        isSaveRunning = true;
        uiStore.beginSaving();

        activeSavePromise = (async () => {
            try {
                await saveDemoData(createSnapshot(), {
                    forceError: uiStore.forceMockApiError,
                });
                uiStore.completeSaving();
            } catch (error) {
                uiStore.failRequest('save', error);
            } finally {
                isSaveRunning = false;
                activeSavePromise = null;

                if (saveRequestedWhileRunning && !isResetting) {
                    saveRequestedWhileRunning = false;
                    void persistDemoData();
                }
            }
        })();

        await activeSavePromise;
    }

    function scheduleSave() {
        if (isApplyingSnapshot || isResetting || !uiStore.isHydrated) {
            return;
        }

        if (saveTimer) {
            clearTimeout(saveTimer);
        }

        saveTimer = setTimeout(() => {
            saveTimer = null;
            void persistDemoData();
        }, SAVE_DEBOUNCE);
    }

    watch(
        () => [
            sessionStore.currentUserId,
            usersStore.users,
            conversationsStore.conversations,
            conversationsStore.activeConversationId,
            messagesStore.messages,
        ],
        scheduleSave,
        { deep: true, flush: 'post' }
    );

    async function initializeDemoData() {
        uiStore.beginRequest('load');

        try {
            const data = await fetchDemoData({
                forceError: uiStore.forceMockApiError,
            });
            applySnapshot(data);
            uiStore.completeRequest('Demo ready');
        } catch (error) {
            isApplyingSnapshot = false;
            uiStore.failRequest('load', error);
        }
    }

    async function resetDemoData() {
        isResetting = true;
        uiStore.beginRequest('reset');

        try {
            if (saveTimer) {
                clearTimeout(saveTimer);
                saveTimer = null;
            }

            saveRequestedWhileRunning = false;

            if (activeSavePromise) {
                await activeSavePromise;
                uiStore.beginRequest('reset');
            }

            const data = await resetStoredDemoData({
                forceError: uiStore.forceMockApiError,
            });
            applySnapshot(data);
            uiStore.completeRequest('Demo data reset');
            uiStore.addNotification('Demo data restored', 'success');
        } catch (error) {
            uiStore.failRequest('reset', error);
        } finally {
            isResetting = false;
        }
    }

    async function retryFailedRequest() {
        const operation: MockApiOperation | null = uiStore.failedOperation;

        if (operation === 'save') {
            await persistDemoData();
            return;
        }

        if (operation === 'reset') {
            await resetDemoData();
            return;
        }

        await initializeDemoData();
    }

    onScopeDispose(() => {
        if (saveTimer) {
            clearTimeout(saveTimer);
        }
    });

    return {
        initializeDemoData,
        resetDemoData,
        retryFailedRequest,
    };
}
