<template>
  <div class="meal-plan container">
    <section class="meal-plan__hero">
      <p class="meal-plan__hero-text">
        이번 달 식단은?<br>
        <span class="meal-plan__count">{{ filledCount }}개</span>의 슬롯을 채웠어요.
      </p>
    </section>

    <section class="meal-plan__header">
      <button class="btn btn--ghost" aria-label="이전 달" @click="prevMonth">‹</button>
      <h2 class="meal-plan__month">{{ year }}년 {{ month }}월</h2>
      <button class="btn btn--ghost" aria-label="다음 달" @click="nextMonth">›</button>
    </section>

    <p v-if="loading" class="meal-plan__status">불러오는 중...</p>
    <p v-else-if="errorMsg" class="meal-plan__status meal-plan__status--error">{{ errorMsg }}</p>

    <section class="meal-plan__body">
      <aside class="meal-plan__search">
        <RecipeSearchPanel :user-id="userId" />
      </aside>

      <div class="meal-plan__calendar">
        <CalendarGrid
          :calendar-cells="calendarCells"
          :weekdays="WEEKDAYS"
          @slot-click="handleSlotClick"
          @recipe-drop="handleRecipeDrop"
        /><!-- CalendarGrid에 있던 emit 호출을 여기서 받아서 handleRecipeDrop 여기서 실행-->
      </div>
    </section>

    <div
      v-if="dragging"
      class="meal-plan__drag-ghost"
      :style="{ left: pointerPos.x + 'px', top: pointerPos.y + 'px' }"
    ><!-- 드래그일때 마우스 좌표따라서 css도 따라다니게 실시-->
      {{ dragging.rcp_nm }}
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useCalendarItems } from '@/composables/useCalendarItems.js'
import { useDragDrop } from '@/composables/useDragDrop.js'
import CalendarGrid from '@/components/calendar/CalendarGrid.vue'
import RecipeSearchPanel from '@/components/recipe/Recipesearchpanel.vue'

const { dragging, pointerPos } = useDragDrop()  // 함수 가져오기

// TODO: 실제 로그인 스토어 연결되면 여기서 userId 가져오기
const userId = computed(() => 2) // 임시 하드코딩

const {
  year, month, items, loading, errorMsg,
  calendarCells, loadCalendar, placeRecipe, prevMonth, nextMonth, WEEKDAYS,
} = useCalendarItems(userId)

const filledCount = computed(() => items.value.length)

function handleSlotClick({ cell, meal }) {
  if (meal.data) {
    // TODO: 조리법 화면으로 라우팅
    console.log('조리법 이동:', meal.data.rcp_seq)
  } else {
    console.log('빈 슬롯:', cell.dateStr, meal.type)
  }
}

function handleRecipeDrop({ dateStr, mealType, recipe }) { // 드롭이벤트 받아서 값을 넘김
  placeRecipe(dateStr, mealType, recipe)
}

onMounted(loadCalendar)
</script>

<style scoped>
.meal-plan { padding-block: var(--space-6); }

.meal-plan__hero { text-align: center; margin-bottom: var(--space-5); }
.meal-plan__hero-text {
  font-size: var(--text-xl);
  font-weight: var(--weight-medium);
  color: var(--text-primary);
}
.meal-plan__count { color: var(--accent); font-weight: var(--weight-bold); }

.meal-plan__header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}
.meal-plan__month {
  font-size: var(--text-lg);
  font-weight: var(--weight-medium);
  color: var(--text-primary);
  min-width: 8rem;
  text-align: center;
}

.meal-plan__status {
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  margin-bottom: var(--space-4);
}
.meal-plan__status--error { color: var(--danger); }

.meal-plan__body {
  display: flex;
  gap: var(--space-5);
  align-items: flex-start;
}

.meal-plan__search {
  width: 320px;
  flex-shrink: 0;
}

.meal-plan__calendar {
  flex: 1;
  min-width: 0;
}

@media (max-width: 900px) {
  .meal-plan__body { flex-direction: column; }
  .meal-plan__search { width: 100%; }
}

/* 드래그 중 마우스를 따라다니는 카드 (실제 드롭 판정은 pointerup 시점 좌표로 함) */
.meal-plan__drag-ghost {
  position: fixed;
  z-index: 100;
  pointer-events: none;
  transform: translate(-50%, -140%);
  background: var(--surface-inverse);
  color: var(--text-on-inverse);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  white-space: nowrap;
}
</style>