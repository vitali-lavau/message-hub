<template>
    <div class="message-header flex justify-between items-center">
        <div class="message-header__title">{{ title }}</div>
        <ChannelMembers v-if="members && members.length" :members="members" />
        <DropdownMembers/>
    </div>
</template>

<script setup lang="ts">
import ChannelMembers from "~/components/messagePanel/ChannelMembers.vue";
import DropdownMembers from "~/components/ui/DropdownMembers.vue";

defineProps<{
    title: string;
    members?: { name: string; avatarUrl: string }[];
}>();
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