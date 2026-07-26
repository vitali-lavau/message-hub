<template>
    <div class="message-panel flex flex-col">
        <Header
            :title="conversationTitle"
            :sidebar-open="sidebarOpen"
            :show-members="conversationsStore.activeConversation?.type === 'group'"
            :member-count="conversationsStore.activeConversation?.participantIds.length"
            @open-sidebar="emit('open-sidebar')"
            @manage-members="uiStore.openManageMembersModal"
        />
        <MessageList
            :key="uiStore.demoDataRevision"
            :messages="messagesStore.activeConversationMessages"
        />
        <TypingIndicator v-if="messagesStore.isBotTypingInActiveConversation" />
        <MessageInput />
        <ManageMembers />
    </div>
</template>

<script setup lang="ts">
import Header from '~/components/messagePanel/Header.vue';
import MessageList from '~/components/messagePanel/MessageList.vue';
import MessageInput from '~/components/messagePanel/MessageInput.vue';
import TypingIndicator from '~/components/messagePanel/TypingIndicator.vue';
import ManageMembers from '~/components/modals/ManageMembers.vue';
import { useConversationsStore } from '~/stores/conversationsStore';
import { useMessagesStore } from '~/stores/messagesStore';
import { useUiStore } from '~/stores/uiStore';

const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();
const uiStore = useUiStore();
defineProps<{
    sidebarOpen?: boolean;
}>();
const emit = defineEmits<{
    (event: 'open-sidebar'): void;
}>();

const conversationTitle = computed(() =>
    conversationsStore.getConversationTitle(conversationsStore.activeConversation)
);
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.message-panel {
    width: 100%;
    height: 100%;
    min-width: 0;
    background-color: $color-white;
    box-shadow: $box-shadow;
    border-radius: $border-radius;
    overflow: hidden;
}

@media (max-width: 767px) {
    .message-panel {
        border-radius: 0;
        box-shadow: none;
    }
}
</style>
