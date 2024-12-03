<template>
    <div class="message-input">
        <div class="message-input__inner">
            <EditorContent
                v-if="editor"
                :editor="editor"
                class="editor"
                @keydown="handleKeydown"
            />
            <ButtonPrimary
                :disabled="isSendDisabled"
                @click="sendMessage"
                label="Send"
                class="message-input__send"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import ButtonPrimary from '~/components/ui/ButtonPrimary.vue';
import { sendMessage as sendSocketMessage } from '~/services/socketAuthService';
import { useMessagesStore } from '~/stores/messagesStore';
import { useUserStore } from '~/stores/userStore';

const editor = ref<Editor>();
const messagesStore = useMessagesStore();
const isSendDisabled = computed(() => !editor.value?.getText().trim());
const userStore = useUserStore();

onMounted(() => {
    editor.value = new Editor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Type a message...',
            }),
        ],
        content: '',
    });
});

onBeforeUnmount(() => {
    editor.value?.destroy();
});

const sendMessage = () => {
    if (!editor.value) return;

    const messageContent = editor.value.getText().trim();
    const channelId = messagesStore.currentChannelId;
    const currentUser = userStore.user;

    if (!currentUser) {
        console.error('Текущий пользователь не найден!');
        return;
    }

    if (messageContent && channelId) {
        sendSocketMessage(channelId, messageContent);
        editor.value.commands.clearContent();
    }
};

const handleKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
};
</script>

<style lang="scss">
@use "assets/scss/variables" as *;

.message-input {
    padding: $spacing-xl $spacing-xxl;

    &__inner {
        position: relative;

        .attach-button {
            position: absolute;
            top: 50%;
            left: $spacing-lg;
            transform: translateY(-50%);
        }

        .emoji-picker {
            position: absolute;
            right: 0;
            bottom: calc(100% + $spacing-sm);
            z-index: $z-index-dropdown;

            .picker {
                border-radius: 6px;
            }
        }
    }

    &__send {
        position: absolute;
        top: 50%;
        right: $spacing-xl;
        width: 110px;
        transform: translateY(-50%);

        &:disabled {
            opacity: 0.2;
            pointer-events: none;
            filter: grayscale(1);
        }
    }

    &__emoji {
        position: absolute;
        top: 50%;
        right: 166px;
        width: $spacing-lg;
        height: $spacing-lg;
        transform: translateY(-50%);
    }

    .file-uploader {
        margin: 0 0 $spacing-m;
    }
}

.editor {
    width: 100%;
    padding: $spacing-m $spacing-xl $spacing-m $spacing-xxl;
    background-color: $color-background-gray;
    border-radius: 6px;

    .ProseMirror {
        max-width: 85%;
        padding: $spacing-sm;
        color: $color-secondary;
        font-size: $font-size-base;
        line-height: $line-height-lg;
        outline: none;
        border: none;

        p[data-placeholder] {
            position: relative;

            &:before {
                content: attr(data-placeholder);
                position: absolute;
                top: 50%;
                left: 0;
                color: $color-gray;
                transform: translateY(-50%);
                pointer-events: none;
            }
        }
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity .5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>