import type { Message } from './Message';
import MessageItem from "~/components/messagePanel/MessageItem.vue";
import DateSeparator from "~/components/ui/DateSeparator.vue";

export interface MessageItemWithSeparator {
    id: string | number;
    type: typeof MessageItem | typeof DateSeparator;
    props: { message?: Message; currentUser?: string; date?: Date };
    isDeleting?: boolean;
}