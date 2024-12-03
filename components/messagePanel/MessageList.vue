<template>
    <div class="message-list flex items-center justify-center flex-1">
        <client-only>
            <p v-if="!messages.length" class="message-list__empty">No messages yet...</p>

            <DynamicScroller
                v-else
                :items="messagesWithSeparators"
                :key-field="'id'"
                class="message-list__scroller flex-1"
                :min-item-size="60"
            >
                <template #default="{ item, index, active }">
                    <transition
                        name="fade"
                        mode="out-in"
                        appear
                    >
                        <DynamicScrollerItem
                            :item="item"
                            :index="index"
                            :active="active"
                        >
                            <component
                                :is="item.type"
                                v-bind="item.props"
                            />
                        </DynamicScrollerItem>
                    </transition>
                </template>
            </DynamicScroller>
        </client-only>
    </div>
</template>

<script setup lang="ts">
import { DynamicScroller, DynamicScrollerItem } from 'vue-virtual-scroller';
import MessageItem from './MessageItem.vue';
import DateSeparator from "~/components/ui/DateSeparator.vue";
import type { Message } from "~/types/Message";
import type { MessageItemWithSeparator } from '~/types/MessageItemWithSeparator';

const props = defineProps<{
    messages: Array<Message>;
    currentUser: { name: string };
}>();

const messagesWithSeparators = computed((): MessageItemWithSeparator[] => {
    const items: MessageItemWithSeparator[] = [];
    let lastDate: string | null = null;

    props.messages.forEach((message: Message) => {
        const messageDate = new Date(message.createdAt).toDateString();

        if (lastDate !== messageDate) {
            items.push({
                id: `separator-${messageDate}`,
                type: DateSeparator,
                props: { date: new Date(message.createdAt) }
            });
            lastDate = messageDate;
        }

        items.push({
            id: message.id,
            type: MessageItem,
            props: { message, currentUser: props.currentUser.name }
        });
    });

    return items;
});
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;
@import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';

.message-list {
    height: 100px;
    padding: $spacing-xl $spacing-xxl;

    &__empty {
        color: $color-gray-second;
        font-size: $font-size-lg;
    }

    &__scroller {
        height: 100%;
        padding: 0 $spacing-xl 0 0;
    }

    .deleting {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
}
</style>