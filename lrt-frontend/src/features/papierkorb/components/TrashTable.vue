<template>
  <div class="table-responsive">
    <table class="table mb-0">
      <thead>
      <tr>
        <th v-for="field in fields" :key="field.key">{{ field.label }}</th>
        <th class="text-end">Aktionen</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in items" :key="item._id">
        <!-- Felder dynamisch rendern -->
        <td v-for="field in fields" :key="field.key">
            <span v-if="field.badge"
                  class="badge d-inline-flex align-items-center gap-1"
                  :style="badgeStyle(item[field.key])">
              <i class="bi bi-droplet-half"></i>
              {{ item[field.key] }}
            </span>
          <span v-else>{{ item[field.key] }}</span>
        </td>

        <!-- Aktionen -->
        <td class="text-end">
          <button
              class="btn btn-sm btn-outline-success me-1"
              @click="$emit('restore', type, item._id)"
              :disabled="loading"
              title="Wiederherstellen"
          >
            <i class="bi bi-arrow-counterclockwise"></i>
          </button>
          <button
              class="btn btn-sm btn-outline-danger"
              @click="$emit('delete', type, item._id)"
              :disabled="loading"
              title="Endgültig löschen"
          >
            <i class="bi bi-x-circle"></i>
          </button>
        </td>
      </tr>
      </tbody>
    </table>

    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border" role="status"></div>
    </div>
  </div>
</template>

<script setup>
import { toRefs } from 'vue'

const props = defineProps({
  items:      { type: Array, required: true },
  loading:    { type: Boolean, default: false },
  type:       { type: String,  required: true },
  fields:     { type: Array,   required: true },
})

/**
 * Erzeugt das inline-Style für Badge-Feld:
 * - Hintergrund ist die hex-Farbe
 * - Kontrastfarbe per Luminanz
 */
function badgeStyle(hex) {
  const bg = hex || '#ccc'
  let c = bg.replace('#','')
  if (c.length === 3) c = c.split('').map(x=>x+x).join('')
  const rgb = parseInt(c,16)
  const r = (rgb>>16)&0xff, g = (rgb>>8)&0xff, b=rgb&0xff
  const lum = 0.2126*r + 0.7152*g + 0.0722*b
  const fg = lum>140 ? '#111' : '#fff'
  return {
    backgroundColor: bg,
    color: fg,
    border: '1px solid var(--clr-border)'
  }
}
</script>

<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}
.table thead th {
  padding: var(--space-sm) var(--space-md);
  font-weight: 600;
  border-bottom: 2px solid var(--clr-border);
  background: var(--clr-card-bg);
  text-align: left;
}
.table tbody td {
  padding: var(--space-sm) var(--space-md);
  border-bottom: 1px solid var(--clr-border);
  vertical-align: middle;
}
.table tbody tr:last-child td {
  border-bottom: none;
}
.table tbody tr:hover {
  background: rgba(60,123,253,0.05);
}

/* Buttons kompakt */
.btn-outline-success,
.btn-outline-danger {
  padding: 0.35rem 0.65rem;
  font-size: var(--fs-sm);
  border-radius: var(--radius-sm);
}

/* Spinner zentriert */
.spinner-border {
  width: 2rem;
  height: 2rem;
  border-width: 0.25rem;
}
</style>
