<template xmlns="">
    <div class="message-input">
        <FileUploader
            :showButtonAttach="false"
            ref="fileUploader"
            @filesChanged="handleFilesChanged"
        />
        <div class="message-input__inner">
            <ButtonAttach @click="openFileUploader"/>
            <client-only>
                <Transition>
                    <emoji-picker
                        v-if="isEmoji"
                        @emoji-click="addEmojiToEditor"
                        class="emoji-picker"
                    />
                </Transition>
            </client-only>
            <EditorContent
                v-if="editor"
                :editor="editor"
                class="editor"
                @keydown="handleKeydown"
            />
            <ButtonSmile
                @click="toggleEmoji"
                class="message-input__emoji"
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
import {Editor, EditorContent} from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import ButtonPrimary from "~/components/ui/ButtonPrimary.vue";
import Placeholder from '@tiptap/extension-placeholder';
import FileUploader from "~/components/ui/FileUploader.vue";
import ButtonAttach from "~/components/ui/ButtonAttach.vue";
import type {UploadedFile} from "~/types/UploadedFile";
import ButtonSmile from "~/components/ui/ButtonSmile.vue";
import { useChatStore } from '~/stores/chatStore';
import { useUserStore } from '~/stores/userStore';

const chatStore = useChatStore();
const userStore = useUserStore();
const editor = ref<Editor>();
const fileUploader = ref<InstanceType<typeof FileUploader> | null>(null);
const attachedFiles = ref<UploadedFile[]>([]);
const isEmoji = ref(false);

onMounted(async () => {
    await import('emoji-picker-element');

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

function sendMessage() {
    if (editor.value) {
        const plainText = editor.value.getText();

        if (plainText.trim()) {
            // Проверяем, активен ли чат с ботом
            if (chatStore.activeChatId === chatStore.botChatId) {
                chatStore.sendMessageToBot(plainText); // Отправляем сообщение боту
            } else {
                chatStore.addMessage(plainText, attachedFiles.value, userStore.user.name);
            }

            editor.value.commands.clearContent();
            attachedFiles.value = [];
            fileUploader.value?.clearFiles();
        }
    }
}

function handleFilesChanged(files: UploadedFile[]) {
    attachedFiles.value = files;
}

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

function openFileUploader() {
    fileUploader.value?.triggerFileSelect();
}

function addEmojiToEditor(event: CustomEvent) {
    const emoji = event.detail.unicode;
    editor.value?.commands.insertContent(emoji);
}

const isSendDisabled = computed(() => {
    const messageContent = editor.value?.getText().trim();
    return !messageContent && attachedFiles.value.length === 0;
});

function toggleEmoji() {
    isEmoji.value = !isEmoji.value;
}
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