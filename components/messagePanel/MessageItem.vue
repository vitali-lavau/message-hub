<template>
    <div :class="['message-item', isMine ? 'message-item--right' : 'message-item--left']">
        <Avatar
            :name="author?.name || 'Unknown user'"
            :image-url="author?.avatarUrl"
            :status="author?.status"
            class="message-item__avatar"
        />
        <div class="message-item__inner" :class="{ 'message-item__inner--mine': isMine }">
            <div class="message-item__header flex items-center">
                <span class="message-item__sender">{{ author?.name || 'Unknown user' }}</span>
                <span class="message-item__timestamp">{{ formatDateTime(message.createdAt) }}</span>
                <span v-if="message.editedAt" class="message-item__edited">edited</span>
            </div>

            <div ref="reactionPicker" class="message-item__controls">
                <ButtonSmile
                    :aria-expanded="isReactionPickerOpen"
                    aria-label="Add reaction"
                    @click="isReactionPickerOpen = !isReactionPickerOpen"
                />
                <MessageActions v-if="isMine" @edit="enableEdit" @delete="handleDelete" />
                <div v-if="isReactionPickerOpen" class="message-item__reaction-options" role="menu">
                    <button
                        v-for="emoji in quickReactions"
                        :key="emoji"
                        type="button"
                        role="menuitem"
                        @click="selectReaction(emoji)"
                    >
                        {{ emoji }}
                    </button>
                </div>
            </div>

            <div class="message-item__content">
                <template v-if="isEditing">
                    <input
                        v-model="editableContent"
                        :maxlength="MAX_MESSAGE_LENGTH"
                        type="text"
                        class="message-item__input"
                        autofocus
                        @blur="saveEdit"
                        @keyup.enter="saveEdit"
                    />
                </template>
                <template v-else>
                    {{ message.text }}
                </template>
            </div>

            <div v-if="message.attachments.length" class="message-item__attachments">
                <a
                    v-for="attachment in message.attachments"
                    :key="attachment.id"
                    :href="attachment.previewUrl"
                    :download="attachment.name"
                    class="message-item__attachment"
                    :class="{ 'message-item__attachment--image': isImageAttachment(attachment) }"
                    @click="!attachment.previewUrl && $event.preventDefault()"
                >
                    <img
                        v-if="isImageAttachment(attachment) && attachment.previewUrl"
                        :src="attachment.previewUrl"
                        :alt="attachment.name"
                        class="message-item__attachment-preview"
                    />
                    <span v-else class="message-item__attachment-icon">
                        {{ getFileTypeLabel(attachment.name, attachment.type) }}
                    </span>
                    <span class="message-item__attachment-info">
                        <strong>{{ attachment.name }}</strong>
                        <small>
                            {{ getFileTypeLabel(attachment.name, attachment.type) }}
                            · {{ formatFileSize(attachment.size) }}
                        </small>
                    </span>
                </a>
            </div>

            <div v-if="message.reactions.length" class="message-item__reactions flex items-center">
                <ReactionButton
                    v-for="reaction in message.reactions"
                    :key="reaction.emoji"
                    :emoji="reaction.emoji"
                    :count="reaction.userIds.length"
                    :selected="reaction.userIds.includes(sessionStore.currentUserId)"
                    @click="toggleReaction(reaction.emoji)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Message } from '~/types/Message';
import type { Attachment } from '~/types/Attachment';
import Avatar from '~/components/ui/Avatar.vue';
import { formatDateTime } from '~/utils/formatDateTime';
import MessageActions from '~/components/messagePanel/MessageActions.vue';
import ReactionButton from '~/components/ui/ReactionButton.vue';
import ButtonSmile from '~/components/ui/ButtonSmile.vue';
import { useSessionStore } from '~/stores/sessionStore';
import { useUsersStore } from '~/stores/usersStore';
import { formatFileSize, getFileTypeLabel } from '~/utils/formatFileSize';
import { MAX_MESSAGE_LENGTH } from '~/utils/demoLimits';

const props = defineProps<{
    message: Message;
}>();

const emit = defineEmits<{
    (event: 'edit-message', payload: { messageId: string; text: string }): void;
    (event: 'delete-message', messageId: string): void;
    (event: 'toggle-reaction', payload: { messageId: string; emoji: string }): void;
}>();

const sessionStore = useSessionStore();
const usersStore = useUsersStore();
const author = computed(() => usersStore.getUserById(props.message.authorId));
const isMine = computed(() => props.message.authorId === sessionStore.currentUserId);
const isEditing = ref(false);
const editableContent = ref(props.message.text);
const isReactionPickerOpen = ref(false);
const reactionPicker = ref<HTMLElement | null>(null);
const quickReactions = ['👍', '❤️', '😂', '🎉', '👀'];

const enableEdit = () => {
    if (!isMine.value) {
        return;
    }

    isEditing.value = true;
    editableContent.value = props.message.text;
};

const saveEdit = () => {
    if (editableContent.value.trim() && editableContent.value !== props.message.text) {
        emit('edit-message', {
            messageId: props.message.id,
            text: editableContent.value,
        });
    }
    isEditing.value = false;
};

const handleDelete = () => {
    emit('delete-message', props.message.id);
};

const toggleReaction = (emoji: string) => {
    emit('toggle-reaction', {
        messageId: props.message.id,
        emoji,
    });
};

