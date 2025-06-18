<script setup>
const { item, deletingId } = defineProps({
  item: { type: Object, required: true },
  deletingId: [String, Number]
});
const emit = defineEmits(['delete', 'edit']);

// Icon-Auswahl dynamisch je nach Name
function getOsIcon(osName) {
  const name = osName?.toLowerCase() || '';
  if (name.includes('windows')) return 'bi-windows text-primary';
  if (name.includes('ubuntu')) return 'bi-ubuntu text-warning';
  if (name.includes('linux')) return 'bi-linux text-success';
  if (name.includes('mac') || name.includes('osx') || name.includes('ipad') || name.includes('ios')) return 'bi-apple text-dark';
  if (name.includes('android')) return 'bi-android text-success';
  if (name.includes('drucker')) return 'bi-printer text-success';
  if (name.includes('3d')) return 'bi-badge-3d text-success';
  if (name.includes('andere')) return 'bi-three-dots text-success';
  // Fallback
  return 'bi-cpu text-secondary';
}
</script>

<template>
  <tr :class="{ 'table-danger': deletingId === item._id }">
    <td class="align-middle">
      <i :class="getOsIcon(item.name) + ' me-2 fs-5'"></i>
      {{ item.name }}
    </td>
    <td class="text-end align-middle">
      <div class="d-inline-flex gap-1">
        <button
            class="btn btn-sm btn-icon btn-outline-primary rounded-circle"
            @click="emit('edit', item)"
            title="Bearbeiten"
        >
          <i class="bi bi-pencil"></i>
        </button>
        <button
            class="btn btn-sm btn-icon btn-outline-danger rounded-circle"
            :disabled="deletingId === item._id"
            @click="emit('delete', item._id)"
            title="Löschen"
        >
          <span v-if="deletingId === item._id" class="spinner-border spinner-border-sm"></span>
          <i v-else class="bi bi-trash"></i>
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
