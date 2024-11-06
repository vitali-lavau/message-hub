<template>
    <div class="message-actions">
        <ButtonEdit @click="onEdit" />
        <ButtonDelete @click="onDelete" />
    </div>
</template>

<script setup lang="ts">
import ButtonEdit from "~/components/ui/ButtonEdit.vue";
import ButtonDelete from "~/components/ui/ButtonDelete.vue";

const emit = defineEmits(['edit', 'delete']);

const onEdit = () => {
    emit('edit');
};

const onDelete = () => {
    emit('delete');
};
</script>

<style scoped lang="scss">
@use "assets/scss/variables" as *;

.message-actions {
    display: flex;
    gap: 8px;
}

.action-button {
    cursor: pointer;
    background: none;
    border: none;
    font-size: 16px;
}

.edit-button {
    color: #4caf50;
}

.delete-button {
    color: #f44336;
}
</style>
