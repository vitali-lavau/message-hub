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

            <div class="message-item__content">{{ message.content }}</div>

            <div class="message-item__reactions flex items-center">
                <ReactionButton
                    v-for="(count, emoji) in reactions"
                    :key="emoji"
                    :emoji="emoji as string"
                    :count="count"
                    @click="increaseReaction(emoji as string)"
                />
            </div>

            <MessageActions
                @edit="handleEdit"
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

const isMine = computed(() => props.message.sender === props.currentUser);

const emit = defineEmits(['editMessage', 'deleteMessage']);

const handleEdit = () => {
    emit('editMessage', props.message);
};

const handleDelete = () => {
    emit('deleteMessage', props.message);
};

const reactions = reactive<{ [key: string]: number }>({
    '😍': 3,
    '👍': 1,
    '😂': 2
});

const increaseReaction = (emoji: string) => {
    if (reactions[emoji] !== undefined) {
        reactions[emoji]++;
    } else {
        reactions[emoji] = 1;
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