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
import { German } from 'flatpickr/dist/l10n/de.js'
import 'flatpickr/dist/flatpickr.min.css'
import { computed } from 'vue'

const props = defineProps({
  label: String,
  modelValue: {
    type: [String, Number, Date, Array],
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])

const model = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const config = {
  dateFormat: 'Y-m-d',
  allowInput: true,
  locale: German // statt 'de'
}
</script>
