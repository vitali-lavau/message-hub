<template>
    <TransitionRoot as="template" :show="open">
        <Dialog class="relative z-10" @close="handleClose">
            <TransitionChild as="template" enter="ease-out duration-300" enter-from="opacity-0" enter-to="opacity-100"
                             leave="ease-in duration-200" leave-from="opacity-100" leave-to="opacity-0">
                <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"/>
            </TransitionChild>

            <div class="modal fixed inset-0 z-10 w-screen overflow-y-auto">
                <div class="modal__inner flex min-h-full items-end justify-center p-4 sm:items-center sm:p-0">
                    <TransitionChild as="template" enter="ease-out duration-300"
                                     enter-from="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                                     enter-to="opacity-100 translate-y-0 sm:scale-100" leave="ease-in duration-200"
                                     leave-from="opacity-100 translate-y-0 sm:scale-100"
                                     leave-to="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95">
                        <DialogPanel
                            class="modal__content relative transform overflow-hidden transition-all">

                            <div v-if="showHeader" class="modal__header" :style="{ marginBottom: headerMarginBottom + 'px' }">
                                <slot name="header"></slot>
                            </div>

                            <div v-if="showBody" class="modal__body" :style="{ marginBottom: bodyMarginBottom + 'px' }">
                                <slot name="body"></slot>
                            </div>

                            <div v-if="showFooter" class="modal__footer flex items-center justify-end">
                                <slot name="footer"></slot>
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </div>
        </Dialog>
    </TransitionRoot>
</template>

<script setup lang="ts">
import {Dialog, DialogPanel, TransitionChild, TransitionRoot} from '@headlessui/vue'

defineProps({
    open: Boolean,
    showHeader: { type: Boolean, default: true },
    showBody: { type: Boolean, default: true },
    showFooter: { type: Boolean, default: true },
    headerMarginBottom: { type: Number, default: 40 },
    bodyMarginBottom: { type: Number, default: 40 }
});

const emit = defineEmits(['close']);

function handleClose() {
    emit('close');
}
</script>

<style lang="scss">
@use "assets/scss/variables" as *;

.modal {

    &__content {
        width: 25%;
        padding: $spacing-xxl $spacing-xl;
        border-radius: $spacing-md;
        background: $color-white;
        box-shadow: 0 4px 16px 2px rgba(168, 185, 193, 0.20);
    }

    &__header,
    &__body {
        margin: 0 0 $spacing-xxl;

        h3 {
            margin: 0 0 $spacing-m;
            color: $color-text;
            font-size: $font-size-lg;
            font-weight: $font-weight-bold;
        }
    }
}
</style>