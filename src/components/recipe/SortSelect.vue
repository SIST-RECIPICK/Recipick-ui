<template>
  <div class="sort-select">
    <select
      :value="modelValue"
      aria-label="정렬 기준"
      @change="emit('update:modelValue', $event.target.value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
  </div>
</template>

<script setup>
defineProps({
  modelValue: { type: String, required: true },
})
const emit = defineEmits(['update:modelValue'])

const options = [
  { value: 'latest', label: '최신순' },
  { value: 'popular', label: '인기순' },
]
</script>

<style scoped>
.sort-select select {
  appearance: none;
  padding: var(--space-2) var(--space-6) var(--space-2) var(--space-3);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--surface-card)
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%238a8680' stroke-width='2'><polyline points='6 9 12 15 18 9'/></svg>")
    no-repeat right var(--space-2) center;
  color: var(--text-primary);
  font-size: var(--text-sm);
}
.sort-select select:focus {
  outline: none;
  border-color: var(--accent);
}
</style>
