<template>
    <div class="direct-messages">
        <div class="direct-messages__head flex items-center justify-between">
            <h2 class="direct-messages__title subtitle">Direct messages</h2>
            <ButtonAddDirectMessage @click="openModal" />
        </div>

        <div class="direct-messages__list">
            <DirectMessageItem
                v-for="message in chatStore.filteredAndSortedContacts"
                :key="message.id"
                :id="message.id"
                :name="message.name"
                :imageUrl="message.imageUrl"
                :unreadCount="message.unreadCount"
                :chatId="message.chatId"
                :isActive="activeItem?.type === 'directMessage' && activeItem?.id === message.id"
                @click="setActiveItem('directMessage', message.id)"
            />
        </div>

        <ModalBase
            :open="isModalOpen"
            @close="closeModal"
            :showHeader="false"
            :showBody="true"
            :showFooter="false"
            :bodyMarginBottom="0"
        >
            <template #body>
                <WriteTo/>
                <ButtonBase
                    @click="closeModal"
                    label="Cancel"
                    hidden
                />
            </template>
        </ModalBase>
    </div>
</template>

<script setup lang="ts">
import DirectMessageItem from "~/components/sidebar/DirectMessageItem.vue";
import ButtonAddDirectMessage from "~/components/ui/ButtonAddDirectMessage.vue";
import {useChatStore} from "~/stores/chatStore";
import ModalBase from "~/components/modals/ModalBase.vue";
import ButtonBase from "~/components/ui/ButtonBase.vue";
import WriteTo from "~/components/modals/WriteTo.vue";

const chatStore = useChatStore();
const isModalOpen = ref(false);

onMounted(() => {
    chatStore.loadUserMessages();
    chatStore.loadUserChannels();
});

const props = defineProps<{
    searchQuery: string;
    activeItem: { type: string; id: string | number } | null;
}>();

const emit = defineEmits<{
    (e: 'setActiveItem', type: 'directMessage', id: string | number): void;
}>();

function setActiveItem(type: 'directMessage', id: string | number) {
    emit('setActiveItem', type, id);

    chatStore.setActiveChat(Number(id));
    chatStore.setActiveUser(Number(id));
    console.log("История сообщений для чата:", chatStore.activeMessages);
}

watch(
    () => props.searchQuery,
    (newQuery) => {
        chatStore.setSearchQuery(newQuery)
    },
    { immediate: true }
)

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.direct-messages {

    &__head {
        margin: 0 0 $spacing-lg;
    }

    &__list {
        padding: 0 $spacing-lg 0 0;
        overflow: auto;

        .direct-message-item {
            margin: 0 0 $spacing-md;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>