<script setup>
defineProps({
  label: String,
  items: Array,
  modelValue: [String, Number],
  labelKey: { type: String, default: 'name' }
})
</script>

<template>
  <div class="col-md-6 mb-3">
    <label class="form-label">{{ label }}</label>
    <select
        class="form-select"
        :value="modelValue"
        @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="">Bitte wählen</option>
      <option
          v-for="item in items"
          :key="item._id"
          :value="item._id"
      >
        {{ item[labelKey] }}
      </option>
    </select>
  </div>
</template>
