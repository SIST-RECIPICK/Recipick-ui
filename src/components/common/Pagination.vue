<template>
  <nav class="pagination" aria-label="페이지 이동">
    <button
      class="pagination__arrow"
      :disabled="modelValue === 1"
      aria-label="이전 페이지"
      @click="go(modelValue - 1)"
    >
      <IconChevronLeft :size="16" />
    </button>

    <button
      v-for="page in pages"
      :key="page"
      class="pagination__page"
      :aria-current="page === modelValue ? 'page' : undefined"
      @click="go(page)"
    >
      {{ page }}
    </button>

    <button
      class="pagination__arrow"
      :disabled="modelValue === totalPages"
      aria-label="다음 페이지"
      @click="go(modelValue + 1)"
    >
      <IconChevronRight :size="16" />
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'

const props = defineProps({
  modelValue: { type: Number, required: true },  // 현재 페이지
  totalPages: { type: Number, required: true },
  window: { type: Number, default: 5 },          // 한 번에 보이는 페이지 수
})
const emit = defineEmits(['update:modelValue'])

const pages = computed(() => {
  const half = Math.floor(props.window / 2)
  let start = Math.max(1, props.modelValue - half)
  let end = Math.min(props.totalPages, start + props.window - 1)
  start = Math.max(1, end - props.window + 1)
  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
})

function go(page) {
  if (page < 1 || page > props.totalPages || page === props.modelValue) return
  emit('update:modelValue', page)
}
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  justify-content: center;
}
.pagination__arrow {
  display: flex;
  padding: var(--space-1);
  background: transparent;
  border: none;
  color: var(--text-muted);
}
.pagination__arrow:hover:not(:disabled) { color: var(--text-primary); }
.pagination__arrow:disabled { opacity: 0.4; cursor: default; }

.pagination__page {
  min-width: 32px;
  height: 32px;
  padding: 0 var(--space-2);
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.pagination__page:hover { background: var(--surface-sunken); color: var(--text-primary); }
.pagination__page[aria-current='page'] {
  background: var(--accent);
  color: var(--text-on-accent);
  font-weight: var(--weight-medium);
}
</style>
