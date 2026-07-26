<template>
    <div class="demo-skeleton" aria-label="Loading Message Hub" aria-busy="true">
        <aside class="demo-skeleton__sidebar">
            <div class="demo-skeleton__profile">
                <span class="demo-skeleton__avatar" />
                <span class="demo-skeleton__line demo-skeleton__line--profile" />
            </div>
            <span class="demo-skeleton__line demo-skeleton__line--search" />

            <div v-for="section in 2" :key="section" class="demo-skeleton__section">
                <span class="demo-skeleton__line demo-skeleton__line--title" />
                <div v-for="item in 4" :key="item" class="demo-skeleton__conversation">
                    <span class="demo-skeleton__avatar demo-skeleton__avatar--small" />
                    <span class="demo-skeleton__line" />
                </div>
            </div>
        </aside>

        <main class="demo-skeleton__panel">
            <header class="demo-skeleton__header">
                <span class="demo-skeleton__line demo-skeleton__line--heading" />
            </header>
            <div class="demo-skeleton__messages">
                <span class="demo-skeleton__line demo-skeleton__line--date" />
                <div
                    v-for="message in 6"
                    :key="message"
                    class="demo-skeleton__message"
                    :class="{ 'demo-skeleton__message--mine': message % 2 === 0 }"
                >
                    <span class="demo-skeleton__avatar demo-skeleton__avatar--small" />
                    <span class="demo-skeleton__bubble" />
                </div>
            </div>
            <span class="demo-skeleton__composer" />
        </main>
    </div>
</template>

<style scoped lang="scss">
@use 'assets/scss/variables' as *;

.demo-skeleton {
    width: 100%;
    height: 100%;
    display: flex;
    gap: $spacing-xl;
    overflow: hidden;

    &__sidebar,
    &__panel {
        background: $color-white;
        box-shadow: $box-shadow;
        border-radius: $border-radius;
    }

    &__sidebar {
        width: 340px;
        flex-shrink: 0;
        padding: $spacing-xl;
    }

    &__panel {
        min-width: 0;
        flex: 1;
        display: flex;
        flex-direction: column;
    }

    &__profile,
    &__conversation,
    &__message {
        display: flex;
        align-items: center;
        gap: $spacing-sm;
    }

    &__profile {
        margin-bottom: $spacing-lg;
    }

    &__section {
        margin-top: $spacing-xl;
    }

    &__conversation {
        margin-top: $spacing-m;
    }

    &__avatar,
    &__line,
    &__bubble,
    &__composer {
        display: block;
        background: linear-gradient(
            90deg,
            $color-background-gray 25%,
            $color-info-light 50%,
            $color-background-gray 75%
        );
        background-size: 200% 100%;
        animation: skeleton-shimmer 1.35s infinite linear;
    }

    &__avatar {
        width: 48px;
        height: 48px;
        flex-shrink: 0;
        border-radius: 50%;

        &--small {
            width: 32px;
            height: 32px;
        }
    }

    &__line {
        width: 70%;
        height: 14px;
        border-radius: 8px;

        &--profile {
            width: 52%;
            height: 18px;
        }

        &--search {
            width: 100%;
            height: 42px;
        }

        &--title {
            width: 38%;
        }

        &--heading {
            width: 28%;
            height: 20px;
        }

        &--date {
            width: 90px;
            margin: 0 auto;
        }
    }

    &__header {
        padding: $spacing-xl $spacing-xxl;
        border-bottom: 1px solid $color-border;
    }

    &__messages {
        flex: 1;
        padding: $spacing-xl $spacing-xxl;
        overflow: hidden;
    }

    &__message {
        max-width: 48%;
        margin-top: $spacing-lg;

        &--mine {
            margin-left: auto;
            flex-direction: row-reverse;
        }
    }

    &__bubble {
        width: 240px;
        height: 64px;
        border-radius: 10px;
    }

    &__composer {
        height: 52px;
        margin: $spacing-xl $spacing-xxl;
        border-radius: 8px;
    }
}

@keyframes skeleton-shimmer {
    to {
        background-position: -200% 0;
    }
}

@media (max-width: 1023px) {
    .demo-skeleton {
        gap: 0;

        &__sidebar {
            display: none;
        }
    }
}

@media (max-width: 767px) {
    .demo-skeleton {
        &__panel {
            border-radius: 0;
            box-shadow: none;
        }

        &__header,
        &__messages {
            padding-inline: $spacing-md;
        }

        &__composer {
            margin: $spacing-md;
        }

        &__message {
            max-width: 82%;
        }
    }
}
</style>
