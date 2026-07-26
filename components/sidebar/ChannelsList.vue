<template>
    <div class="channels">
        <div class="channels__head flex items-center justify-between">
            <h2 class="channels__title subtitle">Channels</h2>
            <ButtonAdd label="Add" @click="openModal" />
        </div>

        <div class="channels__list">
            <p v-if="!filteredChannels.length" class="channels__empty">
                {{
                    uiStore.searchQuery.trim()
                        ? 'No matching channels'
                        : 'No channels yet. Create one with Add.'
                }}
            </p>
            <ChannelItem
                v-for="channel in filteredChannels"
                :id="channel.id"
                :key="channel.id"
                :name="channel.name || 'Untitled group'"
                :last-message="getLastMessagePreview(channel)"
                :last-message-time="getLastMessageTime(channel)"
                :unread-count="conversationsStore.getUnreadCount(channel)"
                :is-active="conversationsStore.activeConversationId === channel.id"
                @select="selectConversation"
            />
        </div>

        <ModalBase :open="uiStore.isCreateGroupModalOpen" @close="closeModal">
            <template #header>
                <h3>Channel Name</h3>
                <InputName v-model="channelName" placeholder="Type name..." />
            </template>
            <template #body>
                <AddMembers @update:selected-items="handleSelectedItems" />
            </template>
            <template #footer>
                <ButtonBase label="Cancel" @click="closeModal" />
                <ButtonPrimary label="Create" style="margin-left: 16px" @click="createChannel" />
            </template>
        </ModalBase>
    </div>
</template>

<script setup lang="ts">
import ButtonAdd from '~/components/ui/ButtonAdd.vue';
import ChannelItem from '~/components/sidebar/ChannelItem.vue';
import ModalBase from '~/components/modals/ModalBase.vue';
import InputName from '~/components/ui/InputName.vue';
import AddMembers from '~/components/modals/AddMembers.vue';
import ButtonPrimary from '~/components/ui/ButtonPrimary.vue';
import ButtonBase from '~/components/ui/ButtonBase.vue';
import { useConversationsStore } from '~/stores/conversationsStore';
import { useUiStore } from '~/stores/uiStore';
import { useMessagesStore } from '~/stores/messagesStore';
import type { Conversation } from '~/types/Conversation';
import { formatConversationTime, getMessagePreview } from '~/utils/conversationPreview';

const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();
const uiStore = useUiStore();
const channelName = ref('');
const selectedMembers = ref<string[]>([]);
const emit = defineEmits<{
    (event: 'conversation-selected'): void;
}>();

const filteredChannels = computed(() => {
    const searchQuery = uiStore.searchQuery.toLowerCase();
    return conversationsStore.channelConversations.filter((channel) =>
        channel.name?.toLowerCase().includes(searchQuery)
    );
});

function openModal() {
    uiStore.openCreateGroupModal();
}

function closeModal() {
    uiStore.closeCreateGroupModal();
    channelName.value = '';
    selectedMembers.value = [];
}

function handleSelectedItems(selectedItems: string[]) {
    selectedMembers.value = selectedItems;
}

function createChannel() {
    if (!channelName.value.trim()) {
        return;
    }

    conversationsStore.createGroup(channelName.value, selectedMembers.value);
    uiStore.addNotification(`Channel "${channelName.value.trim()}" created`, 'success');
    closeModal();
    emit('conversation-selected');
}

function selectConversation(conversationId: string) {
    conversationsStore.selectConversation(conversationId);
    emit('conversation-selected');
}

function getLastMessagePreview(conversation: Conversation) {
    return getMessagePreview(messagesStore.getMessageById(conversation.lastMessageId));
}

function getLastMessageTime(conversation: Conversation) {
    const message = messagesStore.getMessageById(conversation.lastMessageId);
    return formatConversationTime(message?.createdAt);
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.channels {
    &__head {
        margin: 0 0 $spacing-m;
    }

    &__list {
        min-width: 0;

        .channel-item {
            margin: 0 0 $spacing-sm;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }

    &__empty {
        margin: 0;
        color: $color-gray-second;
        font-size: $font-size-sm;
    }
}
</style>
