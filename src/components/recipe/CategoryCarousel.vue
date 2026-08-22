<template>
  <div class="cat-carousel">
    <button class="cat-carousel__arrow" aria-label="이전 카테고리">
      <IconChevronLeft :size="20" />
    </button>

    <ul class="cat-carousel__track">
      <li v-for="cat in categories" :key="cat.key">
        <button
          class="cat-carousel__item"
          :aria-pressed="modelValue === cat.key"
          @click="emit('update:modelValue', cat.key)"
        >
          <span class="cat-carousel__icon">
            <component :is="cat.icon" :size="20" />
          </span>
          <span class="cat-carousel__label">{{ cat.label }}</span>
        </button>
      </li>
    </ul>

    <button class="cat-carousel__arrow" aria-label="다음 카테고리">
      <IconChevronRight :size="20" />
    </button>
  </div>
</template>
<script setup>
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'

defineProps({
  categories: { type: Array, required: true }, // [{ key, label, icon }]
  modelValue: { type: String, required: true }, // 선택된 key
})
const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.cat-carousel {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  justify-content: center;
}
.cat-carousel__arrow {
  background: transparent;
  border: none;
  color: var(--text-muted);
  display: flex;
  padding: var(--space-2);
}
.cat-carousel__arrow:hover { color: var(--text-primary); }

.cat-carousel__track {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  scrollbar-width: none;
}
.cat-carousel__track::-webkit-scrollbar { display: none; }

.cat-carousel__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  background: transparent;
  border: none;
}
.cat-carousel__icon {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: var(--surface-sunken);
  color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.cat-carousel__label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  white-space: nowrap;
}
/* 선택 상태 */
.cat-carousel__item[aria-pressed='true'] .cat-carousel__icon {
  background: var(--surface-inverse);
  color: var(--text-on-inverse);
}
.cat-carousel__item[aria-pressed='true'] .cat-carousel__label {
  color: var(--text-primary);
  font-weight: var(--weight-medium);
}
</style>
