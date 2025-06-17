<script setup>
import {ref, watch} from "vue";

const props = defineProps({
  item: {
    type: Object,
    default: null
  }
});
const emit = defineEmits(['close', 'saved']);
const name = ref(props.item?.name ?? '');

watch(() => props.item, (val) => {
  name.value = val?.name ?? '';
});

function submit() {
  emit('saved', { ...props.item, name: name.value });
}
</script>

<template>
  <form @submit.prevent="submit">
    <div class="mb-3">
      <label>Name</label>
      <input v-model="name" type="text" class="form-control" required />
    </div>
    <div class="d-flex gap-2">
      <button type="submit" class="btn btn-success">Speichern</button>
      <button type="button" class="btn btn-secondary" @click="$emit('close')">Abbrechen</button>
    </div>
  </form>
</template>
