<template>
    <div
        class="direct-message-item flex"
        :class="{
            'direct-message-item--active': props.isActive,
            'direct-message-item--selected': isSelected
        }"
        @click="toggleSelection"
    >
        <Avatar :name="name" :imageUrl="imageUrl"/>
        <div class="direct-message-item__name">
            {{ name }}
            <div v-if="isIcon" class="direct-message-item__icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect width="20" height="20" rx="10" fill="#1E2EB7"/>
                    <path
                        d="M12.9706 6.97047C13.1115 6.83636 13.299 6.76222 13.4935 6.76369C13.688 6.76516 13.8743 6.84214 14.0131 6.97836C14.1519 7.11459 14.2324 7.29942 14.2375 7.49385C14.2427 7.68828 14.1721 7.8771 14.0406 8.02047L10.0506 13.0105C9.98204 13.0844 9.89923 13.1437 9.80718 13.1848C9.71513 13.226 9.61572 13.2482 9.5149 13.2501C9.41408 13.2519 9.31392 13.2334 9.2204 13.1957C9.12689 13.158 9.04194 13.1018 8.97065 13.0305L6.32465 10.3845C6.25096 10.3158 6.19186 10.233 6.15086 10.141C6.10987 10.049 6.08783 9.9497 6.08605 9.849C6.08428 9.74829 6.1028 9.64827 6.14052 9.55488C6.17824 9.46149 6.23439 9.37666 6.30561 9.30544C6.37683 9.23422 6.46166 9.17807 6.55505 9.14035C6.64844 9.10263 6.74847 9.08411 6.84917 9.08588C6.94987 9.08766 7.04918 9.1097 7.14118 9.15069C7.23318 9.19169 7.31598 9.25079 7.38465 9.32447L9.47865 11.4175L12.9516 6.99248L12.9706 6.97047Z"
                        fill="white"/>
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Avatar from "~/components/ui/Avatar.vue";

const props = defineProps<{
    name: string;
    imageUrl?: string;
    isSelected?: boolean;
    isIcon?: boolean;
    isActive?: boolean;
}>();

const emit = defineEmits(['update:selected']);

function toggleSelection() {
    emit('update:selected');
}
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.direct-message-item {
    width: 100%;
    cursor: pointer;

    &__name {
        position: relative;
        flex: 1;
        padding: $spacing-sm $spacing-md;
        font-size: $font-size-base;
        font-weight: $font-weight-semibold;
        line-height: $line-height-lg;
        color: $color-text;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        border-radius: 20px;
        background-color: $color-background-gray-second;
        transition: background-color .4s ease;
    }

    &__unread {
        position: absolute;
        top: 50%;
        right: $spacing-sm;
        padding: 2px 4px;
        color: $color-white;
        font-size: 10px;
        font-weight: $font-weight-semibold;
        line-height: $line-height-base;
        border-radius: 20px;
        background-color: $color-accent;
        transform: translateY(-50%);
    }

    &__icon {
        position: absolute;
        top: 50%;
        right: $spacing-m;
        width: 20px;
        height: 20px;
        transform: translateY(-50%);
        visibility: hidden;
        opacity: 0;
        transition: opacity .4s ease, visibility .4s ease;

        svg {
            width: 100%;
            height: 100%;
        }
    }

    .avatar {
        flex-shrink: 0;
        margin: 0 $spacing-sm 0 0;
    }

    &:hover {

        .direct-message-item__name {
            background-color: $color-info-light;
        }
    }

    &.direct-message-item--active {

        .direct-message-item__name {
            background-color: $color-info;
        }
    }

    &.direct-message-item--selected {
        .direct-message-item__name {
            background-color: $color-info;
        }

        .direct-message-item__icon {
            visibility: visible;
            opacity: 1;
        }
    }
}
</style>