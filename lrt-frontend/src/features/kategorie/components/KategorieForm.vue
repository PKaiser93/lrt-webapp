<template>
  <div class="modal fade show" tabindex="-1" style="display:block; background:rgba(30,34,53,0.18);" @click.self="close">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content border-0 shadow-lg rounded-4">
        <div class="modal-header bg-light border-0 rounded-top-4">
          <h5 class="modal-title fw-bold">
            <i class="bi bi-tags me-2"></i>
            {{ localItem._id ? 'Kategorie bearbeiten' : 'Neue Kategorie anlegen' }}
          </h5>
          <button type="button" class="btn-close" @click="close"></button>
        </div>
        <form @submit.prevent="submit" autocomplete="off">
          <div class="modal-body py-4 px-4">
            <div class="mb-3">
              <label class="form-label fw-semibold">Bezeichnung</label>
              <input v-model="localItem.bezeichnung" type="text" class="form-control" required maxlength="64" />
            </div>
            <div class="mb-3">
              <label class="form-label fw-semibold">Beschreibung <span class="text-secondary">(optional)</span></label>
              <input v-model="localItem.beschreibung" type="text" class="form-control" maxlength="100" />
            </div>
            <div class="mb-2 d-flex align-items-center gap-3">
              <div>
                <label class="form-label fw-semibold mb-0">Farbe</label>
                <input v-model="localItem.farbe" type="color" class="form-control form-control-color ms-2" style="width:44px; height:36px; padding:2px;" />
              </div>
              <span class="badge shadow-sm px-3 py-2"
                    :style="{ backgroundColor: localItem.farbe, color: colorForBadge(localItem.farbe) }"
              >
                <i class="bi bi-droplet-half"></i> {{ localItem.farbe }}
              </span>
            </div>
          </div>
          <div class="modal-footer bg-light border-0 rounded-bottom-4">
            <button type="button" class="btn btn-outline-secondary" @click="close">
              <i class="bi bi-x-circle"></i> Abbrechen
            </button>
            <button type="submit" class="btn btn-success">
              <i class="bi bi-check-circle"></i> {{ localItem._id ? 'Speichern' : 'Anlegen' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  editItem: { type: Object, default: null }
});

const localItem = ref({ bezeichnung: '', beschreibung: '', farbe: '#cccccc' });

watch(
    () => props.editItem,
    (val) => {
      localItem.value = val
          ? { ...val }
          : { bezeichnung: '', beschreibung: '', farbe: '#cccccc' };
    },
    { immediate: true }
);

const emit = defineEmits(['close', 'saved']);

function submit() {
  emit('saved', { ...props.editItem, ...localItem.value });
}
function close() {
  emit('close');
}

// Dynamisch kontrastierende Farbe für Badge
function colorForBadge(hex) {
  if (!hex) return "#333";
  let c = hex.replace("#", "");
  if (c.length === 3) c = c.split('').map(x=>x+x).join('');
  const rgb = parseInt(c, 16);
  const r = (rgb >> 16) & 0xff, g = (rgb >> 8) & 0xff, b = rgb & 0xff;
  const luminance = 0.2126*r + 0.7152*g + 0.0722*b;
  return luminance > 140 ? "#111" : "#fff";
}
</script>

<style scoped>
.modal-content {
  border-radius: 1.5rem;
}
.form-control-color {
  min-width: 44px !important;
}
</style>
