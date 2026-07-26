const ONBOARDING_STORAGE_KEY = 'message-hub-onboarding-completed-v1';

export function hasCompletedOnboarding(): boolean {
    if (typeof window === 'undefined') {
        return true;
    }

    return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === 'true';
}

export function completeOnboarding(): void {
    if (typeof window !== 'undefined') {
        window.localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    }
}
