<script setup>
const { comp, deletingId } = defineProps({
  comp: { type: Object, required: true },
  deletingId: [String, Number]
});
const emit = defineEmits(['delete']);

// Fallback‑Farbe, falls keine gesetzt
function kategorieColor(kategorie) {
  return (kategorie && kategorie.farbe) ? kategorie.farbe : 'var(--clr-border)';
}
</script>

<template>
  <tr :class="{ 'table-danger': deletingId === comp._id }">
    <td class="text-center align-middle">{{ comp.dnsName }}</td>
    <td class="text-center align-middle">{{ comp.ipAdresse }}</td>
    <td class="text-center align-middle">{{ comp.marke }}</td>
    <td class="text-center align-middle">{{ comp.cpu }}</td>
    <td class="text-center align-middle">{{ comp.ram }} GB</td>
    <td class="text-center align-middle">{{ comp.raumnummer }}</td>
    <td class="text-center align-middle">
      <span
          v-if="comp.kategorie"
          class="badge"
          :style="{
          backgroundColor: kategorieColor(comp.kategorie),
          color: '#fff'
        }"
      >
        {{ comp.kategorie.bezeichnung || comp.kategorie }}
      </span>
    </td>
    <td class="text-center align-middle">
      <div class="d-inline-flex gap-sm">
        <!-- Details -->
        <router-link
            :to="`/computer/${comp._id}`"
            class="btn btn-outline btn-sm"
            title="Details"
        >
          <i class="bi bi-eye"></i>
        </router-link>
        &nbsp;
        <!-- Bearbeiten -->
        <router-link
            :to="`/computer/${comp._id}/edit`"
            class="btn btn-outline btn-sm"
            title="Bearbeiten"
        >
          <i class="bi bi-pencil"></i>
        </router-link>
        &nbsp;
        <!-- Löschen -->
        <button
            class="btn btn-outline btn-sm"
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
/* keine weiteren styles nötig, alles kommt aus main.css */
</style>
