<template>
  <div class="cat-carousel">
    <button class="cat-carousel__arrow" aria-label="이전 카테고리" @click="moveCategory(-1)">
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

    <button class="cat-carousel__arrow" aria-label="다음 카테고리" @click="moveCategory(1)">
      <IconChevronRight :size="20" />
    </button>
  </div>
</template>
<script setup>

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'

const props =  defineProps({
  categories: { type: Array, required: true }, // [{ key, label, icon }]
  modelValue: { type: String, required: true }, // 선택된 key
})
// direction => 방향이랑 한 칸 이동량
// 1 => 다음 칸 / -1 => 이전 칸
function moveCategory (direction)
{
  /* 지금 선택된 카테고리가 배열에서 몇번째 자리에 있는지 위치를 미리 구해놓음 
      => 현재 위치 */
   const idx = props.categories.findIndex(cat => cat.key === props.modelValue)
   // idx + direction이 -1처럼 음수가 나옴 
   // 자바스크립트에서는 음수 % 음수 => 음수라서 우리다 원하는 동작 X
   // 순환으로 만드는 중
   const newIdx = (idx + direction + props.categories.length) % props.categories.length
   // 무슨 이벤트를 보낼지 / 이벤트와 함께 보낼 데이터
   emit ('update:modelValue', props.categories[newIdx].key)
}

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
/* 선택 상태 - 버튼색상 블랙에서 주황으로 변경*/
.cat-carousel__item[aria-pressed='true'] .cat-carousel__icon {
  background: var(--accent);
  color: white;
}
.cat-carousel__item[aria-pressed='true'] .cat-carousel__label {
  color: var(--text-primary);
  font-weight: var(--weight-medium);
}
</style>
