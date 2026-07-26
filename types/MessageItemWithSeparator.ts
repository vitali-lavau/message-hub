import type { Message } from './Message';
import type MessageItem from '~/components/messagePanel/MessageItem.vue';
import type DateSeparator from '~/components/ui/DateSeparator.vue';

export interface MessageItemWithSeparator {
    id: string;
    type: typeof MessageItem | typeof DateSeparator;
    props: { message?: Message; date?: Date };
}
