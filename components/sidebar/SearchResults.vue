<template>
    <div class="search-results">
        <p class="search-results__summary">
            {{ totalResults }} results for “{{ uiStore.searchQuery.trim() }}”
        </p>

        <section v-if="matchedConversations.length">
            <h2>Conversations</h2>
            <button
                v-for="conversation in matchedConversations"
                :key="conversation.id"
                type="button"
                class="search-results__item"
                @click="openConversation(conversation.id)"
            >
                <span class="search-results__icon">
                    {{ conversation.type === 'group' ? '#' : '@' }}
                </span>
                <span>
                    <strong>{{ conversationsStore.getConversationTitle(conversation) }}</strong>
                    <small>
                        {{ conversation.type === 'group' ? 'Channel or group' : 'Direct message' }}
                    </small>
                </span>
            </button>
        </section>

        <section v-if="matchedUsers.length">
            <h2>People</h2>
            <button
                v-for="user in matchedUsers"
                :key="user.id"
                type="button"
                class="search-results__item"
                @click="openDirect(user.id)"
            >
                <Avatar :name="user.name" :image-url="user.avatarUrl" :status="user.status" />
                <span>
                    <strong>{{ user.name }}</strong>
                    <small>{{ user.role }}</small>
                </span>
            </button>
        </section>

        <section v-if="matchedMessages.length">
            <h2>Messages</h2>
            <button
                v-for="message in matchedMessages"
                :key="message.id"
                type="button"
                class="search-results__item search-results__item--message"
                @click="openMessage(message.conversationId, message.id)"
            >
                <span>
                    <strong>
                        {{ usersStore.getUserById(message.authorId)?.name ?? 'Unknown user' }}
                        ·
                        {{
                            conversationsStore.getConversationTitle(
                                conversationsStore.getConversationById(message.conversationId)
                            )
                        }}
                    </strong>
                    <small>{{ message.text }}</small>
                </span>
            </button>
        </section>

        <p v-if="totalResults === 0" class="search-results__empty">
            Nothing found. Try a person, conversation, role, or message text.
        </p>
    </div>
</template>

<script setup lang="ts">
import Avatar from '~/components/ui/Avatar.vue';
import { useConversationsStore } from '~/stores/conversationsStore';
import { useMessagesStore } from '~/stores/messagesStore';
import { useUiStore } from '~/stores/uiStore';
import { useUsersStore } from '~/stores/usersStore';

const conversationsStore = useConversationsStore();
const messagesStore = useMessagesStore();
const uiStore = useUiStore();
const usersStore = useUsersStore();
const emit = defineEmits<{
    (event: 'conversation-selected'): void;
}>();

const normalizedQuery = computed(() => uiStore.searchQuery.trim().toLowerCase());
const availableConversationIds = computed(
    () => new Set(conversationsStore.availableConversations.map((conversation) => conversation.id))
);

const matchedConversations = computed(() =>
    conversationsStore.availableConversations
        .filter((conversation) =>
            conversationsStore
                .getConversationTitle(conversation)
                .toLowerCase()
                .includes(normalizedQuery.value)
        )
        .slice(0, 6)
);

const matchedUsers = computed(() =>
    usersStore.selectableUsers
        .filter(
            (user) =>
                user.name.toLowerCase().includes(normalizedQuery.value) ||
                user.role.toLowerCase().includes(normalizedQuery.value) ||
                user.bio.toLowerCase().includes(normalizedQuery.value)
        )
        .slice(0, 6)
);

const matchedMessages = computed(() =>
    messagesStore.messages
        .filter(
            (message) =>
                availableConversationIds.value.has(message.conversationId) &&
                message.text.toLowerCase().includes(normalizedQuery.value)
        )
        .sort(
            (first, second) =>
                new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
        )
        .slice(0, 8)
);

const totalResults = computed(
    () =>
        matchedConversations.value.length + matchedUsers.value.length + matchedMessages.value.length
);

function openConversation(conversationId: string) {
    conversationsStore.selectConversation(conversationId);
    uiStore.openSearchResult();
    emit('conversation-selected');
}

function openDirect(userId: string) {
    conversationsStore.findOrCreateDirect(userId);
    uiStore.openSearchResult();
    emit('conversation-selected');
}

function openMessage(conversationId: string, messageId: string) {
    conversationsStore.selectConversation(conversationId);
    uiStore.openSearchResult(messageId);
    emit('conversation-selected');
}
</script>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.search-results {
    min-height: 0;
    flex: 1;
    padding-right: $spacing-sm;
    overflow-y: auto;

    &__summary {
        margin: 0 0 $spacing-md;
        color: $color-gray-second;
        font-size: $font-size-xs;
    }

    section + section {
        margin-top: $spacing-lg;
    }

    h2 {
        margin: 0 0 $spacing-sm;
        color: $color-text;
        font-size: $font-size-sm;
        font-weight: $font-weight-bold;
    }

    &__item {
        width: 100%;
        display: flex;
        align-items: center;
        gap: $spacing-sm;
        padding: $spacing-sm;
        color: $color-text;
        text-align: left;
        border-radius: 8px;

        &:hover {
            background: $color-info-light;
        }

        > span:last-child {
            min-width: 0;
            display: flex;
            flex: 1;
            flex-direction: column;
        }

        strong,
        small {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        strong {
            font-size: $font-size-sm;
        }

        small {
            margin-top: 2px;
            color: $color-gray-second;
            font-size: $font-size-xs;
        }

        &--message {
            align-items: flex-start;
            padding-left: $spacing-md;
            border-left: 2px solid $color-info;
            border-radius: 0 8px 8px 0;
        }
    }

    &__icon {
        width: 30px;
        height: 30px;
        display: grid;
        flex-shrink: 0;
        place-items: center;
        color: $color-secondary;
        font-weight: $font-weight-bold;
        background: $color-info-light;
        border-radius: 50%;
    }

    &__empty {
        margin: $spacing-xl 0 0;
        color: $color-gray-second;
        font-size: $font-size-sm;
        line-height: $line-height-lg;
        text-align: center;
    }
}
</style>
