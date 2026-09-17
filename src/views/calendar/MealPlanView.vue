<script setup>
import { ref,computed, onMounted } from 'vue'
import { useCalendarItems } from '@/composables/useCalendarItems.js'
import { useDragDrop } from '@/composables/useDragDrop.js'
import { useCalendarInfo } from '@/composables/useCalendarInfo.js'
import { useRouter } from 'vue-router' // 라우터 가져오기
import CalendarGrid from '@/components/calendar/CalendarGrid.vue'
import RecipeSearchPanel from '@/components/calendar/RecipeSearchPanel.vue'
import FillRateGauge  from '@/components/calendar/FillRateGauge.vue'
import MacroGauge from '@/components/calendar/MacroGauge.vue'
import { useRecipePreviewStore } from '@/stores/recipePreview'
import { useAuthStore } from '@/stores/auth'
import { useCalendarAi } from '@/composables/useCalendarAi.js'

const authStore = useAuthStore()
const { dragging, pointerPos } = useDragDrop()  // 함수 가져오기  

const router = useRouter() // 라우터 가져오기
// TODO: 실제 로그인 스토어 연결되면 여기서 userId 가져오기
const userId = computed(() => authStore.user?.userId)
const {
  year, month, loading, errorMsg,
  calendarCells, loadCalendar, placeRecipe, prevMonth, nextMonth, WEEKDAYS,deleteItem,
} = useCalendarItems(userId)

// useCalendarInfo에 year,month를 그대로 가져옴
const {
  info, loading: summaryLoading, errorMsg: summaryError, loadSummary,
} = useCalendarInfo(userId, year, month)

const previewStore = useRecipePreviewStore()

const {
  result: aiResult,
  loading: aiLoading,
  errorMsg: aiErrorMsg,
  fillEmptySlots,
  rollback: rollbackAi,
  confirm: confirmAi,
} = useCalendarAi()

const aiCommand = ref('')

async function handleAiFill() {
  await fillEmptySlots(String(year.value), String(month.value).padStart(2, '0'), aiCommand.value)
  if (aiResult.value) {
    aiCommand.value = ''
    await loadCalendar()
    await loadSummary()
  }
}
async function handleConfirm() {
  await confirmAi()
}
async function handleRollback() {
  await rollbackAi()
  await loadCalendar()
  await loadSummary()
}
function handleSlotClick({ cell, meal }) {
  if (meal.data) {
    // TODO: 조리법 화면으로 라우팅
    goToRecipeDetail(meal.data.rcp_seq)
  } else {
    console.log('빈 슬롯:', cell.dateStr, meal.type)
  }
}

