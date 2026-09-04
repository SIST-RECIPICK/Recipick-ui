<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useDragDrop } from '@/composables/useDragDrop.js'

defineProps({
  calendarCells: { type: Array, required: true },
  weekdays: { type: Array, required: true },
})

const emit = defineEmits(['slot-click', 'recipe-drop','recipe-delete'])

// 표시용 축약 라벨 (매칭 키로 쓰는 원래 값(아침/점심/저녁)은 안 건드림)
const MEAL_LABEL = { '아침': '아', '점심': '점', '저녁': '저' }

function onSlotClick(cell, meal) { // 어느 날짜 칸인지 , 어느 끼니인지
  emit('slot-click', { cell, meal }) // 
}
function onDeleteClick(cell,meal){
  emit('recipe-delete',{dateStr : cell.dateStr,mealType:meal.type}) 
  //recipe-delete를 실시해 부모(MealPlan)가 실행되게 함 , 어느 날짜의 어느 끼니인지 정보
}
const { registerDropHandler } = useDragDrop() // 함수 가져오기

onMounted(() => { // 드래그 드롭 이벤트 등록
  registerDropHandler(({ dateStr, mealType, recipe }) => { //비어있는 onDrop에 3개의 데이터 전장
    emit('recipe-drop', { dateStr, mealType, recipe }) //recipe-drop시 정보를 emit로 부모(MealPlanView.vue)로 전달
  })
})
onUnmounted(() => registerDropHandler(null)) // 컴포넌트가 사라지면 이벤트 해제
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
            ><!--useDragDrop.js에 handlePointerUp에서 쓰이는 값들 이벤트 리스너 대신 클릭 (표시용)-->
              <span class="chip meal-slot__type">{{ MEAL_LABEL[meal.type] }}</span>

              <div v-if="meal.data" class="meal-slot__box">
                <img
                  v-if="meal.data.att_file_no_main"
                  :src="meal.data.att_file_no_main"
                  class="meal-slot__thumb"
                  alt=""
                />
                <span class="meal-slot__recipe">
                  {{ meal.data.rcp_nm.length > 7 ? meal.data.rcp_nm.slice(0, 7) + '...' : meal.data.rcp_nm }}                   
                </span>
                <!--레시피명이 7글자 이상일 시 말 줄임표 처리 -->
                <!-- 삭제 버튼 클릭시 버블링(위에 부모까지 클릭 이벤트 실행) 방지-->
                <button
                  class="meal-slot__delete"
                  @click.stop="onDeleteClick(cell,meal)"
                >
                X
                </button>
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
.meal-slot__delete {
  margin-left: auto;
  flex-shrink: 0;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 10px;
  cursor: pointer;
  padding: 0 2px;
  line-height: 1;
}
.meal-slot__delete:hover {
  color: var(--danger);
}
</style>