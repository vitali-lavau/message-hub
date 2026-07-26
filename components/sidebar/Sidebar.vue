<template>
    <aside class="sidebar flex flex-col" aria-label="Conversations">
        <div class="sidebar__compact-header">
            <strong>Messages</strong>
            <button
                type="button"
                class="sidebar__close"
                aria-label="Close conversations"
                @click="emit('close')"
            >
                <span aria-hidden="true">×</span>
            </button>
        </div>
        <CurrentUserSwitcher />
        <UserSearch
            :value="uiStore.searchQuery"
            aria-label="Search people, chats, and messages"
            placeholder="Search people, chats, messages..."
            @update-search="updateSearchQuery"
        />
        <DemoControls @reset="emit('reset-demo')" @retry="emit('retry-demo')" />
        <SearchResults
            v-if="uiStore.searchQuery.trim()"
            @conversation-selected="emit('conversation-selected')"
        />
        <div v-else class="sidebar__navigation">
            <ChannelsList class="section" @conversation-selected="emit('conversation-selected')" />
            <DirectMessages
                class="section"
                @conversation-selected="emit('conversation-selected')"
            />
        </div>
    </aside>
</template>

<script setup lang="ts">
import UserSearch from '~/components/sidebar/UserSearch.vue';
import CurrentUserSwitcher from '~/components/sidebar/CurrentUserSwitcher.vue';
import DemoControls from '~/components/demo/DemoControls.vue';
import ChannelsList from '~/components/sidebar/ChannelsList.vue';
import DirectMessages from '~/components/sidebar/DirectMessages.vue';
import SearchResults from '~/components/sidebar/SearchResults.vue';
import { useUiStore } from '~/stores/uiStore';

const uiStore = useUiStore();
const emit = defineEmits<{
    (event: 'close'): void;
    (event: 'conversation-selected'): void;
    (event: 'reset-demo'): void;
    (event: 'retry-demo'): void;
}>();

function updateSearchQuery(query: string) {
    uiStore.setSearchQuery(query);
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.sidebar {
    width: 340px;
    height: 100%;
    padding: $spacing-md $spacing-lg;
    flex-shrink: 0;
    background-color: $color-white;
    box-shadow: $box-shadow;
    border-radius: $border-radius;

    &__compact-header {
        display: none;
    }

    .search,
    .channels {
        margin: 0 0 $spacing-lg;
    }

    &__navigation {
        min-height: 0;
        flex: 1;
        padding-right: $spacing-sm;
        overflow-x: hidden;
        overflow-y: auto;

        .section + .section {
            margin-top: $spacing-lg;
        }
    }
}

@media (max-width: 1023px) {
    .sidebar {
        width: 100%;

        &__compact-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: $spacing-m;
            color: $color-text;
            font-size: $font-size-lg;
        }

        &__close {
            width: 36px;
            height: 36px;
            display: grid;
            place-items: center;
            color: $color-secondary;
            font-size: 26px;
            line-height: 1;
            border-radius: 50%;
        }
    }
}

@media (max-width: 767px) {
    .sidebar {
        padding: calc(#{$spacing-md} + env(safe-area-inset-top)) $spacing-md
            calc(#{$spacing-md} + env(safe-area-inset-bottom));
        border-radius: 0;
        box-shadow: none;
        overflow-x: hidden;
        overflow-y: auto;
        scrollbar-width: none;

        &::-webkit-scrollbar {
            display: none;
        }

        &__navigation {
            padding-right: 0;
            overflow: visible;
        }
    }
}
</style>
