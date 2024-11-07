<template>
    <div :class="['message-item', isMine ? 'message-item--right' : 'message-item--left']">
        <Avatar
            :name="message.sender"
            :imageUrl="message.avatarUrl"
            class="message-item__avatar"
        />
        <div class="message-item__inner">
            <div class="message-item__header flex items-center">
                <span class="message-item__sender">{{ message.sender }}</span>
                <span class="message-item__timestamp">{{ formatDateTime(message.timestamp) }}</span>
            </div>

            <div class="message-item__content" @dblclick="enableEdit">
                <template v-if="isEditing">
                    <input
                        v-model="editableContent"
                        @blur="saveEdit"
                        @keyup.enter="saveEdit"
                        type="text"
                        class="message-item__input"
                        autofocus
                    />
                </template>
                <template v-else>
                    {{ message.content }}
                </template>
            </div>

            <div class="message-item__reactions flex items-center">
                <ReactionButton
                    v-for="(count, emoji) in message.reactions"
                    :key="emoji"
                    :emoji="emoji as string"
                    :count="count"
                    @click="increaseReaction(emoji as string)"
                />
            </div>

            <MessageActions
                @edit="enableEdit"
                @delete="handleDelete"
                class="flex flex-col"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import type {Message} from '~/types/Message';
import Avatar from "~/components/ui/Avatar.vue";
import {formatDateTime} from "~/utils/formatDateTime";
import MessageActions from "~/components/messagePanel/MessageActions.vue";
import ReactionButton from "~/components/ui/ReactionButton.vue";

const props = defineProps<{
    message: Message;
    currentUser: string;
}>();

const emit = defineEmits(['editMessage', 'deleteMessage']);

const isMine = computed(() => props.message.sender === props.currentUser);
const isEditing = ref(false);
const editableContent = ref(props.message.content);

const enableEdit = () => {
    isEditing.value = true;
    editableContent.value = props.message.content;
};

const saveEdit = () => {
    if (editableContent.value !== props.message.content) {
        const updatedMessage = {
            ...props.message,
            content: editableContent.value
        };
        emit('editMessage', updatedMessage);
    }
    isEditing.value = false;
};

const handleDelete = () => {
    emit('deleteMessage', props.message);
};

const increaseReaction = (emoji: string) => {
    if (props.message.reactions[emoji] != undefined) {
        props.message.reactions[emoji]++;
    } else {
        props.message.reactions[emoji] = 1;
    }
};
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.message-item {
    max-width: 40%;
    min-height: 60px;
    display: flex;
    padding: $spacing-lg 0;

    &__avatar {
        width: 30px;
        height: 30px;
        flex-shrink: 0;
        margin: 0 $spacing-md 0 0;
    }

    &__inner {
        position: relative;
        flex: 1;
        padding: $spacing-m 60px $spacing-xl $spacing-lg;
        border-radius: 10px;
        background: $color-info-light;
    }

    &__header {
        margin: 0 0 $spacing-sm;
    }

    &__sender {
        margin: 0 $spacing-sm 0 0;
        font-size: $font-size-min;
        font-weight: $font-weight-bold;
        color: $color-black;
    }

    &__timestamp {
        color: $color-date;
        font-size: $font-size-xs;
        line-height: 1;
    }

    &__reactions {
        position: absolute;
        right: 24px;
        bottom: -12px;
        padding: $spacing-xs $spacing-sm;
        background-color: $color-white;
        filter: drop-shadow(0px 2px 8px rgba(0, 0, 0, 0.14));
        border-radius: 6px;

        > div:not(:last-child) {
            margin-right: $spacing-m;
        }
    }

    &__input {
        width: 100%;
    }

    .message-actions {
        position: absolute;
        top: 50%;
        right: 20px;
        transform: translateY(-50%);
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
</style>