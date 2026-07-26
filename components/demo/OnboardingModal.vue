<template>
    <TransitionRoot as="template" :show="isOpen">
        <Dialog class="onboarding" @close="finishOnboarding">
            <TransitionChild
                as="template"
                enter="ease-out duration-300"
                enter-from="opacity-0"
                enter-to="opacity-100"
                leave="ease-in duration-200"
                leave-from="opacity-100"
                leave-to="opacity-0"
            >
                <div class="onboarding__backdrop" />
            </TransitionChild>

            <div class="onboarding__viewport">
                <TransitionChild
                    as="template"
                    enter="ease-out duration-300"
                    enter-from="opacity-0 translate-y-4 scale-95"
                    enter-to="opacity-100 translate-y-0 scale-100"
                    leave="ease-in duration-200"
                    leave-from="opacity-100 translate-y-0 scale-100"
                    leave-to="opacity-0 translate-y-4 scale-95"
                >
                    <DialogPanel class="onboarding__panel">
                        <div class="onboarding__eyebrow">Portfolio demo</div>
                        <DialogTitle class="onboarding__title">
                            Welcome to Message Hub
                        </DialogTitle>
                        <p class="onboarding__lead">
                            Explore a frontend-only messenger with realistic client-side behavior
                            and no backend setup.
                        </p>

                        <ol class="onboarding__steps">
                            <li>
                                <span>1</span>
                                <div>
                                    <strong>Switch perspectives</strong>
                                    <p>
                                        Choose any employee to update chats, unread state, and
                                        ownership.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <span>2</span>
                                <div>
                                    <strong>Try the main flows</strong>
                                    <p>
                                        Send, edit, react, search, attach a file, or create a
                                        channel.
                                    </p>
                                </div>
                            </li>
                            <li>
                                <span>3</span>
                                <div>
                                    <strong>Experiment freely</strong>
                                    <p>
                                        Use Reset demo data in the sidebar whenever you want a clean
                                        start.
                                    </p>
                                </div>
                            </li>
                        </ol>

                        <p class="onboarding__privacy">
                            <span aria-hidden="true">●</span>
                            Demo data is stored locally in your browser.
                        </p>

                        <div class="onboarding__actions">
                            <a
                                class="onboarding__link"
                                :href="PROJECT_LINKS.repository"
                                target="_blank"
                                rel="noreferrer"
                            >
                                View GitHub
                            </a>
                            <button
                                type="button"
                                class="onboarding__primary"
                                @click="finishOnboarding"
                            >
                                Explore the demo
                            </button>
                        </div>
                    </DialogPanel>
                </TransitionChild>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue';
import { completeOnboarding, hasCompletedOnboarding } from '~/services/onboardingPreferenceService';
import { PROJECT_LINKS } from '~/utils/projectLinks';

const isOpen = ref(false);

onMounted(() => {
    isOpen.value = !hasCompletedOnboarding();
});

function finishOnboarding() {
    completeOnboarding();
    isOpen.value = false;
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.onboarding {
    position: relative;
    z-index: $z-index-modal;

    &__backdrop {
        position: fixed;
        inset: 0;
        background: radial-gradient(circle at 78% 18%, rgba(181, 225, 249, 0.36), transparent 32%),
            rgba(0, 30, 80, 0.7);
        backdrop-filter: blur(5px);
    }

    &__viewport {
        position: fixed;
        inset: 0;
        z-index: 1;
        display: grid;
        place-items: center;
        padding: $spacing-lg;
        overflow-y: auto;
    }

    &__panel {
        width: min(600px, 100%);
        padding: $spacing-xxl;
        color: $color-text;
        background: $color-white;
        border: 1px solid rgba(0, 97, 197, 0.12);
        border-radius: $border-radius;
        box-shadow: 0 28px 80px rgba(0, 30, 80, 0.32);
    }

    &__eyebrow {
        width: fit-content;
        margin-bottom: $spacing-m;
        padding: $spacing-xs $spacing-m;
        color: $color-secondary;
        font-size: $font-size-min;
        font-weight: $font-weight-bold;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        background: $color-info-light;
        border-radius: 999px;
    }

    &__title {
        margin: 0;
        font-size: 28px;
        line-height: 1.2;
    }

    &__lead {
        margin: $spacing-sm 0 $spacing-lg;
        color: $color-gray-second;
        font-size: $font-size-base;
        line-height: $line-height-lg;
    }

    &__steps {
        display: grid;
        gap: $spacing-m;
        margin: 0;
        padding: 0;
        list-style: none;

        li {
            display: grid;
            grid-template-columns: 36px minmax(0, 1fr);
            align-items: start;
            gap: $spacing-m;
            padding: $spacing-m;
            background: $color-background-gray;
            border-radius: $spacing-m;

            > span {
                width: 36px;
                height: 36px;
                display: grid;
                place-items: center;
                color: $color-white;
                font-weight: $font-weight-bold;
                background: $color-secondary;
                border-radius: 50%;
            }
        }

        strong {
            display: block;
            margin-bottom: 2px;
            font-size: $font-size-sm;
        }

        p {
            margin: 0;
            color: $color-gray-second;
            font-size: $font-size-min;
            line-height: $line-height-lg;
        }
    }

    &__privacy {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin: $spacing-lg 0 0;
        padding: $spacing-m;
        color: $color-text;
        font-size: $font-size-min;
        background: $color-info-light;
        border-radius: $spacing-sm;

        span {
            color: $color-success;
            font-size: 10px;
        }
    }

    &__actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: $spacing-m;
        margin-top: $spacing-lg;
    }

    &__link,
    &__primary {
        min-height: 42px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: $spacing-sm $spacing-lg;
        font-weight: $font-weight-semibold;
        text-decoration: none;
        border-radius: $btn-border-radius;
    }

    &__link {
        color: $color-secondary;
        border: 1px solid $color-secondary;
    }

    &__primary {
        color: $color-white;
        background: $color-secondary;
    }
}

@media (max-width: 767px) {
    .onboarding {
        &__viewport {
            align-items: end;
            padding: 0;
        }

        &__panel {
            max-height: calc(100dvh - #{$spacing-md});
            padding: $spacing-lg $spacing-md calc(#{$spacing-lg} + env(safe-area-inset-bottom));
            overflow-y: auto;
            border-radius: $spacing-lg $spacing-lg 0 0;
        }

        &__title {
            font-size: 24px;
        }

        &__lead {
            font-size: $font-size-sm;
        }

        &__actions {
            align-items: stretch;
            flex-direction: column-reverse;
        }

        &__link,
        &__primary {
            width: 100%;
        }
    }
}
</style>
