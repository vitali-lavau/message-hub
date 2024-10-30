<template>
    <div class="message-header flex justify-between items-center">
        <div class="message-header__title">{{ title }}</div>
        <ChannelMembers v-if="members && members.length" :members="members" />
        <MenuButton/>
    </div>
</template>

<script setup lang="ts">
import ChannelMembers from "~/components/messagePanel/ChannelMembers.vue";
import MenuButton from "~/components/ui/MenuButton.vue";

defineProps<{
    title: string;
    members?: { name: string; avatarUrl: string }[];
}>();
</script>

<style scoped lang="scss">
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

    .btn-dots {
        margin-left: $spacing-xl;
    }
}
</style>