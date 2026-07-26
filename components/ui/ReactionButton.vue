<template>
    <button
        type="button"
        :class="[
            'reaction-button',
            { 'reaction-button--selected': selected, heartbeat: isAnimating },
        ]"
        :aria-pressed="selected"
        :aria-label="`${selected ? 'Remove' : 'Add'} ${emoji} reaction, ${count}`"
        @click="handleClick"
    >
        <span class="reaction-button__icon">{{ props.emoji }}</span>
        <span class="reaction-button__count">{{ props.count }}</span>
    </button>
</template>

<script setup lang="ts">
const props = defineProps<{
    emoji: string;
    count: number;
    selected?: boolean;
}>();

const emit = defineEmits<{
    (event: 'click'): void;
}>();

const isAnimating = ref(false);

const handleClick = () => {
    isAnimating.value = true;
    emit('click');

    setTimeout(() => {
        isAnimating.value = false;
    }, 500);
};
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.reaction-button {
    display: flex;
    align-items: center;
    cursor: pointer;
    border-radius: $border-radius-min;

    &--selected {
        color: $color-secondary;
        font-weight: $font-weight-bold;
    }

    &__icon {
        width: 16px;
        height: 16px;
        margin: 0 8px 0 0;
    }

    &__count {
        font-size: $font-size-min;
        line-height: $line-height-lg;
        color: #000;
    }
}

@media (max-width: 767px) {
    .reaction-button {
        min-height: 32px;
        padding-inline: $spacing-xs;
    }
}
.reaction-count {
    margin-left: 4px;
}
</style>