const selectReaction = (emoji: string) => {
    toggleReaction(emoji);
    isReactionPickerOpen.value = false;
};

const isImageAttachment = (attachment: Attachment) => attachment.type.startsWith('image/');

watch(isReactionPickerOpen, (isOpen) => {
    if (isOpen) {
        document.addEventListener('pointerdown', handleOutsideReactionClick);
    } else {
        document.removeEventListener('pointerdown', handleOutsideReactionClick);
    }
});

function handleOutsideReactionClick(event: PointerEvent) {
    if (event.target instanceof Node && !reactionPicker.value?.contains(event.target)) {
        isReactionPickerOpen.value = false;
    }
}

onBeforeUnmount(() => {
    document.removeEventListener('pointerdown', handleOutsideReactionClick);
});
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.message-item {
    width: fit-content;
    max-width: min(680px, 68%);
    min-height: 60px;
    display: flex;
    padding: $spacing-md 0;

    &__avatar {
        width: 30px;
        height: 30px;
        flex-shrink: 0;
        margin: 0 $spacing-md 0 0;
    }

    &__inner {
        position: relative;
        min-width: 0;
        flex: 1;
        padding: $spacing-m $spacing-lg $spacing-lg;
        border-radius: 10px;
        background: $color-info-light;

        &--mine .message-item__header {
            padding-right: 104px;
        }
    }

    &__header {
        min-height: 24px;
        margin: 0 0 $spacing-sm;
        padding-right: 40px;
        flex-wrap: wrap;
        gap: $spacing-xs $spacing-sm;
    }

    &__sender {
        font-size: $font-size-min;
        font-weight: $font-weight-bold;
        color: $color-black;
    }

    &__timestamp {
        color: $color-date;
        font-size: $font-size-xs;
        line-height: 1;
    }

    &__edited {
        margin-left: $spacing-xs;
        color: $color-date;
        font-size: $font-size-xs;
    }

    &__attachments {
        display: flex;
        flex-direction: column;
        gap: $spacing-xs;
        margin-top: $spacing-sm;
    }

    &__content {
        overflow-wrap: anywhere;
        white-space: pre-wrap;
        word-break: break-word;
    }

    &__attachment {
        max-width: 280px;
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-sm;
        color: $color-text;
        font-size: $font-size-min;
        text-decoration: none;
        border: 1px solid $color-border;
        border-radius: 8px;
        background: rgba(255, 255, 255, 0.7);

        &--image {
            align-items: flex-start;
        }
    }

    &__attachment-preview,
    &__attachment-icon {
        width: 56px;
        height: 56px;
        flex-shrink: 0;
        border-radius: 6px;
    }

    &__attachment-preview {
        object-fit: cover;
    }

    &__attachment-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        color: $color-secondary;
        font-size: $font-size-xs;
        font-weight: $font-weight-bold;
        background: $color-info-light;
    }

    &__attachment-info {
        min-width: 0;
        display: flex;
        flex-direction: column;

        strong {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        small {
            margin-top: $spacing-xs;
            color: $color-gray-second;
        }
    }

    &__reactions {
        width: fit-content;
        min-height: 28px;
        margin-top: $spacing-sm;
        padding: $spacing-xs $spacing-sm;
        background-color: $color-white;
        border: 1px solid $color-border;
        border-radius: 6px;

        > *:not(:last-child) {
            margin-right: $spacing-sm;
        }
    }

    &__controls {
        position: absolute;
        top: $spacing-sm;
        right: $spacing-sm;
        display: flex;
        align-items: center;
        gap: $spacing-xs;

        .btn-smile {
            width: 28px;
            height: 28px;
            border-radius: 6px;

            &:hover {
                background: rgba(255, 255, 255, 0.8);
            }
        }
    }

    &__reaction-options {
        position: absolute;
        right: 0;
        top: calc(100% + $spacing-xs);
        z-index: $z-index-dropdown;
        display: flex;
        gap: $spacing-xs;
        padding: $spacing-sm;
        background: $color-white;
        box-shadow: $box-shadow;
        border-radius: 8px;

        button {
            padding: $spacing-xs;
            font-size: $font-size-lg;
            border-radius: $border-radius-min;

            &:hover {
                background: $color-info-light;
            }
        }
    }

    &__input {
        width: 100%;
        min-width: 0;
    }

    &--right {
        margin: 0 0 0 auto;
        flex-direction: row-reverse;

        .message-item__avatar {
            margin: 0 0 0 $spacing-md;
        }

        .message-item__inner {
            background-color: $color-background-gray-second;
        }
    }
}

@media (max-width: 1023px) {
    .message-item {
        max-width: 78%;
    }
}

@media (max-width: 767px) {
    .message-item {
        max-width: 100%;
        padding-block: $spacing-sm;

        &__avatar {
            width: 28px;
            height: 28px;
            margin-right: $spacing-sm;
        }

        &__inner {
            min-width: 0;
            padding: $spacing-m;

            &--mine .message-item__header {
                padding-right: 96px;
            }
        }

        &__header {
            min-height: 28px;
            padding-right: 36px;
        }

        &__sender {
            max-width: 100%;
        }

        &--right .message-item__avatar {
            margin-left: $spacing-sm;
        }

        &__attachment {
            max-width: min(240px, 62vw);
        }

        &__reactions {
            padding: 0 $spacing-xs;
        }
    }
}
</style>
