<template>
    <div class="channels">
        <div class="channels__head flex items-center justify-between">
            <h2 class="channels__title subtitle">Channels</h2>
            <ButtonAdd
                @click="openModal"
                label="Add"
            />
        </div>

        <div class="channels__list">
            <client-only>
                <ChannelItem
                    v-for="channel in filteredChannels"
                    :key="channel.id"
                    :channel="channel"
                    :id="channel.id"
                    :name="channel.name"
                    :isActive="activeItem?.type === 'channel' && activeItem?.id === channel.id"
                    @click="handleChannelItemClick(channel)"
                />
            </client-only>
        </div>

        <ModalBase
            :open="isModalOpen"
            @close="closeModal"
        >
            <template #header>
                <h3>Channel Name</h3>
                <InputName
                    v-model="channelName"
                    placeholder="Type name..."
                />
            </template>
            <template #body>
                <AddMembers @updateSelectedUsers="updateSelectedUsers"/>
            </template>
            <template #footer>
                <ButtonBase
                    @click="closeModal"
                    label="Cancel"
                />
                <ButtonPrimary
                    @click="createChannel"
                    label="Create"
                    style="margin-left: 16px;"
                />
            </template>
        </ModalBase>
    </div>
</template>

<script setup lang="ts">
import {useChannelsStore} from '@/stores/channelsStore';
import {createChannel as sendCreateChannelRequest} from '@/services/websocketChannelService';
import {useHeaderStore} from "~/stores/useHeaderStore";
import {useParticipantsStore} from "~/stores/useParticipants";
import ButtonAdd from "~/components/ui/ButtonAdd.vue";
import ChannelItem from "~/components/sidebar/ChannelItem.vue";
import ModalBase from "~/components/modals/ModalBase.vue";
import InputName from "~/components/ui/InputName.vue";
import ButtonBase from "~/components/ui/ButtonBase.vue";
import ButtonPrimary from "~/components/ui/ButtonPrimary.vue";
import AddMembers from "~/components/modals/AddMembers.vue";
import type {Channel} from "~/types/Channel";

const props = defineProps<{
    searchQuery: string;
    activeItem: { type: string; id: string | number } | null;
}>()
const channelsStore = useChannelsStore();
const channels = computed(() => channelsStore.channels);
const isModalOpen = ref(false);
const channelName = ref('');
const selectedUsers = ref<string[]>([]);
const headerStore = useHeaderStore();
const participantsStore = useParticipantsStore();

const emit = defineEmits<{
    (e: 'setActiveItem', type: 'channel', id: string | number): void;
}>();

function setActiveItem(type: 'channel', id: string | number) {
    emit('setActiveItem', type, id);
}

const filteredChannels = computed(() => {
    return channels.value.filter(channel =>
        channel.name.toLowerCase().includes(props.searchQuery.toLowerCase())
    );
});

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
    channelName.value = '';
    selectedUsers.value = [];
}

function updateSelectedUsers(users: string[]) {
    selectedUsers.value = users;
    console.log('Selected Users:', users);
}

async function createChannel() {
    if (!channelName.value) {
        alert('The channel name cannot be empty');
        return;
    }

    if (selectedUsers.value.length === 0) {
        alert('Please select at least one user');
        return;
    }

    try {
        const userIds = selectedUsers.value.map(userId => {
            return userId;
        });

        sendCreateChannelRequest(channelName.value, 'custom', userIds);

        channelName.value = '';
        selectedUsers.value = [];
        closeModal();
    } catch (error) {
        console.error('Error when creating a channel:', error);
    }
}

function handleChannelItemClick(channel: Channel) {
    const newParticipants = channel.users
        ? channel.users.map(user => ({
            name: user.name,
            avatarUrl: user.avatarUrl || '',
        }))
        : [];

    headerStore.setTitle(channel.name);
    participantsStore.setParticipants(newParticipants);
    setActiveItem('channel', channel.id);
}
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.channels {

    &__head {
        margin: 0 0 $spacing-lg;
    }

    &__list {
        padding: 0 $spacing-lg 0 0;
        overflow-y: auto;
        overflow-x: visible;

        .channel-item {
            margin: 0 0 $spacing-md;

            &:last-child {
                margin-bottom: 0;
            }
        }
    }
}
</style>