async function handleRecipeDrop({ dateStr, mealType, recipe }) { // 드롭이벤트 받아서 값을 넘김
  await placeRecipe(dateStr, mealType, recipe) // 기다린 후 값 배치
  loadSummary() // 드롭후 요약정보 갱신
}
async function handleSlotDelete({dateStr , mealType }) {
  //console.log('삭제 요청:', dateStr, mealType)
  await deleteItem(dateStr,mealType)
  loadSummary() // 드롭후 요약정보 갱신
}
// 월 따라 정보 출력
function goPrevMonth(){
  prevMonth()
  loadSummary()
}
function goNextMonth(){
  nextMonth()
  loadSummary()
}
function goToRecipeDetail(rcpSeq) {
  previewStore.closePreview()
  router.push({ name: 'recipe-detail', params: { id: rcpSeq } }) // 라우터 경로 문자열
}
onMounted(() => {
  loadCalendar()
  loadSummary() // 페이지 로딩시 요약정보 같이 가져옴
})
</script>
<template>
  <div class="meal-plan container">       
    <section class="meal-plan__header">
        <button class="btn btn--ghost" aria-label="이전 달" @click="goPrevMonth">‹</button>
        <h2 class="meal-plan__month">{{ year }}년 {{ month }}월</h2>
        <button class="btn btn--ghost" aria-label="다음 달" @click="goNextMonth">›</button>
      </section>
      <section v-if="info" class="meal-plan__summary">
    <div class="meal-plan__summary-card">
      <span class="meal-plan__summary-label">일평균</span>
      <span class="meal-plan__summary-value">{{ info.avg_cal }} <small>kcal</small></span>
      <span class="meal-plan__summary-sub">총 {{ info.total_cal.toLocaleString('ko-KR', { maximumFractionDigits: 0 }) }}kcal</span>
    </div>
    <div class="meal-plan__summary-card">
      <span class="meal-plan__summary-label">이번달 몇 끼니?</span>
      <FillRateGauge
        v-if="info"
        :filled-count="info.filled_count"
        :total-slots="info.total_slots"
      />
    </div>
    <div class="meal-plan__summary-card meal-plan__summary-card--macros">
       <span class="meal-plan__summary-label">탄·단·지 (일평균)</span>
       <div class="meal-plan__macro-row">
        <MacroGauge
          v-if="info"
          :carbs="info.total_car"
          :protein="info.total_pro"
          :fat="info.total_fat"
        /> 
        <div class="meal-plan__macro-legend">
          <span class="meal-plan__macro-item">
            <span class="meal-plan__macro-dot" style="background:#f97316"></span>
            탄수화물 {{ info.total_car }}g
          </span>
          <span class="meal-plan__macro-item">
            <span class="meal-plan__macro-dot" style="background:#22c55e"></span>
            단백질 {{ info.total_pro }}g
          </span>
          <span class="meal-plan__macro-item">
            <span class="meal-plan__macro-dot" style="background:#3b82f6"></span>
            지방 {{ info.total_fat }}g
          </span>
        </div>
        </div>       
    </div>
    <div class="meal-plan__summary-card meal-plan__summary-card--top1">
      <span class="meal-plan__summary-label">이번 달 TOP1</span>
      <span class="meal-plan__summary-value meal-plan__summary-value--sm">
        {{ info.top1_nm ?? '기록 없음' }}
      </span>
      <span v-if="info.top1_nm" class="meal-plan__summary-sub">
        {{ info.top1_count }}번 만들었어요
      </span>
      <button
        v-if="info.top1_rcp_seq"
        class="btn btn--ghost meal-plan__summary-btn"
        @click="goToRecipeDetail(info.top1_rcp_seq)"
      >
        레시피 보기
      </button>
    </div>
    <div class="meal-plan__summary-card meal-plan__summary-card--ai">
      <span class="meal-plan__summary-label">AI로 식단표 짜기</span>
      <div v-if="!aiResult" class="ai-fill__input-area">
        <input
          v-model="aiCommand"
          type="text"
          placeholder="예: 저칼로리 위주로 3개 채워줘"
          class="ai-fill__input"
        />
        <button
          class="ai-fill__submit-btn"
          :disabled="aiLoading || !aiCommand"
          @click="handleAiFill"
        >
          {{ aiLoading ? '채우는 중...' : '채우기' }}
        </button>
      </div>
      <div v-else class="ai-fill__result">
        <p class="ai-fill__result-msg">AI가 완성했습니다!</p>
        <p class="ai-fill__result-count">{{ aiResult.filledCount }}개 슬롯을 채웠어요</p>
        <div class="ai-fill__actions">
          <button class="ai-fill__confirm-btn" @click="handleConfirm">
            확정하기
          </button>
          <button class="ai-fill__rollback-btn" @click="handleRollback">
            롤백하기
          </button>
        </div>
        </div>
      <p v-if="aiErrorMsg" class="meal-plan__status meal-plan__status--error">{{ aiErrorMsg }}</p>
    </div>
  </section>
    <p v-else-if="summaryLoading" class="meal-plan__status">요약 정보 불러오는 중...</p>
    <p v-else-if="summaryError" class="meal-plan__status meal-plan__status--error">{{ summaryError }}</p>
    <p v-if="loading" class="meal-plan__status">불러오는 중...</p>
    <p v-else-if="errorMsg" class="meal-plan__status meal-plan__status--error">{{ errorMsg }}</p>

    <section class="meal-plan__body">
      <aside class="meal-plan__search">
        <RecipeSearchPanel :user-id="userId" />
      </aside>
      <div v-if="previewStore.preview" class="recipe-preview-popover">
        <button class="recipe-preview-popover__close" @click="previewStore.closePreview">x</button>
        
        <p v-if="previewStore.loading" class="recipe-preview-popover__status">불러오는 중...</p>
        <p v-else-if="previewStore.errorMsg" class="recipe-preview-popover__status recipe-preview-popover__status--error">
          {{ previewStore.errorMsg }}
        </p>

        <template v-else>
          <h3 class="recipe-preview-popover__title">{{ previewStore.preview.rcp_nm }}</h3>

          <div class="recipe-preview-popover__stats">
            <div class="recipe-preview-popover__stat">
              <span class="recipe-preview-popover__stat-label">칼로리</span>
              <span class="recipe-preview-popover__stat-value">{{ previewStore.preview.info_eng }}</span>
            </div>
            <div class="recipe-preview-popover__stat">
              <span class="recipe-preview-popover__stat-label">단백질</span>
              <span class="recipe-preview-popover__stat-value">{{ previewStore.preview.info_pro }}g</span>
            </div>
          </div>

          <div class="recipe-preview-popover__section">
            <span class="recipe-preview-popover__section-label">주재료</span>
            <div class="recipe-preview-popover__chips">
              <span
                v-for="(ing, idx) in previewStore.preview.ingredients"
                :key="idx"
                class="recipe-preview-popover__chip"
              >{{ ing }}</span>
            </div>
          </div>

          <p v-if="previewStore.preview.hash_tag" class="recipe-preview-popover__hashtag">
            {{ previewStore.preview.hash_tag }}
          </p>

          <button
            class="btn btn--primary recipe-preview-popover__detail-btn"
            @click="goToRecipeDetail(previewStore.preview.rcp_seq)"
          >
            조리법 전체 보기 →
          </button>
        </template>
      </div>
      <div class="meal-plan__calendar">
        <CalendarGrid
          :calendar-cells="calendarCells"
          :weekdays="WEEKDAYS"
          @slot-click="handleSlotClick"
          @recipe-drop="handleRecipeDrop"
          @recipe-delete="handleSlotDelete"          
        /><!-- CalendarGrid에 있던 emit 호출을 여기서 받아서 handleRecipeDrop 여기서 실행-->
      </div>
    </section>

    <div
      v-if="dragging"
      class="meal-plan__drag-ghost"
      :style="{ left: pointerPos.x + 'px', top: pointerPos.y + 'px' }"
    ><!-- 드래그일때 마우스 좌표따라서 css도 따라다니게 실시 -->
      {{ dragging.rcp_nm }}
    </div>
  </div>
