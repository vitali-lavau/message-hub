import type { Message } from '~/types/Message';

export const messageHistory: Record<number, Message[]> = {
    1: [
        {
            id: 101,
            sender: "Emily Clark",
            content: "Hello! How are you?",
            timestamp: "2023-10-01 10:00",
            avatarUrl: "/images/users/emily.png",
            reactions: { '😍': 2, '👍': 1 },
            chatId: 1
        },
        {
            id: 102,
            sender: "Rene Bohnsack",
            content: "Hi Emily! I'm good, thanks! What about you?",
            timestamp: "2023-10-01 10:05",
            avatarUrl: "/images/users/rene.png",
            reactions: { '😂': 1, '👍': 2 },
            chatId: 1
        },
        {
            id: 103,
            sender: "Emily Clark",
            content: "I've been traveling lately, lots of new experiences!",
            timestamp: "2023-10-01 10:10",
            avatarUrl: "/images/users/emily.png",
            reactions: {},
            chatId: 1
        },
        {
            id: 104,
            sender: "Rene Bohnsack",
            content: "That sounds amazing! Where did you go?",
            timestamp: "2023-10-01 10:15",
            avatarUrl: "/images/users/rene.png",
            reactions: { '👍': 3 },
            chatId: 1
        },
        {
            id: 105,
            sender: "Emily Clark",
            content: "Visited Italy and France! The architecture and food were incredible.",
            timestamp: "2023-10-01 10:20",
            avatarUrl: "/images/users/emily.png",
            reactions: {},
            chatId: 1
        }
    ],
    2: [
        {
            id: 201,
            sender: "James Anderson",
            content: "Are you coming to the meeting tomorrow?",
            timestamp: "2023-10-01 11:00",
            avatarUrl: "/images/users/james.png",
            reactions: {},
            chatId: 2
        },
        {
            id: 202,
            sender: "Rene Bohnsack",
            content: "Yes, I'll be there!",
            timestamp: "2023-10-01 11:15",
            avatarUrl: "/images/users/rene.png",
            reactions: {},
            chatId: 2
        },
        {
            id: 203,
            sender: "James Anderson",
            content: "Great! We have a lot to discuss about the new project.",
            timestamp: "2023-10-01 11:20",
            avatarUrl: "/images/users/james.png",
            reactions: {},
            chatId: 2
        },
        {
            id: 204,
            sender: "Rene Bohnsack",
            content: "I'm looking forward to it. Any specific topics to prepare?",
            timestamp: "2023-10-01 11:25",
            avatarUrl: "/images/users/rene.png",
            reactions: {},
            chatId: 2
        },
        {
            id: 205,
            sender: "James Anderson",
            content: "Mainly the budget and timeline. I’ll bring the documents.",
            timestamp: "2023-10-01 11:30",
            avatarUrl: "/images/users/james.png",
            reactions: {},
            chatId: 2
        }
    ],
    3: [
        {
            id: 301,
            sender: "Sophia Turner",
            content: "Hey, check out this new article I found.",
            timestamp: "2023-10-01 12:00",
            avatarUrl: "/images/users/sophia.png",
            reactions: {},
            chatId: 3
        },
        {
            id: 302,
            sender: "Rene Bohnsack",
            content: "Thanks, Sophia! Looks interesting.",
            timestamp: "2023-10-01 12:05",
            avatarUrl: "/images/users/rene.png",
            reactions: {},
            chatId: 3
        },
        {
            id: 303,
            sender: "Sophia Turner",
            content: "It talks about trends in technology for next year.",
            timestamp: "2023-10-01 12:10",
            avatarUrl: "/images/users/sophia.png",
            reactions: {},
            chatId: 3
        },
        {
            id: 304,
            sender: "Rene Bohnsack",
            content: "I'll give it a read tonight. Let’s discuss it later?",
            timestamp: "2023-10-01 12:15",
            avatarUrl: "/images/users/rene.png",
            reactions: {},
            chatId: 3
        },
        {
            id: 305,
            sender: "Sophia Turner",
            content: "Sure! Let me know what you think.",
            timestamp: "2023-10-01 12:20",
            avatarUrl: "/images/users/sophia.png",
            reactions: {},
            chatId: 3
        }
    ],
    4: [
        {
            id: 401,
            sender: "Liam Wilson",
            content: "Hey Rene, did you get the latest report?",
            timestamp: "2023-10-02 09:00",
            avatarUrl: "",
            reactions: {},
            chatId: 4
        },
        {
            id: 402,
            sender: "Rene Bohnsack",
            content: "Yes, I received it yesterday. Looks good!",
            timestamp: "2023-10-02 09:05",
            avatarUrl: "/images/users/rene.png",
            reactions: {},
            chatId: 4
        },
        {
            id: 403,
            sender: "Liam Wilson",
            content: "Great. Let’s review it together before the meeting?",
            timestamp: "2023-10-02 09:10",
            avatarUrl: "",
            reactions: {},
            chatId: 4
        },
        {
            id: 404,
            sender: "Rene Bohnsack",
            content: "Sounds like a plan. I'll prepare some notes.",
            timestamp: "2023-10-02 09:15",
            avatarUrl: "/images/users/rene.png",
            reactions: {},
            chatId: 4
        },
        {
            id: 405,
            sender: "Liam Wilson",
            content: "Perfect. See you in the office at 10.",
            timestamp: "2023-10-02 09:20",
            avatarUrl: "",
            reactions: {},
            chatId: 4
        }
    ]
};