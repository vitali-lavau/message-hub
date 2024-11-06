<template>
    <div :class="['reaction-button', { heartbeat: isActive }]" @click="handleClick">
        <span class="reaction-button__icon">{{ props.emoji }}</span>
        <span class="reaction-button__count">{{ props.count }}</span>
    </div>
</template>

<script setup lang="ts">
const props = defineProps({
    emoji: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        required: true
    }
});

const emit = defineEmits(['click']);

const isActive = ref(false);

const handleClick = () => {
    isActive.value = true;
    emit('click');

    setTimeout(() => {
        isActive.value = false;
    }, 2000);
};
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.reaction-button {
    display: flex;
    align-items: center;
    cursor: pointer;

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
.reaction-count {
    margin-left: 4px;
}
</style>
