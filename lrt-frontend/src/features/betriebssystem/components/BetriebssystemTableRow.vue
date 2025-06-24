<script setup>
import { defineProps, defineEmits } from 'vue';

const { item, deletingId } = defineProps({
  item: { type: Object, required: true },
  deletingId: [String, Number]
});
const emit = defineEmits(['delete', 'edit']);

// Icon-Auswahl dynamisch je nach Name
function getOsIcon(osName) {
  const name = (osName || '').toLowerCase();
  if (name.includes('windows'))   return 'bi-windows text-primary';
  if (name.includes('ubuntu'))    return 'bi-ubuntu text-warning';
  if (name.includes('linux'))     return 'bi-linux text-success';
  if (/mac|osx|ipad|ios/.test(name)) return 'bi-apple text-dark';
  if (name.includes('android'))   return 'bi-android text-success';
  if (name.includes('drucker'))   return 'bi-printer text-secondary';
  if (name.includes('3d'))        return 'bi-badge-3d text-secondary';
  if (name.includes('andere'))    return 'bi-three-dots text-secondary';
  return 'bi-cpu text-secondary';
}
</script>

<template>
  <tr :class="{ 'table-danger': deletingId === item._id }">
    <td class="align-middle">
      <i :class="`${getOsIcon(item.name)} me-2 fs-md`"></i>
      {{ item.name }}
    </td>
    <td class="text-end align-middle">
      <div class="d-inline-flex gap-2">
        <button
            class="btn btn-outline btn-sm btn-icon"
            @click="emit('edit', item)"
            title="Bearbeiten"
        >
          <i class="bi bi-pencil"></i>
        </button>
        <button
            class="btn btn-outline-danger btn-sm btn-icon"
            :disabled="deletingId === item._id"
            @click="emit('delete', item._id)"
            title="Löschen"
        >
          <template v-if="deletingId === item._id">
            <span class="spinner-border spinner-border-sm"></span>
          </template>
          <template v-else>
            <i class="bi bi-trash"></i>
          </template>
        </button>
      </div>
    </td>
  </tr>
</template>

<style scoped>
.btn-icon {
  width: 2.25rem;           /* var(--space-xl) wäre auch möglich */
  height: 2.25rem;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  transition: background 0.2s, transform 0.1s;
}
.btn-icon:hover:not(:disabled) {
  background: var(--clr-bg-light);
  transform: translateY(-1px);
}
.fs-md {
  font-size: var(--fs-lg);
}
</style>
