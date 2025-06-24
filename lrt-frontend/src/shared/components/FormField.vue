<template>
  <div class="col-md-6 mb-3">
    <label class="form-label">{{ label }}</label>
    <input
        :type="type"
        class="form-control"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
defineProps({
  label: String,
  modelValue: [String, Number],
  type: { type: String, default: 'text' }
})
</script>
