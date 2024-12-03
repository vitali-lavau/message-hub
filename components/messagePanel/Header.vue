<template>
    <div class="message-header flex justify-between items-center">
        <div class="message-header__title">{{ title }}</div>
        <ChannelMembers v-if="participants && participants.length" :members="participants" />
        <DropdownMembers/>
    </div>
</template>

<script setup lang="ts">
import {useHeaderStore} from "~/stores/useHeaderStore";
import {useParticipantsStore} from "~/stores/useParticipants";
import DropdownMembers from "~/components/ui/DropdownMembers.vue";
import ChannelMembers from "~/components/messagePanel/ChannelMembers.vue";

const headerStore = useHeaderStore();
const participantsStore = useParticipantsStore();

const title = computed(() => headerStore.title);
const participants = computed(() => participantsStore.participants);
</script>

<style lang="scss">
@use "assets/scss/variables" as *;

.message-header {
    height: 56px;
    padding: $spacing-m $spacing-xxl;
    border-radius: $border-radius $border-radius 0 0;
    background: $color-info;

    &__title {
        color: $color-text;
        font-size: $font-size-lg;
        font-weight: $font-weight-bold;
        line-height: $line-height-base;
    }

    .channel-members {
        margin-left: auto;
    }

    .dropdown-members {
        margin: 0 0 0 $spacing-xl;
    }
}
</style>