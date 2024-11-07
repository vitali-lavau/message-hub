<template>
    <client-only>
        <Menu as="div" class="dropdown-members relative inline-block text-left">
            <div class="flex items-center">
                <MenuButton class="btn-dots">
                    <svg width="7" height="27" viewBox="0 0 7 27" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="3.17578" cy="23.0293" r="3" transform="rotate(-90 3.17578 23.0293)" fill="#808080"/>
                        <circle cx="3.17578" cy="13.0293" r="3" transform="rotate(-90 3.17578 13.0293)" fill="#808080"/>
                        <circle cx="3.17578" cy="3.0293" r="3" transform="rotate(-90 3.17578 3.0293)" fill="#808080"/>
                    </svg>
                </MenuButton>
            </div>

            <transition enter-active-class="transition ease-out duration-100"
                        enter-from-class="transform opacity-0 scale-95" enter-to-class="transform opacity-100 scale-100"
                        leave-active-class="transition ease-in duration-75"
                        leave-from-class="transform opacity-100 scale-100"
                        leave-to-class="transform opacity-0 scale-95">
                <MenuItems
                    class="absolute right-0 z-10 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div class="dropdown-menu flex flex-col">
                        <MenuItem v-slot="{ active }">
                            <a href="#" class="dropdown-menu__link flex items-center justify-between">
                                <span>View all members</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"
                                     fill="none">
                                    <path
                                        d="M9.59961 12.1246L13.7996 7.84961C14.0996 7.54961 14.0996 7.09961 13.7996 6.79961C13.4996 6.49961 13.0496 6.49961 12.7496 6.79961L8.99961 10.4746L5.24961 6.79961C4.94961 6.49961 4.49961 6.49961 4.19961 6.79961C4.04961 6.94961 3.97461 7.09961 3.97461 7.32461C3.97461 7.54961 4.04961 7.69961 4.19961 7.84961L8.39961 12.1246C8.77461 12.4246 9.22461 12.4246 9.59961 12.1246C9.52461 12.1246 9.52461 12.1246 9.59961 12.1246Z"
                                        fill="#001E50"/>
                                </svg>
                            </a>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                            <a href="#" class="dropdown-menu__link flex items-center justify-between">
                                <span>Add Members</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19"
                                     fill="none">
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M9.00001 3.5C9.41422 3.5 9.75001 3.83579 9.75001 4.25V14.75C9.75001 15.1642 9.41422 15.5 9.00001 15.5C8.58579 15.5 8.25 15.1642 8.25 14.75V4.25C8.25 3.83579 8.58579 3.5 9.00001 3.5Z"
                                          fill="#001E50"/>
                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                          d="M3 9.50001C3 9.08579 3.33579 8.75 3.75 8.75H14.25C14.6642 8.75 15 9.08579 15 9.50001C15 9.91422 14.6642 10.25 14.25 10.25H3.75C3.33579 10.25 3 9.91422 3 9.50001Z"
                                          fill="#001E50"/>
                                </svg>
                            </a>
                        </MenuItem>
                    </div>
                </MenuItems>
            </transition>
        </Menu>
    </client-only>
</template>

<script setup lang="ts">
import {Menu, MenuButton, MenuItems, MenuItem} from '@headlessui/vue'
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.btn-dots {

    svg {

        circle {
            transition: fill .4s ease;
        }
    }

    &:hover {

        svg {

            circle {
                fill: $color-primary;
            }
        }
    }
}

.dropdown-menu {
    padding: 24px;

    &__link {
        margin: 0 0 $spacing-md;
        color: $color-text;
        font-size: $font-size-base;
        line-height: $line-height-base;
        letter-spacing: 0.32px;
        transition: color .4s ease;

        svg {

            path {
                transition: fill .4s ease;
            }
        }

        &:last-child {
            margin-bottom: 0;
        }

        &:hover {
            color: $color-primary;

            svg {

                path {
                    fill: $color-primary;
                }
            }
        }
    }
}
</style>