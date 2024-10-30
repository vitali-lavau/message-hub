<template>
    <div class="channel-members flex items-center">
        <ul class="channel-members__list flex items-center">
            <li v-for="(member, index) in visibleMembers" :key="index" class="channel-members__item">
                <Avatar :name="member.name" :imageUrl="member.avatarUrl"/>
            </li>
        </ul>

        <div v-if="extraMembersCount" class="channel-members__extra">
            +{{ extraMembersCount }}
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from "~/components/ui/Avatar.vue";

const props = defineProps<{
    members: { name: string; avatarUrl: string }[];
}>();

const visibleMembers = computed(() => props.members.slice(0, 3));
const extraMembersCount = computed(() => props.members.length > 3 ? props.members.length - 3 : 0);
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.channel-members {

    &__list {
        margin: 0 $spacing-sm 0 0;
    }

    &__item {
        width: $spacing-xl;
        height: $spacing-xl;
        border-radius: 50%;
        overflow: hidden;

        &:nth-child(odd) {
            border: 1px solid $color-white;
        }

        &:not(:first-child) {
            margin: 0 0 0 -8px;
        }

        .avatar {
            width: 100%;
            height: 100%;
        }
    }
}
</style>