</template>



<style scoped>
.meal-plan { padding-block: var(--space-6); }
.meal-plan.container {
  max-width: 1400px; 
}
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
  position: relative;
  display: flex;
  gap: var(--space-5);
  align-items: flex-start;
}

.meal-plan__search {
  width: 300px;
  flex-shrink: 0;
}

.meal-plan__calendar {
  flex: 1;
  min-width: 0;
}
.meal-plan__summary {
  display: flex;
  flex-direction: row;
  justify-content: center;  
  gap: var(--space-3);
  margin-bottom: var(--space-5);
  overflow-x: auto;
  padding-bottom: var(--space-2);
  /* 스크롤바 눌림 방지용 여백 */
}
.meal-plan__summary-btn {
  align-self: flex-start;
  margin-top: var(--space-1);
  padding: var(--space-1) var(--space-3);
  font-size: var(--text-xs);
}
.meal-plan__summary-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--surface-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  flex: 0 0 auto;
  /* 카드가 줄어들지 않고 내용 크기만큼 폭 유지 */
  min-width: 200px;
  width: 230px;      /* min-width 대신 고정 width */
  flex-shrink: 0;
}
.meal-plan__summary-card--top1 {
  position: relative;
  padding-bottom: calc(var(--space-3) + 24px);
  /* 버튼이 들어갈 자리만큼 아래쪽 여백 확보 */
}

.meal-plan__summary-card--top1 .meal-plan__summary-btn {
  position: absolute;
  right: var(--space-3);
  bottom: var(--space-2);
  margin-top: 0;
}
.meal-plan__summary-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-weight: var(--weight-medium);
}

