<script setup>
const { comp, deletingId } = defineProps({
  comp: {
    type: Object,
    required: true
  },
  deletingId: [String, Number]
});
const emit = defineEmits(['delete']);
</script>

<template>
  <tr :class="{ 'table-danger': deletingId === comp._id }">
    <td>{{ comp.dnsName }}</td>
    <td>{{ comp.ipAdresse }}</td>
    <td>{{ comp.marke }}</td>
    <td>{{ comp.cpu }}</td>
    <td>{{ comp.ram }}</td>
    <td>{{ comp.raumnummer }}</td>
    <td>{{ comp.kategorie?.bezeichnung }}</td>
    <td>
      <router-link :to="`/computer/${comp._id}`" class="btn btn-sm btn-outline-primary me-1">
        <i class="bi bi-eye"></i>
      </router-link>
      <router-link :to="`/computer/${comp._id}/edit`" class="btn btn-sm btn-outline-secondary me-1">
        <i class="bi bi-pencil"></i>
      </router-link>
      <button
          class="btn btn-sm btn-outline-danger"
          :disabled="deletingId === comp._id"
          @click="emit('delete', comp._id)"
      >
        <span v-if="deletingId === comp._id" class="spinner-border spinner-border-sm"></span>
        <i v-else class="bi bi-trash"></i>
      </button>
    </td>
  </tr>
</template>
