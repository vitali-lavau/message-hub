<template>
    <div class="message-input">
        <FileUploader
            ref="fileUploader"
            :show-button-attach="false"
            @files-changed="handleFilesChanged"
        />
        <div class="message-input__inner">
            <ButtonAttach @click="openFileUploader" />
            <EditorContent v-if="editor" :editor="editor" class="editor" @keydown="handleKeydown" />
            <div
                ref="emojiMenu"
                class="message-input__emoji-menu"
                @pointerdown.stop
                @click.capture="handleEmojiMenuClick"
            >
                <client-only>
                    <Transition>
                        <emoji-picker
                            v-if="isEmoji"
                            class="emoji-picker"
                            @emoji-click="addEmojiToEditor"
                        />
                    </Transition>
                </client-only>
                <span class="message-input__emoji">
                    <ButtonSmile :aria-expanded="isEmoji" aria-label="Choose emoji" />
                </span>
            </div>
            <ButtonPrimary
                :disabled="isSendDisabled"
                :label="isSending ? 'Sending…' : 'Send'"
                class="message-input__send"
                @click="sendMessage"
            />
        </div>
        <div v-if="isSending || showCharacterCount" class="message-input__meta" aria-live="polite">
            <span v-if="isSending" class="message-input__sending" role="status">
                <span class="message-input__sending-dot" />
                Sending message…
            </span>
            <span
                v-if="showCharacterCount"
                class="message-input__count"
                :class="{ 'message-input__count--error': isMessageTooLong }"
            >
                {{ messageText.length }} / {{ MAX_MESSAGE_LENGTH }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import ButtonPrimary from '~/components/ui/ButtonPrimary.vue';
import Placeholder from '@tiptap/extension-placeholder';
import FileUploader from '~/components/ui/FileUploader.vue';
import ButtonAttach from '~/components/ui/ButtonAttach.vue';
import type { Attachment } from '~/types/Attachment';
import ButtonSmile from '~/components/ui/ButtonSmile.vue';
import { useConversationsStore } from '~/stores/conversationsStore';
import { useMessagesStore } from '~/stores/messagesStore';
import { MAX_MESSAGE_LENGTH } from '~/utils/demoLimits';

const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();
const editor = ref<Editor>();
const fileUploader = ref<InstanceType<typeof FileUploader> | null>(null);
const emojiMenu = ref<HTMLElement | null>(null);
const attachedFiles = ref<Attachment[]>([]);
const messageText = ref('');
const isEmoji = ref(false);

onMounted(async () => {
    await import('emoji-picker-element');
    document.addEventListener('pointerdown', handleDocumentPointerDown);

    editor.value = new Editor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Type a message...',
            }),
        ],
        content: '',
        onUpdate: ({ editor: currentEditor }) => {
            messageText.value = currentEditor.getText();
        },
    });
});

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleDocumentPointerDown);
    editor.value?.destroy();
});

async function sendMessage() {
    if (!editor.value || isSendDisabled.value) {
        return;
    }

    const text = messageText.value;
    const files = [...attachedFiles.value];

    editor.value.commands.clearContent();
    messageText.value = '';
    attachedFiles.value = [];
    fileUploader.value?.clearFiles();

    await messagesStore.sendCurrentUserMessage(text, files);
}