.meal-plan__summary-value {
  font-size: var(--text-3xl);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
}
.meal-plan__summary-sub {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-weight: var(--weight-normal);
}
.meal-plan__summary-value small {
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--text-secondary);
}

.meal-plan__summary-value--sm {
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meal-plan__summary-card--top1 .meal-plan__summary-value--sm {
  color: var(--accent);
}
.meal-plan__macro-row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.meal-plan__macro-legend {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.meal-plan__macro-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.meal-plan__macro-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.meal-plan__gauge {
  width: 100%;
  height: 6px;
  background: #e5e5e5; 
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-block: var(--space-1);
}

.meal-plan__gauge-fill {
  height: 100%;
  background: var(--accent);
  border-radius: var(--radius-full);
  transition: width 0.3s ease;
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
.recipe-preview-popover {
  position: absolute;
  top: 0;
  left: 300px;
  z-index: 50;
  width: 260px;
  flex-shrink: 0;
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.recipe-preview-popover__close {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  border: none;
  background: transparent;
  font-size: 16px;
  color: var(--text-secondary);
  cursor: pointer;
}

.recipe-preview-popover__title {
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
  padding-right: 20px;
}

.recipe-preview-popover__stats {
  display: flex;
  gap: var(--space-4);
}

.recipe-preview-popover__stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recipe-preview-popover__stat-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.recipe-preview-popover__stat-value {
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
}

.recipe-preview-popover__section-label {
  font-size: var(--text-xs);
  color: var(--text-secondary);
  font-weight: var(--weight-medium);
}

.recipe-preview-popover__chips {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: var(--space-1);
}

.recipe-preview-popover__chip {
  padding: 4px 10px;
  background: var(--surface-sunken);
  border-radius: 999px;
  font-size: var(--text-xs);
  color: var(--text-primary);
}

.recipe-preview-popover__hashtag {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  line-height: 1.5;
}

.recipe-preview-popover__detail-btn {
  width: 100%;
  margin-top: var(--space-1);
}

.recipe-preview-popover__status {
  text-align: center;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  padding: var(--space-4) 0;
}

.recipe-preview-popover__status--error {
  color: var(--danger);
}
.meal-plan__summary-card--ai {
  gap: var(--space-2);
}

.ai-fill__input-area {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.ai-fill__input {
  width: 100%;
  height: 36px;
  padding: 0 var(--space-3);
  background: var(--surface-sunken);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 12.5px;
  color: var(--text-primary);
}
.ai-fill__input:focus {
  outline: none;
  border-color: var(--accent);
}
.ai-fill__input::placeholder {
  color: var(--text-secondary);
}

.ai-fill__submit-btn {
  width: 100%;
  padding: var(--space-2) 0;
  background: var(--accent);
  color: var(--text-on-inverse);
  border: none;
  border-radius: var(--radius-md);
  font-size: 12.5px;
  font-weight: var(--weight-medium);
  cursor: pointer;
}
.ai-fill__submit-btn:disabled {
  background: var(--surface-sunken);
  color: var(--text-secondary);
  cursor: not-allowed;
}

.ai-fill__result {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.ai-fill__result-msg {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--accent);
}

.ai-fill__result-count {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.ai-fill__rollback-btn {
  margin-top: var(--space-1);
  padding: var(--space-1) var(--space-3);
  background: transparent;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  font-size: 12.5px;
  color: var(--text-primary);
  cursor: pointer;
}
.ai-fill__rollback-btn:hover {
  border-color: var(--danger);
  color: var(--danger);
}
.ai-fill__actions {
  display: flex;
  gap: var(--space-2);
}

.ai-fill__confirm-btn {
  flex: 1;
  padding: var(--space-1) var(--space-3);
  background: var(--accent);
  color: var(--text-on-inverse);
  border: none;
  border-radius: var(--radius-md);
  font-size: 12.5px;
  cursor: pointer;
}

.ai-fill__rollback-btn {
  flex: 1;
  /* 기존 스타일 유지, flex: 1만 추가 */
}
</style>