<template>
    <div class="page-shell">
        <section v-if="showStartupError" class="demo-state" aria-live="polite">
            <h1 class="demo-state__title">Unable to load demo</h1>
            <p class="demo-state__message">
                {{ uiStore.errorMessage ?? 'Something went wrong while preparing demo data.' }}
            </p>
            <button class="demo-state__retry" type="button" @click="retryFailedRequest">
                Retry
            </button>
        </section>

        <DemoSkeleton v-else-if="!uiStore.isHydrated" />

        <main
            v-else
            class="workspace"
            :class="{ 'workspace--sidebar-open': uiStore.isMobileSidebarOpen }"
            aria-label="Message Hub workspace"
        >
            <button
                v-if="isCompactViewport && uiStore.isMobileSidebarOpen"
                type="button"
                class="workspace__backdrop"
                aria-label="Close conversations"
                @click="closeSidebar"
            />
            <div
                ref="sidebarShell"
                class="workspace__sidebar"
                :class="{ 'workspace__sidebar--open': uiStore.isMobileSidebarOpen }"
                :aria-hidden="isCompactViewport && !uiStore.isMobileSidebarOpen"
                :inert="isCompactViewport && !uiStore.isMobileSidebarOpen ? true : undefined"
                tabindex="-1"
            >
                <Sidebar
                    id="conversation-sidebar"
                    @close="closeSidebar"
                    @conversation-selected="handleConversationSelected"
                    @reset-demo="resetDemoData"
                    @retry-demo="retryFailedRequest"
                />
            </div>
            <section
                ref="panelShell"
                class="workspace__panel"
                aria-label="Active conversation"
                :aria-hidden="isCompactViewport && uiStore.isMobileSidebarOpen"
                :inert="isCompactViewport && uiStore.isMobileSidebarOpen ? true : undefined"
                tabindex="-1"
            >
                <MessagePanel
                    :sidebar-open="uiStore.isMobileSidebarOpen"
                    @open-sidebar="openSidebar"
                />
            </section>
        </main>

        <ToastStack />
        <OnboardingModal />
    </div>
</template>

<script setup lang="ts">
import MessagePanel from '~/components/messagePanel/MessagePanel.vue';
import { useDemoData } from '~/composables/useDemoData';
import { useUiStore } from '~/stores/uiStore';
import DemoSkeleton from '~/components/demo/DemoSkeleton.vue';
import ToastStack from '~/components/demo/ToastStack.vue';
import OnboardingModal from '~/components/demo/OnboardingModal.vue';

const uiStore = useUiStore();
const sidebarShell = ref<HTMLElement | null>(null);
const panelShell = ref<HTMLElement | null>(null);
const isCompactViewport = ref(false);
const isMobileViewport = ref(false);
let compactMediaQuery: MediaQueryList | null = null;
let mobileMediaQuery: MediaQueryList | null = null;
const { initializeDemoData, resetDemoData, retryFailedRequest } = useDemoData();

const showStartupError = computed(
    () => !uiStore.isHydrated && uiStore.demoRequestStatus === 'error'
);

onMounted(() => {
    compactMediaQuery = window.matchMedia('(max-width: 1023px)');
    mobileMediaQuery = window.matchMedia('(max-width: 767px)');
    updateViewportState();
    compactMediaQuery.addEventListener('change', updateViewportState);
    mobileMediaQuery.addEventListener('change', updateViewportState);
    document.addEventListener('keydown', handleGlobalKeydown);

    if (isMobileViewport.value) {
        uiStore.openMobileSidebar();
    }

    void initializeDemoData();
});

onBeforeUnmount(() => {
    compactMediaQuery?.removeEventListener('change', updateViewportState);
    mobileMediaQuery?.removeEventListener('change', updateViewportState);
    document.removeEventListener('keydown', handleGlobalKeydown);
});

function updateViewportState() {
    isCompactViewport.value = compactMediaQuery?.matches ?? false;
    isMobileViewport.value = mobileMediaQuery?.matches ?? false;

    if (!isCompactViewport.value) {
        uiStore.closeMobileSidebar();
    }
}

async function openSidebar() {
    uiStore.openMobileSidebar();
    await nextTick();
    sidebarShell.value?.focus();
}

async function closeSidebar() {
    uiStore.closeMobileSidebar();
    await nextTick();
    panelShell.value?.focus();
}

async function handleConversationSelected() {
    if (isCompactViewport.value) {
        await closeSidebar();
    }
}

function handleGlobalKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && isCompactViewport.value && uiStore.isMobileSidebarOpen) {
        void closeSidebar();
    }
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.page-shell {
    width: 100%;
    height: 100%;
    min-width: 0;
    display: flex;
}

.workspace {
    position: relative;
    width: 100%;
    height: 100%;
    min-width: 0;
    display: flex;
    gap: $spacing-xl;
    overflow: hidden;

    &__sidebar {
        width: 340px;
        height: 100%;
        flex-shrink: 0;
    }

    &__panel {
        min-width: 0;
        height: 100%;
        flex: 1;
    }

    &__backdrop {
        display: none;
    }
}

.demo-state {
    width: min(460px, 100%);
    margin: auto;
    padding: $spacing-xxl;
    color: $color-text;
    text-align: center;
    background: $color-white;
    box-shadow: $box-shadow;
    border-radius: $border-radius;

    &__title {
        margin: 0 0 $spacing-sm;
        font-size: $font-size-max;
        font-weight: $font-weight-bold;
    }

    &__message {
        margin: 0;
        color: $color-gray-second;
        line-height: $line-height-lg;
    }

    &__retry {
        margin: $spacing-lg 0 0;
        padding: $btn-padding $spacing-lg;
        color: $color-white;
        background: $color-secondary;
        border-radius: $btn-border-radius;
    }
}

@media (max-width: 1023px) {
    .workspace {
        gap: 0;

        &__sidebar {
            position: absolute;
            inset: 0 auto 0 0;
            z-index: $z-index-fixed;
            width: min(360px, calc(100% - 72px));
            transform: translateX(calc(-100% - #{$spacing-lg}));
            transition: transform 0.25s ease;

            &--open {
                transform: translateX(0);
            }
        }

        &__backdrop {
            position: absolute;
            inset: 0;
            z-index: $z-index-sticky;
            display: block;
            background: rgba(0, 30, 80, 0.38);
        }
    }
}

@media (max-width: 767px) {
    .workspace {
        &__sidebar {
            width: 100%;
            transform: translateX(-100%);

            &--open {
                transform: translateX(0);
            }
        }

        &__backdrop {
            display: none;
        }

        &--sidebar-open .workspace__panel {
            visibility: hidden;
        }
    }

    .demo-state {
        border-radius: 0;
        box-shadow: none;
    }
}
</style>
