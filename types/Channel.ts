import type {Message} from "~/types/Message";

export interface Channel {
    id: string;
    name: string;
    type: string;
    users?: { name: string; avatarUrl: string }[];
    messages?: Message[];
}