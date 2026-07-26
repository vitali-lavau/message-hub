import { defineStore } from 'pinia';
import type { MockApiOperation } from '~/services/mockApiService';
import { createId } from '~/utils/createId';

export interface UiNotification {
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
}

export type DemoRequestStatus = 'idle' | 'loading' | 'success' | 'error';

function getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
}

export const useUiStore = defineStore('ui', {
    state: () => ({
        searchQuery: '',
        highlightedMessageId: null as string | null,
        isCreateGroupModalOpen: false,
        isNewDirectModalOpen: false,
        isManageMembersModalOpen: false,
        isMobileSidebarOpen: false,
        notifications: [] as UiNotification[],
        demoRequestStatus: 'idle' as DemoRequestStatus,
        isHydrated: false,
        isSaving: false,
        lastSavedAt: null as string | null,
        statusMessage: 'Preparing demo...',
        errorMessage: null as string | null,
        failedOperation: null as MockApiOperation | null,
        forceMockApiError: false,
        demoDataRevision: 0,
    }),

    actions: {
        beginRequest(operation: Exclude<MockApiOperation, 'save'>) {
            this.demoRequestStatus = 'loading';
            this.statusMessage =
                operation === 'reset' ? 'Resetting demo data...' : 'Loading demo data...';
            this.errorMessage = null;
            this.failedOperation = null;
        },

        completeRequest(message: string) {
            this.demoRequestStatus = 'success';
            this.isHydrated = true;
            this.statusMessage = message;
            this.errorMessage = null;
            this.failedOperation = null;
        },

        beginSaving() {
            this.isSaving = true;
            this.statusMessage = 'Saving...';

            if (this.failedOperation === 'save') {
                this.errorMessage = null;
                this.failedOperation = null;
            }
        },

        completeSaving() {
            this.isSaving = false;
            this.demoRequestStatus = 'success';
            this.lastSavedAt = new Date().toISOString();
            this.statusMessage = 'Saved locally';
            this.errorMessage = null;
            this.failedOperation = null;
        },

        failRequest(operation: MockApiOperation, error: unknown) {
            this.demoRequestStatus = 'error';
            this.isSaving = false;
            this.errorMessage = getErrorMessage(error);
            this.statusMessage = 'Request failed';
            this.failedOperation = operation;
        },

        setForceMockApiError(value: boolean) {
            this.forceMockApiError = value;
        },

        markDemoDataApplied() {
            this.demoDataRevision += 1;
        },

        setSearchQuery(query: string) {
            this.searchQuery = query;
        },

        openSearchResult(messageId?: string) {
            this.searchQuery = '';
            this.highlightedMessageId = messageId ?? null;
        },

        clearHighlightedMessage() {
            this.highlightedMessageId = null;
        },

        openCreateGroupModal() {
            this.isCreateGroupModalOpen = true;
        },

        closeCreateGroupModal() {
            this.isCreateGroupModalOpen = false;
        },

        openNewDirectModal() {
            this.isNewDirectModalOpen = true;
        },

        closeNewDirectModal() {
            this.isNewDirectModalOpen = false;
        },

        openManageMembersModal() {
            this.isManageMembersModalOpen = true;
        },

        closeManageMembersModal() {
            this.isManageMembersModalOpen = false;
        },

        toggleMobileSidebar() {
            this.isMobileSidebarOpen = !this.isMobileSidebarOpen;
        },

        openMobileSidebar() {
            this.isMobileSidebarOpen = true;
        },

        closeMobileSidebar() {
            this.isMobileSidebarOpen = false;
        },

        addNotification(message: string, type: UiNotification['type'] = 'info') {
            this.notifications.push({
                id: createId('notification'),
                message,
                type,
            });
        },

        removeNotification(notificationId: string) {
            this.notifications = this.notifications.filter(
                (notification) => notification.id !== notificationId
            );
        },
    },
});
