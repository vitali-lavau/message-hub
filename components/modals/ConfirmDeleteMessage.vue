<template>
    <ModalBase
        :open="open"
        :header-margin-bottom="16"
        :body-margin-bottom="24"
        @close="emit('cancel')"
    >
        <template #header>
            <h3>Delete message?</h3>
        </template>
        <template #body>
            <p class="confirm-delete__text">
                This action cannot be undone. The message will be removed from this demo
                conversation.
            </p>
        </template>
        <template #footer>
            <ButtonBase label="Cancel" @click="emit('cancel')" />
            <button class="confirm-delete__button" type="button" @click="emit('confirm')">
                Delete
            </button>
        </template>
    </ModalBase>
</template>

<script setup lang="ts">
import ModalBase from '~/components/modals/ModalBase.vue';
import ButtonBase from '~/components/ui/ButtonBase.vue';

defineProps<{
    open: boolean;
}>();

const emit = defineEmits<{
    (event: 'cancel'): void;
    (event: 'confirm'): void;
}>();
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.confirm-delete {
    &__text {
        margin: 0;
        color: $color-gray-second;
        line-height: $line-height-lg;
    }

    &__button {
        margin-left: $spacing-md;
        padding: $btn-padding $spacing-lg;
        color: $color-white;
        background: $color-danger;
        border-radius: $btn-border-radius;
    }
}
</style>
