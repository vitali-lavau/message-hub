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
            <ChannelItem
                v-for="channel in filteredChannels"
                :key="channel.id"
                :id="channel.id"
                :name="channel.name"
                :isActive="activeItem?.type === 'channel' && activeItem?.id === channel.id"
                @click="setActiveItem('channel', channel.id)"
            />
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
                <AddMembers @update:selected-items="handleSelectedItems"/>
            </template>
            <template #footer>
                <ButtonBase
                    @click="closeModal"
                    label="Cancel"/>
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
import ButtonAdd from "~/components/ui/ButtonAdd.vue";
import ChannelItem from "~/components/sidebar/ChannelItem.vue";
import ModalBase from "~/components/modals/ModalBase.vue";
import InputName from "~/components/ui/InputName.vue";
import AddMembers from "~/components/modals/AddMembers.vue";
import {fetchChannels} from "~/services/channelService";
import type {Channel} from "~/types/Channel";
import {useUserStore} from "~/stores/userStore";
import ButtonPrimary from "~/components/ui/ButtonPrimary.vue";
import ButtonBase from "~/components/ui/ButtonBase.vue";
import {useChatStore} from '~/stores/chatStore';

const channels = ref<Channel[]>([]);
const chatStore = useChatStore();
const channelName = ref('');
const selectedMembers = ref<number[]>([]);

const props = defineProps<{
    searchQuery: string;
    activeItem: { type: string; id: string | number } | null;
}>()

const emit = defineEmits<{
    (e: 'setActiveItem', type: 'channel', id: string | number): void;
}>();

function setActiveItem(type: 'channel', id: string | number) {
    emit('setActiveItem', type, id);
}

onMounted(async () => {
    const userStore = useUserStore();
    const userId = userStore.user.id;
    channels.value = await fetchChannels(userId);
});

const filteredChannels = computed(() => {
    return channels.value.filter(channel =>
        channel.name.toLowerCase().includes(props.searchQuery.toLowerCase())
    );
});

const isModalOpen = ref(false);

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
    channelName.value = '';
}

function handleSelectedItems(selectedItems: number[]) {
    selectedMembers.value = selectedItems;
}

async function createChannel() {
    if (!channelName.value) return;

    try {
        console.log(selectedMembers.value)
        await chatStore.createNewChannel(channelName.value, selectedMembers.value);
        channelName.value = '';
        closeModal();
    } catch (error) {
        console.error('Ошибка при создании канала:', error);
    }
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