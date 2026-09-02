<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useDragDrop } from '@/composables/useDragDrop.js'

defineProps({
  calendarCells: { type: Array, required: true },
  weekdays: { type: Array, required: true },
})

const emit = defineEmits(['slot-click', 'recipe-drop'])

// 표시용 축약 라벨 (매칭 키로 쓰는 원래 값(아침/점심/저녁)은 안 건드림)
const MEAL_LABEL = { '아침': '아', '점심': '점', '저녁': '저' }

function onSlotClick(cell, meal) {
  emit('slot-click', { cell, meal })
}

const { registerDropHandler } = useDragDrop()

onMounted(() => {
  registerDropHandler(({ dateStr, mealType, recipe }) => {
    emit('recipe-drop', { dateStr, mealType, recipe })
  })
})
onUnmounted(() => registerDropHandler(null))
</script>

<template>
  <div class="calendar-grid">
    <div class="calendar-grid__weekday-row">
      <div v-for="w in weekdays" :key="w" class="calendar-grid__weekday">{{ w }}</div>
    </div>

    <div class="calendar-grid__days">
      <div
        v-for="(cell, idx) in calendarCells"
        :key="idx"
        class="calendar-grid__day"
        :class="{ 'calendar-grid__day--empty': cell.empty }"
      >
        <template v-if="!cell.empty">
          <div class="calendar-grid__day-number">{{ cell.day }}</div>
          <div class="calendar-grid__meals">
            <div
              v-for="meal in cell.meals"
              :key="meal.type"
              class="meal-slot"
              data-meal-slot
              :data-date-str="cell.dateStr"
              :data-meal-type="meal.type"
              @click="onSlotClick(cell, meal)"
            >
              <span class="chip meal-slot__type">{{ MEAL_LABEL[meal.type] }}</span>

              <div v-if="meal.data" class="meal-slot__box">
                <img
                  v-if="meal.data.att_file_no_main"
                  :src="meal.data.att_file_no_main"
                  class="meal-slot__thumb"
                  alt=""
                />
                <span class="meal-slot__recipe">{{ meal.data.rcp_nm }}</span>
              </div>
              <span v-else class="meal-slot__empty">+</span>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-grid__weekday-row {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: var(--space-2);
}
.calendar-grid__weekday {
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-secondary);
  padding-block: var(--space-1);
}

.calendar-grid__days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: var(--space-1);
}

.calendar-grid__day {
  min-height: 96px;
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: var(--space-1);
}
.calendar-grid__day--empty { background: transparent; border-color: transparent; }

.calendar-grid__day-number {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--text-primary);
  margin-bottom: var(--space-1);
}

.calendar-grid__meals { display: flex; flex-direction: column; gap: 2px; }

.meal-slot {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 2px 0;
  min-height: 18px;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: 4px;
}
body.is-dragging-recipe .meal-slot:hover { background: var(--accent-subtle); outline: 1px dashed var(--accent); }

.meal-slot__box {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
  padding: 2px 4px;
  border-radius: 4px;
  background: var(--accent-subtle);
}
.meal-slot__box:hover { background: var(--surface-sunken); }

.meal-slot__thumb {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  object-fit: cover;
  flex-shrink: 0;
}

.meal-slot__type {
  padding: 0 4px;
  font-size: 10px;
  line-height: 1.4;
  flex-shrink: 0;
}

.meal-slot__recipe {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 11px;
}
.meal-slot__empty {
  color: var(--text-secondary);
  font-size: 11px;
  flex: 1;
  text-align: center;
}
</style>