function handleFilesChanged(files: Attachment[]) {
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

const isSending = computed(() => messagesStore.isSendingInActiveConversation);
const isMessageTooLong = computed(() => messageText.value.length > MAX_MESSAGE_LENGTH);
const showCharacterCount = computed(() => messageText.value.length >= MAX_MESSAGE_LENGTH * 0.8);

const isSendDisabled = computed(() => {
    const hasContent = Boolean(messageText.value.trim()) || attachedFiles.value.length > 0;
    return (
        !conversationsStore.activeConversationId ||
        !hasContent ||
        isMessageTooLong.value ||
        isSending.value ||
        messagesStore.isBotTypingInActiveConversation
    );
});

function toggleEmoji() {
    isEmoji.value = !isEmoji.value;
}

function handleEmojiMenuClick(event: MouseEvent) {
    if (event.target instanceof Element && event.target.closest('.btn-smile')) {
        toggleEmoji();
    }
}

function handleDocumentPointerDown(event: PointerEvent) {
    if (isEmoji.value && event.target instanceof Node && !emojiMenu.value?.contains(event.target)) {
        isEmoji.value = false;
    }
}
</script>

<style lang="scss">
@use 'assets/scss/variables' as *;

.message-input {
    flex-shrink: 0;
    padding: $spacing-md $spacing-lg $spacing-lg;

    &__inner {
        position: relative;
        display: grid;
        grid-template-columns: 40px minmax(0, 1fr) 40px auto;
        align-items: center;
        gap: $spacing-xs;
        padding: 6px;
        background: $color-background-gray;
        border: 1px solid transparent;
        border-radius: 14px;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;

        &:focus-within {
            background: $color-white;
            border-color: rgba($color-primary, 0.65);
            box-shadow: 0 0 0 3px rgba($color-primary, 0.12);
        }
    }

    &__send {
        width: 96px;
        min-height: 40px;
        padding: $spacing-sm $spacing-md;
        border-radius: 10px;
        font-size: $font-size-sm;
        font-weight: $font-weight-semibold;

        &:disabled {
            color: $color-gray-second;
            background: $color-border;
            opacity: 1;
            cursor: not-allowed;
        }
    }

    &__emoji-menu {
        position: relative;
        z-index: 1;
        width: 40px;
        height: 40px;
        display: grid;
        place-items: center;

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

    &__emoji {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    &__meta {
        min-height: 18px;
        display: flex;
        justify-content: flex-end;
        gap: $spacing-md;
        padding: $spacing-xs $spacing-xl 0;
        color: $color-gray-second;
        font-size: $font-size-min;
    }

    &__sending {
        display: inline-flex;
        align-items: center;
        gap: $spacing-xs;
        margin-right: auto;
    }

    &__sending-dot {
        width: 7px;
        height: 7px;
        background: $color-primary;
        border-radius: 50%;
        animation: sending-pulse 0.8s ease-in-out infinite alternate;
    }

    &__count--error {
        color: $color-danger;
        font-weight: $font-weight-semibold;
    }

    .file-uploader {
        margin: 0;

        &:has(.file-uploader__error, .file-uploader__hint, .file-uploader__previews) {
            margin-bottom: $spacing-m;
        }
    }

    :where(.attach-button, .btn-smile, .message-input__send):focus-visible {
        outline: 2px solid $color-primary;
        outline-offset: -2px;
    }
}

.editor {
    min-width: 0;
    width: 100%;
    background: transparent;

    .ProseMirror {
        width: 100%;
        min-height: 40px;
        max-height: 140px;
        padding: 9px $spacing-xs;
        color: $color-secondary;
        font-size: $font-size-base;
        line-height: 22px;
        outline: none;
        border: none;
        overflow-y: auto;
        overflow-wrap: anywhere;
        white-space: pre-wrap;

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

@keyframes sending-pulse {
    to {
        opacity: 0.25;
        transform: scale(0.7);
    }
}

@media (max-width: 1023px) {
    .message-input {
        padding: $spacing-md;
    }
}

@media (max-width: 767px) {
    .message-input {
        padding: $spacing-sm $spacing-m calc(#{$spacing-m} + env(safe-area-inset-bottom));

        &__inner {
            grid-template-columns: 32px minmax(0, 1fr) 32px auto;
            gap: 2px;
            padding: 3px 4px;
            background: $color-white;
            border: 1px solid $color-border;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0, 30, 80, 0.06);

            &:focus-within {
                border-color: rgba($color-primary, 0.65);
                box-shadow:
                    0 0 0 3px rgba($color-primary, 0.1),
                    0 2px 8px rgba(0, 30, 80, 0.06);
            }

            .attach-button {
                width: 32px;
                height: 36px;
            }

            .btn-smile {
                width: 32px;
                height: 36px;
            }
        }

        &__send {
            width: auto;
            min-width: 68px;
            min-height: 36px;
            margin-left: $spacing-xs;
            padding: $spacing-sm $spacing-m;
            font-size: $font-size-sm;
            border-radius: 10px;
        }

        &__emoji-menu {
            width: 32px;
            height: 36px;

            .emoji-picker {
                position: fixed;
                right: $spacing-sm;
                bottom: calc(72px + env(safe-area-inset-bottom));
                max-width: calc(100vw - #{$spacing-md});
            }
        }

        &__emoji {
            width: 32px;
            height: 36px;
        }

        &__meta {
            min-height: 0;
            padding: $spacing-xs $spacing-sm 0;
        }
    }

    .editor {
        .ProseMirror {
            min-height: 36px;
            max-height: 112px;
            padding: $spacing-sm $spacing-xs;
            font-size: $font-size-sm;
            line-height: 20px;
        }
    }
}

.v-enter-active,
.v-leave-active {
    transition: opacity 0.5s ease-in-out;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}
</style>
