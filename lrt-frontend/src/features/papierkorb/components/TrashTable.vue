<template>
  <div>
    <div v-if="loading" class="py-5 text-center"><span class="spinner-border"></span></div>
    <div v-else>
      <table v-if="items.length" class="table table-hover align-middle mb-0 rounded-4 shadow-sm">
        <thead class="table-light">
        <tr>
          <th v-for="f in fields" :key="f.key">{{ f.label }}</th>
          <th>Aktionen</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in items" :key="item._id">
          <td v-for="f in fields" :key="f.key">
              <span v-if="f.badge" class="badge shadow-sm px-2 d-inline-flex align-items-center gap-1"
                    :style="{ backgroundColor: item[f.key], color: colorForBadge(item[f.key]) }">
                <i class="bi bi-droplet-half"></i>
                {{ item[f.key] }}
              </span>
            <span v-else>{{ item[f.key] }}</span>
          </td>
          <td>
            <div class="d-inline-flex gap-1">
              <button class="btn btn-sm btn-outline-success d-flex align-items-center" @click="$emit('restore', type, item._id)">
                <i class="bi bi-arrow-clockwise"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger d-flex align-items-center" @click="$emit('delete', type, item._id)">
                <i class="bi bi-trash3"></i>
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
      <div v-else class="alert alert-secondary text-center my-4">
        <i class="bi bi-emoji-frown me-2"></i>
        Keine gelöschten {{ type === 'computer' ? 'Computer' : type === 'kategorie' ? 'Kategorien' : 'Betriebssysteme' }} vorhanden.
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: Array,
  loading: Boolean,
  type: String,
  fields: Array
})
function colorForBadge(hex) {
  if (!hex) return "#333"
  let c = hex.replace("#", "")
  if (c.length === 3) c = c.split('').map(x=>x+x).join('')
  const rgb = parseInt(c, 16)
  const r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = rgb & 0xff
  const luminance = 0.2126*r + 0.7152*g + 0.0722*b
  return luminance > 140 ? "#111" : "#fff"
}
</script>
