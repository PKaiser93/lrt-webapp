<template>
  <div
      class="modal fade show"
      tabindex="-1"
      style="display:block; background:rgba(30,34,53,0.18)"
      @click.self="close"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg rounded-4">
        <div class="modal-header bg-light border-0">
          <h5 class="modal-title fw-bold d-flex align-items-center gap-2">
            <i class="bi bi-tags"></i>
            {{ localItem._id ? 'Kategorie bearbeiten' : 'Neue Kategorie anlegen' }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <form @submit.prevent="submit" autocomplete="off">
          <div class="modal-body px-4 py-3">
            <div class="mb-3">
              <label class="form-label fw-semibold">Bezeichnung</label>
              <input
                  v-model="localItem.bezeichnung"
                  type="text"
                  class="form-control"
                  required
                  maxlength="64"
              />
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">
                Beschreibung <span class="text-secondary">(optional)</span>
              </label>
              <input
                  v-model="localItem.beschreibung"
                  type="text"
                  class="form-control"
                  maxlength="100"
              />
            </div>
            <div class="d-flex align-items-center gap-3">
              <div class="d-flex align-items-center gap-2">
                <label class="form-label fw-semibold mb-0">Farbe</label>
                <input
                    v-model="localItem.farbe"
                    type="color"
                    class="form-control form-control-color p-0"
                    style="width:40px; height:40px;"
                />
              </div>
              <span
                  class="badge d-inline-flex align-items-center gap-1 shadow-sm px-3 py-2"
                  :style="{
                  backgroundColor: localItem.farbe,
                  color: colorForBadge(localItem.farbe),
                  border: '1px solid var(--clr-border)'
                }"
              >
                <i class="bi bi-droplet-half"></i>
                {{ localItem.farbe }}
              </span>
            </div>
          </div>
          <div class="modal-footer bg-light border-0">
            <button type="button" class="btn btn-outline-secondary" @click="close">
              <i class="bi bi-x-circle"></i> Abbrechen
            </button>
            <button type="submit" class="btn btn-gradient">
              <i class="bi bi-check-circle"></i>
              {{ localItem._id ? 'Speichern' : 'Anlegen' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  editItem: { type: Object, default: null }
})
const emit = defineEmits(['close', 'saved'])

const localItem = ref({
  bezeichnung: '',
  beschreibung: '',
  farbe: '#cccccc'
})

// Wenn editItem reinkommt, kopieren wir es lokal (oder setzen Default)
watch(
    () => props.editItem,
    (v) => {
      localItem.value = v
          ? { ...v }
          : { bezeichnung: '', beschreibung: '', farbe: '#cccccc' }
    },
    { immediate: true }
)

function submit() {
  emit('saved', { ...props.editItem, ...localItem.value })
}

function close() {
  emit('close')
}

function colorForBadge(hex) {
  if (!hex) return '#333'
  let c = hex.replace('#','')
  if (c.length === 3) c = c.split('').map(x=>x+x).join('')
  const rgb = parseInt(c,16)
  const r = (rgb>>16)&0xff, g = (rgb>>8)&0xff, b = rgb&0xff
  const lum = 0.2126*r + 0.7152*g + 0.0722*b
  return lum>140 ? '#111' : '#fff'
}
</script>

<style scoped>
.modal-content {
  border-radius: var(--radius-lg);
}
.form-control-color {
  border: 1px solid var(--clr-border);
  border-radius: var(--radius-sm);
}
</style>
