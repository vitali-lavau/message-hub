<template>
    <section class="demo-controls" aria-label="Demo data controls">
        <div class="demo-controls__status">
            <span class="demo-controls__status-dot" :class="statusClass" aria-hidden="true" />
            <span>{{ statusText }}</span>
        </div>

        <p v-if="uiStore.errorMessage" class="demo-controls__error">
            {{ uiStore.errorMessage }}
        </p>

        <div class="demo-controls__actions">
            <button
                v-if="uiStore.errorMessage"
                class="demo-controls__button demo-controls__button--primary"
                type="button"
                :disabled="isBusy"
                @click="emit('retry')"
            >
                Retry
            </button>
            <button
                class="demo-controls__button"
                type="button"
                :disabled="isBusy"
                @click="emit('reset')"
            >
                Reset demo data
            </button>
        </div>

        <label v-if="isDev" class="demo-controls__error-toggle">
            <input
                type="checkbox"
                :checked="uiStore.forceMockApiError"
                @change="toggleForcedError"
            />
            Simulate API errors
        </label>
    </section>
</template>

<script setup lang="ts">
import { useUiStore } from '~/stores/uiStore';

const uiStore = useUiStore();
const isDev = import.meta.dev;
const emit = defineEmits<{
    (event: 'reset'): void;
    (event: 'retry'): void;
}>();

const isBusy = computed(() => uiStore.demoRequestStatus === 'loading' || uiStore.isSaving);

const statusText = computed(() => {
    if (uiStore.errorMessage) {
        return 'Local sync failed';
    }

    return uiStore.statusMessage;
});

const statusClass = computed(() => ({
    'demo-controls__status-dot--loading': isBusy.value,
    'demo-controls__status-dot--error': Boolean(uiStore.errorMessage),
    'demo-controls__status-dot--success': !isBusy.value && !uiStore.errorMessage,
}));

function toggleForcedError(event: Event) {
    const input = event.target as HTMLInputElement;
    uiStore.setForceMockApiError(input.checked);
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.demo-controls {
    margin: 0 0 $spacing-m;
    padding: $spacing-sm;
    color: $color-text;
    background: $color-info-light;
    border: 1px solid $color-info;
    border-radius: $border-radius-min;

    &__status {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        font-size: $font-size-min;
        font-weight: $font-weight-semibold;
    }

    &__status-dot {
        width: 8px;
        height: 8px;
        flex: 0 0 auto;
        background: $color-gray;
        border-radius: 50%;

        &--success {
            background: $color-success;
        }

        &--error {
            background: $color-danger;
        }

        &--loading {
            background: $color-primary;
            animation: pulse 1s ease-in-out infinite;
        }
    }

    &__error {
        margin: $spacing-sm 0 0;
        color: $color-danger;
        font-size: $font-size-min;
        line-height: $line-height-lg;
    }

    &__actions {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-sm;
        margin: $spacing-xs 0 0;
    }

    &__button {
        padding: $spacing-xs $spacing-sm;
        color: $color-secondary;
        font-size: $font-size-min;
        background: $color-white;
        border: 1px solid $color-secondary;
        border-radius: $border-radius-min;

        &--primary {
            color: $color-white;
            background: $color-secondary;
        }

        &:disabled {
            cursor: wait;
            opacity: 0.5;
        }
    }

    &__error-toggle {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        margin: $spacing-xs 0 0;
        color: $color-gray;
        font-size: $font-size-min;
        cursor: pointer;

        input {
            accent-color: $color-danger;
        }
    }
}

@keyframes pulse {
    0%,
    100% {
        opacity: 0.4;
    }

    50% {
        opacity: 1;
    }
}
</style>
