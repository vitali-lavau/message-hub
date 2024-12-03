<template>
    <div class="add-members">
        <div class="add-members__title">Add Members</div>
        <UserSearch
            class="add-members__search"
            @updateSearch="updateSearchQuery"
            placeholder="Type name..."
        />

        <div class="add-members__list">
            <client-only>
                <DirectMessageItem
                    v-for="direct in filteredDirects"
                    :key="direct.id"
                    :name="direct.name"
                    :imageUrl="direct.imageUrl"
                    :isIcon="true"
                    :isSelected="selectedDirects.includes(direct.id)"
                    @update:selected="toggleSelection(direct.id)"
                />
            </client-only>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import {useDirectsStore} from "~/stores/directsStore";
import UserSearch from "~/components/sidebar/UserSearch.vue";
import DirectMessageItem from "~/components/sidebar/DirectMessageItem.vue";

const directsStore = useDirectsStore();
const directs = computed(() => directsStore.directs);
const searchQuery = ref('');
const selectedDirects = ref<string[]>([]);
const emit = defineEmits(['updateSelectedUsers']);

function updateSearchQuery(value: string) {
    searchQuery.value = value;
}

const filteredDirects = computed(() =>
    directs.value.filter(direct =>
        direct.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
);

function toggleSelection(id: string) {
    const index = selectedDirects.value.indexOf(id);
    if (index === -1) {
        selectedDirects.value.push(id);
    } else {
        selectedDirects.value.splice(index, 1);
    }
    emitSelectedDirects();
}

function emitSelectedDirects() {
    emit('updateSelectedUsers', selectedDirects.value);
}
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.add-members {

    &__title {
        margin: 0 0 $spacing-l;
        color: $color-text;
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
    }

    &__search {
        margin: 0 0 $spacing-l;
    }

    &__list {
        max-height: 300px;
        padding: 0 $spacing-l 0 0;
        overflow: auto;

        .direct-message-item {
            margin:  0 0 $spacing-m;
        }
    }
}
</style>