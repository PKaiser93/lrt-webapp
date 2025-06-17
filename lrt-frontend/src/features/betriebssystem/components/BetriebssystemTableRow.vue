<script setup>
const { item, deletingId } = defineProps({
  item: { type: Object, required: true },
  deletingId: [String, Number]
});
const emit = defineEmits(['delete', 'edit']);
</script>

<template>
  <tr :class="{ 'table-danger': deletingId === item._id }">
    <td>{{ item.name }}</td>
    <td>
      <button class="btn btn-sm btn-outline-secondary me-1" @click="emit('edit', item)">Bearbeiten</button>
      <button
          class="btn btn-sm btn-outline-danger"
          :disabled="deletingId === item._id"
          @click="emit('delete', item._id)"
      >
        <span v-if="deletingId === item._id" class="spinner-border spinner-border-sm"></span>
        <span v-else>Löschen</span>
      </button>
    </td>
  </tr>
</template>
