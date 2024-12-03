<template>
    <div class="direct-messages">
        <div class="direct-messages__head flex items-center justify-between">
            <h2 class="direct-messages__title subtitle">Direct messages</h2>
            <ButtonAddDirectMessage @click="openModal" />
        </div>

        <div class="direct-messages__list">
            <client-only>
                <DirectMessageItem
                    v-for="direct in filteredDirects"
                    :key="direct.id"
                    :name="direct.name"
                    :imageUrl="direct.imageUrl"
                    :isActive="activeItem?.type === 'directMessage' && activeItem?.id === direct.id"
                    @click="handleDirectMessageClick(direct)"
                />
            </client-only>
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
import {useDirectsStore} from "~/stores/directsStore";
import {useHeaderStore} from "~/stores/useHeaderStore";
import DirectMessageItem from "~/components/sidebar/DirectMessageItem.vue";
import ButtonAddDirectMessage from "~/components/ui/ButtonAddDirectMessage.vue";
import ModalBase from "~/components/modals/ModalBase.vue";
import WriteTo from "~/components/modals/WriteTo.vue";
import ButtonBase from "~/components/ui/ButtonBase.vue";

const props = defineProps<{
    searchQuery: string;
    activeItem: { type: string; id: string | number } | null;
}>();
const directsStore = useDirectsStore();
const directs = computed(() => directsStore.directs);
const isModalOpen = ref(false);
const headerStore = useHeaderStore();

const emit = defineEmits<{
    (e: 'setActiveItem', type: 'directMessage', id: string | number): void;
}>();

function setActiveItem(type: 'directMessage', id: string | number) {
    emit('setActiveItem', type, id);
}

const filteredDirects = computed(() => {
    return directs.value.filter(direct =>
        direct.name.toLowerCase().includes(props.searchQuery.toLowerCase())
    );
});

function openModal() {
    isModalOpen.value = true;
}

function closeModal() {
    isModalOpen.value = false;
}

function handleDirectMessageClick(direct: { id: string | number; name: string }) {
    headerStore.setTitle(direct.name);
    setActiveItem('directMessage', direct.id);
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