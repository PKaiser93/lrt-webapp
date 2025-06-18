<script setup>
const { comp, deletingId } = defineProps({
  comp: { type: Object, required: true },
  deletingId: [String, Number]
});
const emit = defineEmits(['delete']);

// Fallback-Farbe, falls keine gesetzt
function kategorieColor(kategorie) {
  return (kategorie && kategorie.farbe) ? kategorie.farbe : '#e0f2fe';
}
</script>

<template>
  <tr :class="{ 'table-danger': deletingId === comp._id }">
    <td>{{ comp.dnsName }}</td>
    <td>{{ comp.ipAdresse }}</td>
    <td>{{ comp.marke }}</td>
    <td>{{ comp.cpu }}</td>
    <td>{{ comp.ram }}</td>
    <td>{{ comp.raumnummer }}</td>
    <td>
      <span
          v-if="comp.kategorie"
          class="badge kategorie-badge"
          :style="{ backgroundColor: kategorieColor(comp.kategorie), color: '#fff', boxShadow: '0 2px 8px ' + kategorieColor(comp.kategorie) + '33' }"
      >
        {{ comp.kategorie.bezeichnung || comp.kategorie }}
      </span>
    </td>
    <td class="text-end align-middle">
      <div class="d-inline-flex gap-1">
        <router-link
            :to="`/computer/${comp._id}`"
            class="btn btn-sm btn-icon btn-outline-secondary rounded-circle"
            title="Details anzeigen"
        >
          <i class="bi bi-eye"></i>
        </router-link>
        <router-link
            :to="`/computer/${comp._id}/edit`"
            class="btn btn-sm btn-icon btn-outline-primary rounded-circle"
            title="Bearbeiten"
        >
          <i class="bi bi-pencil"></i>
        </router-link>
        <button
            class="btn btn-sm btn-icon btn-outline-danger rounded-circle"
            :disabled="deletingId === comp._id"
            @click="emit('delete', comp._id)"
            title="Löschen"
        >
          <span v-if="deletingId === comp._id" class="spinner-border spinner-border-sm"></span>
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
.kategorie-badge {
  border-radius: 0.75rem;
  font-size: 0.97em;
  padding: 0.55em 1.15em;
  font-weight: 600;
  /* Dynamische Farbe wird per style gesetzt */
}
</style>
