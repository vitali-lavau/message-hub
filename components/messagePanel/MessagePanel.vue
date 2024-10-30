<template>
    <div class="message-panel flex flex-col">
        <Header :title="activeTitle" :members="activeMembers"/>
        <MessageList/>
        <MessageInput/>
    </div>
</template>

<script setup lang="ts">
import Header from "~/components/messagePanel/Header.vue";
import MessageList from "~/components/messagePanel/MessageList.vue";
import MessageInput from "~/components/messagePanel/MessageInput.vue";

const props = defineProps<{
    activeChannelId: number | null;
    activeMessageId: number | null;
}>();

const channels = [
    {
        id: 1,
        name: "General Discussion",
        members: [
            {
                name: "Emily Clark",
                avatarUrl: "/images/users/emily.png",
            },
            {
                name: "James Anderson",
                avatarUrl: "/images/users/james.png",
            },
            {
                name: "Sophia Turner",
                avatarUrl: "/images/users/sophia.png",
            },
            {
                name: "Liam Wilson",
                avatarUrl: "",
            },
            {
                name: "Olivia Brown",
                avatarUrl: "/images/users/olivia.png",
            },
            {
                name: "Noah Martinez",
                avatarUrl: "",
            },
            {
                name: "Ava Garcia",
                avatarUrl: "/images/users/ava.png",
            },
            {
                name: "Mason Lee",
                avatarUrl: "",
            },
            {
                name: "Isabella White",
                avatarUrl: "",
            },
            {
                name: "Lucas Hall",
                avatarUrl: "/images/users/lucas.png",
            },
        ]
    },
    {
        id: 2,
        name: "Announcements",
        members: [
            {
                name: "Emily Clark",
                avatarUrl: "/images/users/emily.png",
            },
            {
                name: "Liam Wilson",
                avatarUrl: "",
            },
            {
                name: "Olivia Brown",
                avatarUrl: "/images/users/olivia.png",
            },
        ]
    },
    {
        id: 3,
        name: "Project Updates",
        members: [
            {
                name: "Liam Wilson",
                avatarUrl: "",
            },
            {
                name: "Noah Martinez",
                avatarUrl: "",
            },
            {
                name: "Mason Lee",
                avatarUrl: "",
            },
            {
                name: "Isabella White",
                avatarUrl: "",
            },
            {
                name: "Lucas Hall",
                avatarUrl: "/images/users/lucas.png",
            },
        ]
    },
    {
        id: 4,
        name: "Marketing Team Insights",
        members: [
            {
                name: "Noah Martinez",
                avatarUrl: "",
            },
            {
                name: "Ava Garcia",
                avatarUrl: "/images/users/ava.png",
            },
            {
                name: "Mason Lee",
                avatarUrl: "",
            },
            {
                name: "Isabella White",
                avatarUrl: "",
            },
            {
                name: "Lucas Hall",
                avatarUrl: "/images/users/lucas.png",
            },
        ]
    },
    {
        id: 5,
        name: "Design Team",
        members: [
            {
                name: "Emily Clark",
                avatarUrl: "/images/users/emily.png",
            },
            {
                name: "James Anderson",
                avatarUrl: "/images/users/james.png",
            },
            {
                name: "Sophia Turner",
                avatarUrl: "/images/users/sophia.png",
            },
            {
                name: "Isabella White",
                avatarUrl: "",
            },
            {
                name: "Lucas Hall",
                avatarUrl: "/images/users/lucas.png",
            },
        ]
    },
    {
        id: 6,
        name: "Technical Support and Issues",
        members: [
            {
                name: "Isabella White",
                avatarUrl: "",
            },
            {
                name: "Lucas Hall",
                avatarUrl: "/images/users/lucas.png",
            },
        ]
    },
    {
        id: 7,
        name: "Customer Success Stories",
        members: [
            {
                name: "Emily Clark",
                avatarUrl: "/images/users/emily.png",
            },
            {
                name: "James Anderson",
                avatarUrl: "/images/users/james.png",
            },
            {
                name: "Sophia Turner",
                avatarUrl: "/images/users/sophia.png",
            },
            {
                name: "Noah Martinez",
                avatarUrl: "",
            },
            {
                name: "Ava Garcia",
                avatarUrl: "/images/users/ava.png",
            },
            {
                name: "Mason Lee",
                avatarUrl: "",
            },
            {
                name: "Isabella White",
                avatarUrl: "",
            },
            {
                name: "Lucas Hall",
                avatarUrl: "/images/users/lucas.png",
            },
        ]
    },
    {
        id: 8,
        name: "Random Thoughts and Ideas",
        members: [
            {
                name: "Mason Lee",
                avatarUrl: "",
            },
            {
                name: "Isabella White",
                avatarUrl: "",
            },
            {
                name: "Lucas Hall",
                avatarUrl: "/images/users/lucas.png",
            },
        ]
    },
    {
        id: 9,
        name: "Sales",
        members: [
            {
                name: "Emily Clark",
                avatarUrl: "/images/users/emily.png",
            },
            {
                name: "James Anderson",
                avatarUrl: "/images/users/james.png",
            },
            {
                name: "Sophia Turner",
                avatarUrl: "/images/users/sophia.png",
            },
            {
                name: "Olivia Brown",
                avatarUrl: "/images/users/olivia.png",
            },
            {
                name: "Ava Garcia",
                avatarUrl: "/images/users/ava.png",
            },
            {
                name: "Lucas Hall",
                avatarUrl: "/images/users/lucas.png",
            },
        ]
    },
    {
        id: 10,
        name: "HR Announcements and Policies",
        members: [
            {
                name: "Liam Wilson",
                avatarUrl: "",
            },
            {
                name: "Noah Martinez",
                avatarUrl: "",
            },
            {
                name: "Mason Lee",
                avatarUrl: "",
            },
            {
                name: "Isabella White",
                avatarUrl: "",
            },
        ]
    }
];

const messages = [
    {id: 1, name: "Emily Clark"},
    {id: 2, name: "James Anderson"},
    {id: 3, name: "Sophia Turner"},
    {id: 4, name: "Liam Wilson"},
    {id: 5, name: "Olivia Brown"},
    {id: 6, name: "Noah Martinez"},
    {id: 7, name: "Ava Garcia"},
    {id: 8, name: "Mason Lee"},
    {id: 9, name: "Isabella White"},
    {id: 10, name: "Lucas Hall"}
];

const activeTitle = computed(() => {
    if (props.activeChannelId !== null) {
        return channels.find(channel => channel.id === props.activeChannelId)?.name || '';
    }
    if (props.activeMessageId !== null) {
        return messages.find(message => message.id === props.activeMessageId)?.name || '';
    }
    return 'Select a chat or channel';
});

const activeMembers = computed(() => {
    return props.activeChannelId !== null
        ? channels.find(channel => channel.id === props.activeChannelId)?.members || []
        : [];
});
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.message-panel {
    height: 100%;
    background-color: $color-white;
    box-shadow: $box-shadow;
    border-radius: $border-radius;
}
</style>