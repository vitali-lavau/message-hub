<template>
    <div class="message-list flex items-center justify-center flex-1">
        <p v-if="!messages.length" class="message-list__empty">No messages yet...</p>

        <DynamicScroller
            v-else
            :items="messagesWithSeparators"
            :key-field="'id'"
            class="message-list__scroller flex-1"
            :min-item-size="60"
        >
            <template #default="{ item, index, active }">
                <DynamicScrollerItem
                    :item="item"
                    :index="index"
                    :active="active"
                >
                    <component :is="item.type" v-bind="item.props" @editMessage="onEditMessage" @deleteMessage="onDeleteMessage" />
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
</template>

<script setup lang="ts">
import {DynamicScroller, DynamicScrollerItem} from 'vue-virtual-scroller';
import MessageItem from './MessageItem.vue';
import DateSeparator from "~/components/ui/DateSeparator.vue";
import type {Message} from "~/types/Message";
import type { MessageItemWithSeparator } from '~/types/MessageItemWithSeparator';

const currentUser = 'Bob';
const messages = ref<Message[]>([
    {
        id: 1,
        sender: "Alice",
        content: "Hello, Bob! How have you been? It's been so long since we last caught up. I have so many things to share with you, from my recent travels to the new project I started working on. I hope you're doing well!",
        timestamp: new Date("2023-10-01T10:00:00"),
        avatarUrl: '/images/users/alice.png',
    },
    {
        id: 2,
        sender: "Bob",
        content: "Hey Alice! I'm doing well, thanks for asking. Life's been pretty busy on my end too. I recently moved to a new place and have been working on setting it up. Can't wait to hear all about your travels and the new project!",
        timestamp: new Date("2023-10-01T10:01:00"),
        avatarUrl: '/images/users/bob.png',
    },
    {
        id: 3,
        sender: "Alice",
        content: "Moving sounds exciting! Where did you move to? And how's the new place? As for my travels, I went to a few countries in Europe. The architecture, the food, and the people were just amazing. I’ve been meaning to send you pictures, but there are so many of them!",
        timestamp: new Date("2023-10-01T10:03:00"),
        avatarUrl: '/images/users/alice.png',
    },
    {
        id: 4,
        sender: "Bob",
        content: "That sounds incredible! I moved closer to the city center, so everything is within walking distance now, which is really convenient. I’m glad you had a great time in Europe. I'd love to see the photos whenever you have time to share them!",
        timestamp: new Date("2023-10-01T10:05:00"),
        avatarUrl: '/images/users/bob.png',
    },
    {
        id: 5,
        sender: "Alice",
        content: "Absolutely, I’ll start sending you some now! By the way, you mentioned setting up the new place. Have you done any decorating or bought new furniture? I know you were always into making your space look unique and cozy.",
        timestamp: new Date("2023-10-02T10:07:00"),
        avatarUrl: '/images/users/alice.png',
    },
    {
        id: 6,
        sender: "Bob",
        content: "Yes, I've actually started decorating! I’ve bought a few new pieces, and I’m going for a modern but warm look. It’s still a work in progress, but I’m really enjoying the process. Do you have any decorating tips for me?",
        timestamp: new Date("2023-10-02T10:10:00"),
        avatarUrl: '/images/users/bob.png',
    },
    {
        id: 7,
        sender: "Alice",
        content: "Of course! I’d say start with a color palette that you love and add accents that make you feel comfortable. Plants are also a great way to add life to any room. I think you’d love the ones I saw in Europe; they have the most unique shapes and colors!",
        timestamp: new Date("2023-10-02T10:12:00"),
        avatarUrl: '/images/users/alice.png',
    },
    {
        id: 8,
        sender: "Bob",
        content: "Great advice! I’ll definitely think about adding some plants. I've always liked the idea of having a few green corners around. Also, do you have any suggestions for wall art? I feel like my walls are too empty right now.",
        timestamp: new Date("2023-10-03T10:14:00"),
        avatarUrl: '/images/users/bob.png',
    },
    {
        id: 9,
        sender: "Alice",
        content: "Wall art can completely transform a space! I’d suggest looking for pieces that resonate with you. They don’t have to match each other perfectly; sometimes a mix of styles can look fantastic. I saw some street artists in Italy doing incredible work that would make great wall art!",
        timestamp: new Date("2023-10-03T10:16:00"),
        avatarUrl: '/images/users/alice.png',
    },
    {
        id: 10,
        sender: "Bob",
        content: "That sounds perfect! I’ll start looking into some unique art pieces. Italy must have been amazing for you. Did you visit any famous landmarks?",
        timestamp: new Date("2023-10-04T10:18:00"),
        avatarUrl: '/images/users/bob.png',
    },
    {
        id: 11,
        sender: "Alice",
        content: "Yes! I visited the Colosseum and the Vatican. Both were awe-inspiring in their own ways. The history there is just mind-blowing. I felt like I was stepping back in time.",
        timestamp: new Date("2023-10-04T10:20:00"),
        avatarUrl: '/images/users/alice.png',
    },
    {
        id: 12,
        sender: "Bob",
        content: "I can imagine! I've always wanted to visit those places. The history and architecture are just so fascinating. Did you get to try any traditional Italian dishes?",
        timestamp: new Date("2023-10-05T10:22:00"),
        avatarUrl: '/images/users/bob.png',
    },
    {
        id: 13,
        sender: "Alice",
        content: "Oh, absolutely! I had the most delicious pasta and pizza. Each place seemed to have its own unique take on the recipes. And don’t get me started on the gelato – I think I had some every day I was there!",
        timestamp: new Date("2023-10-05T10:25:00"),
        avatarUrl: '/images/users/alice.png',
    },
    {
        id: 14,
        sender: "Bob",
        content: "Haha, that sounds like a perfect vacation! I’d probably do the same if I were in Italy. So, what’s next for you? Any more travel plans?",
        timestamp: new Date("2023-10-06T10:27:00"),
        avatarUrl: '/images/users/bob.png',
    },
    {
        id: 15,
        sender: "Alice",
        content: "I’d love to plan more trips, but for now, I think I’ll be focusing on my new project. It’s a bit of a startup idea, and I'm really excited about it. There’s so much to do, but it feels like the right time to try it out.",
        timestamp: new Date("2023-10-06T10:30:00"),
        avatarUrl: '/images/users/alice.png',
    },
    {
        id: 16,
        sender: "Bob",
        content: "That’s amazing! Starting something new is always a big step. If you need any help or feedback, don’t hesitate to reach out. I’d love to hear more about your idea.",
        timestamp: new Date("2023-10-07T10:32:00"),
        avatarUrl: '/images/users/bob.png',
    },
    {
        id: 17,
        sender: "Alice",
        content: "Thanks, Bob! I appreciate that a lot. I might take you up on that offer. It’s great to have friends who are so supportive.",
        timestamp: new Date("2023-10-07T10:35:00"),
        avatarUrl: '/images/users/alice.png',
    },
    {
        id: 18,
        sender: "Bob",
        content: "Of course! Anytime. Well, this conversation is really making me want to travel and explore. Maybe I should start planning a trip soon too.",
        timestamp: new Date("2023-10-08T10:38:00"),
        avatarUrl: '/images/users/bob.png',
    },
    {
        id: 19,
        sender: "Alice",
        content: "Yes, you definitely should! Traveling changes you in the best ways. Let me know if you need any recommendations – I’d be happy to help you plan.",
        timestamp: new Date("2023-10-08T10:40:00"),
        avatarUrl: '/images/users/alice.png',
    },
    {
        id: 20,
        sender: "Bob",
        content: "Thanks, Alice! I’ll let you know. And let’s make sure to catch up again soon – we have a lot to talk about!",
        timestamp: new Date(),
        avatarUrl: '/images/users/bob.png',
    }
]);

const messagesWithSeparators = computed((): MessageItemWithSeparator[] => {
    const items: MessageItemWithSeparator[] = [];
    let lastDate: string | null = null;

    messages.value.forEach((message) => {
        const messageDate = new Date(message.timestamp).toDateString();

        if (lastDate !== messageDate) {
            items.push({
                id: `separator-${messageDate}`,
                type: DateSeparator,
                props: { date: new Date(message.timestamp) }
            });
            lastDate = messageDate;
        }

        items.push({
            id: message.id,
            type: MessageItem,
            props: { message, currentUser }
        });
    });

    return items;
});

const onEditMessage = (message: Message) => {
    // Логика для редактирования сообщения
    console.log('Редактировать сообщение:', message);
};

const onDeleteMessage = (message: Message) => {
    // Логика для удаления сообщения
    console.log('Удалить сообщение:', message);
};
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
}
</style>