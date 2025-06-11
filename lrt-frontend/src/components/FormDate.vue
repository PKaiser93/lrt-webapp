<template>
  <div class="col-md-6 mb-3">
    <label class="form-label">{{ label }}</label>
    <flat-pickr
        :config="config"
        v-model="model"
        class="form-control"
    />
  </div>
</template>

<script setup>
import FlatPickr from 'vue-flatpickr-component'
import { computed } from 'vue'

const props = defineProps({
  label: String,
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const config = {
  dateFormat: 'Y-m-d',
  allowInput: true,
  locale: 'de' // Optional: deutsches Format
}
</script>

<script>
export default {
  components: {
    FlatPickr
  }
}
</script>
