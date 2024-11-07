import type {DirectMessageItemProps} from '~/types/DirectMessageItemProps';

export const messagesForUser1: DirectMessageItemProps[] = [
    {id: 9999, name: "Emily Clark", imageUrl: "/images/users/emily.png", unreadCount: 3, chatId: 1},
    {id: 2, name: "James Anderson", imageUrl: "/images/users/james.png", chatId: 2},
    {id: 3, name: "Sophia Turner", imageUrl: "/images/users/sophia.png", chatId: 3},
    {id: 4, name: "Liam Wilson", imageUrl: "", chatId: 4},
    {id: 5, name: "Olivia Brown", imageUrl: "/images/users/olivia.png", chatId: 5},
    {id: 6, name: "Noah Martinez", imageUrl: "", chatId: 6},
    {id: 7, name: "Ava Garcia", imageUrl: "/images/users/ava.png", chatId: 7},
    {id: 8, name: "Mason Lee", imageUrl: "", unreadCount: 2, chatId: 8},
    {id: 9, name: "Isabella White", imageUrl: "", chatId: 9},
    {id: 10, name: "Lucas Hall", imageUrl: "/images/users/lucas.png", chatId: 10}
];

export const messagesForOtherUsers: DirectMessageItemProps[] = [
    {id: 11, name: "John Doe", imageUrl: "/images/users/john.png", unreadCount: 1, chatId: 11},
    {id: 12, name: "Jane Smith", imageUrl: "/images/users/jane.png", chatId: 12}
];
