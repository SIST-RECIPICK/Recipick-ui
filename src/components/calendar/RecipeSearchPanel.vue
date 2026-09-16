<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRecipeSearch } from '@/composables/useRecipeSearch.js'
import { useDragDrop } from '@/composables/useDragDrop.js' // 드롭파일 임포트
import { useRecipePreviewStore } from '@/stores/recipePreview'
import { useFridgeStore } from '@/stores/fridgeStore'
import FridgeRecipeCard from '@/components/fridge/FridgeRecipeCard.vue'

const props = defineProps({
  userId: { type: [Number, Object], required: true },
})
const previewStore = useRecipePreviewStore()

const { keyword, results, loading, errorMsg, search } = useRecipeSearch(props.userId)
const { dragging, startDrag } = useDragDrop() // 드래그 파일에서 두개의 함수 가져오기
const fridgeStore = useFridgeStore()

const activeTab = ref('search')// 현재 탭(search)

const fridge = ref([])
// 나의 냉장고 재료 목록 (체크박스 상태 포함)

const hasSearched = ref(false)
// 매칭을 한 번이라도 실행했는지

async function initFridgeTab() {
  const userIdValue = props.userId.value ?? props.userId
  await fridgeStore.loadMyFridge(userIdValue)

  // ingredient_id 기준으로 중복 제거
  const uniqueMap = new Map()
  fridgeStore.myIngredients
    .filter((r) => r.ingredient)
    .forEach((r) => {
      uniqueMap.set(r.ingredient_id, {
        id: r.ingredient_id,
        name: r.ingredient.ingredient_name,
        checked: true,
      })
    })
  fridge.value = Array.from(uniqueMap.values())
}

const allFridgeSelected = computed(
  () => fridge.value.length > 0 && fridge.value.every((i) => i.checked)
)

function toggleAllFridge(e) {
  const val = e.target.checked
  fridge.value.forEach((i) => (i.checked = val))
}

const selectedIngredients = computed(() =>
  fridge.value.filter((i) => i.checked)
)
// extra 없이, fridge만 필터링

const selectedNames = computed(() => selectedIngredients.value.map((i) => i.name))

function deselect(ing) {
  const inFridge = fridge.value.find((i) => i.id === ing.id)
  if (inFridge) inFridge.checked = false
}
// extra 관련 부분 제거

async function handleMatch() {
  await fridgeStore.loadMatches(selectedNames.value)
  hasSearched.value = true
}
function switchToSearchTab() {
  activeTab.value = 'search'
}
function clearQuery() {
  keyword.value = ''
  results.value = []
}

function onPointerDown(event, recipe) {
  if (event.target.closest('button')) return // 버튼 클릭시 드래그 방지
  startDrag(recipe, event) // 버튼이 아니면 함수 실행(useDragDrop)
}
function onPreviewClick(rcpSeq){
  previewStore.loadPreview(rcpSeq)
}
function onFridgeCardPointerDown(event, recipe) {
  const startX = event.clientX
  const startY = event.clientY  // 시작 x,y 좌표
  let dragStarted = false

  function onMove(moveEvent) {
    const dx = Math.abs(moveEvent.clientX - startX)
    const dy = Math.abs(moveEvent.clientY - startY)
    // 5px 이상 움직이면 "드래그 의도"로 판단
    if (!dragStarted && (dx > 5 || dy > 5)) {
      dragStarted = true
      // 이 시점에 실제 드래그 시작 
      event.preventDefault()
      const dragRecipe = {
        rcp_seq: recipe.rcpSeq,
        rcp_nm: recipe.title,
        att_file_no_main: recipe.image,
      }
      console.log('드래그 시작 recipe:', dragRecipe)
      startDrag(dragRecipe, event)
      cleanup()
    }
  }

  function onUp() {
    // 많이 안 움직이고 그냥 놓았으면 -> 아무것도 안 함, RouterLink가 알아서 클릭 처리
    cleanup()
  }

  function cleanup() {
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
  }

  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
}
</script>

<template>
  <aside class="recipe-panel">
    <!-- 탭 (냉장고 모드는 추후 연결) -->
    <div class="recipe-panel__tabs">
      <button class="recipe-panel__tab"
              :class="{ 'recipe-panel__tab--active': activeTab === 'search' }"
              @click="switchToSearchTab"
      >레시피 검색</button>
      <button class="recipe-panel__tab"
              :class="{ 'recipe-panel__tab--active': activeTab === 'fridge' }"
              @click="activeTab = 'fridge'; initFridgeTab()"
      >나의 냉장고</button>
    </div>
    <template v-if="activeTab === 'search'">
    <!-- 검색창 -->
    <div class="recipe-panel__search-box">
      <span class="recipe-panel__search-dot"></span>
      <input
        v-model="keyword"
        class="recipe-panel__search-input"
        type="text"
        placeholder="레시피, 재료, 카테고리 검색"
        @keyup.enter="search"
      />
      <button
        v-if="keyword"
        class="recipe-panel__clear-btn"
        aria-label="검색어 지우기"
        @click="clearQuery"
      >×</button>
    </div>

    <!-- 결과 라벨 -->
    <div class="recipe-panel__meta-row">
      <span class="recipe-panel__meta-label">검색 결과</span>
      <span class="recipe-panel__meta-count">{{ results.length }}개</span>
      <span class="recipe-panel__meta-hint">카드를 달력으로 끌어다 놓으세요</span>
    </div>

    <!-- 상태 -->
    <p v-if="loading" class="recipe-panel__status">검색 중...</p>
    <p v-else-if="errorMsg" class="recipe-panel__status recipe-panel__status--error">{{ errorMsg }}</p>

    <!-- 결과 리스트 , 드래그 중인게 자신이면 투명도 추가하여 드래그 중인걸 표시, 카드 누르는 순간 함수 실행 이벤트,레시피 넘김-->
    <div class="recipe-panel__list">
      <div
        v-for="r in results"
        :key="r.rcp_seq"
        class="recipe-card"
        :class="{ 'recipe-card--dragging': dragging === r }"
        @pointerdown="onPointerDown($event, r)"
      >
        <div class="recipe-card__thumb">
          <img v-if="r.att_file_no_main" :src="r.att_file_no_main" alt="" draggable="false" />
          <span v-else class="recipe-card__thumb-fallback">🍳</span>
          
        </div>

        <div class="recipe-card__body">
          <div class="recipe-card__name-row">
            <span class="recipe-card__name">{{ r.rcp_nm }}</span>
            <span v-if="r.is_bookmark" class="recipe-card__bookmark">⭐</span>
          </div>
          <div class="recipe-card__stats">
            <span>{{ r.info_eng }} kcal</span>
            <span class="recipe-card__dot">·</span>
            <span>{{ r.rcp_pat2 }}</span>
            
          </div>
          <div class="recipe-card__actions">
            <button class="recipe-card__btn recipe-card__btn--preview" @click.stop="onPreviewClick(r.rcp_seq)">미리보기</button>
          </div>
        </div>
      </div>

      <div v-if="!loading && !errorMsg && results.length === 0 && keyword" class="recipe-panel__empty">
        검색 결과가 없어요.<br>다른 키워드로 찾아보세요.
      </div>
    </div>
    </template>
    <template v-else>      
      <!-- 선택한 재료 목록: 체크된 재료들이 여기 모여서 보임 -->
      <div class="fridge-panel__section">
        <span class="fridge-panel__section-title">선택한 재료</span>
        <ul v-if="selectedIngredients.length" class="fridge-panel__chosen-list">
          <li
            v-for="ing in selectedIngredients"
            :key="ing.id"
            class="fridge-panel__chosen-item"
          >
            <span>{{ ing.name }}</span>
            <button class="fridge-panel__remove-btn" @click="deselect(ing)">×</button>
          </li>
        </ul>
        <p v-else class="fridge-panel__empty-hint">아래에서 재료를 선택하세요.</p>
      </div>

      <!-- 나의 냉장고: 검색창 없이 체크박스 목록만 -->
      <div class="fridge-panel__section">
        <div class="fridge-panel__section-head">
          <span class="fridge-panel__section-title">나의 냉장고 ({{ fridge.length }})</span>
          <label class="fridge-panel__select-all">
            <input
              type="checkbox"
              :checked="allFridgeSelected"
              @change="toggleAllFridge"
            />
            전체선택
          </label>
        </div>
        <ul class="fridge-panel__checklist">
          <li v-for="ing in fridge" :key="ing.id" class="fridge-panel__checklist-item">
            <label>
              <input type="checkbox" v-model="ing.checked" />
              {{ ing.name }}
            </label>
          </li>
        </ul>
      </div>

      <!-- 매칭 시작 버튼 -->
      <button
        class="fridge-panel__match-btn"
        :disabled="!selectedNames.length"
        @click="handleMatch"
      >선택한 재료로 검색</button>

      <!-- 검색 결과 -->
      <div class="fridge-panel__section">
        <span class="fridge-panel__section-title">검색 결과 {{ fridgeStore.totalCount }}건</span>
        <p v-if="fridgeStore.loading" class="recipe-panel__status">불러오는 중...</p>
        <p v-else-if="!hasSearched" class="recipe-panel__status">
          재료를 선택하고 버튼을 눌러 레시피를 찾아보세요.
        </p>
        <p v-else-if="fridgeStore.recipes.length === 0" class="recipe-panel__status">
          선택한 재료로 만들 수 있는 레시피가 없어요.
        </p>
        <div v-else class="recipe-panel__list">
          <div
            v-for="r in fridgeStore.recipes"
            :key="r.id"
            @pointerdown="onFridgeCardPointerDown($event, r)"
          >
          <FridgeRecipeCard :recipe="r"/>
        </div>
      </div>
    </div>
    </template>
  </aside>
</template>

<style scoped>
.recipe-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: var(--space-4);
}

/* 탭 */
.recipe-panel__tabs {
  display: flex;
  gap: 3px;
  padding: 3px;
  background: var(--surface-sunken);
  border-radius: 10px;
}
.recipe-panel__tab {
  flex: 1;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  font-weight: 500;
  padding: 7px 0;
  border-radius: 7px;
  cursor: pointer;
}
.recipe-panel__tab--active {
  background: var(--surface-card);
  color: var(--text-primary);
  box-shadow: 0 1px 3px rgba(0,0,0,.08);
}
.recipe-panel__tab:disabled { cursor: not-allowed; opacity: .5; }

/* 검색창 */
.recipe-panel__search-box {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  height: 42px;
  padding: 0 var(--space-3);
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  transition: border-color .15s ease;
}
.recipe-panel__search-box:focus-within { border-color: var(--accent); }
.recipe-panel__search-dot {
  width: 13px;
  height: 13px;
  border: 1.8px solid var(--text-secondary);
  border-radius: 50%;
  flex-shrink: 0;
}
.recipe-panel__search-input {
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  font-size: 13.5px;
  color: var(--text-primary);
}
.recipe-panel__search-input::placeholder { color: var(--text-secondary); }
.recipe-panel__clear-btn {
  flex-shrink: 0;
  border: 0;
  background: var(--surface-sunken);
  width: 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 12px;
  line-height: 1;
  color: var(--text-secondary);
  cursor: pointer;
}

/* 결과 라벨 */
.recipe-panel__meta-row {
  display: flex;
  align-items: baseline;
  gap: 7px;
}
.recipe-panel__meta-label { font-size: 11.5px; font-weight: 700; color: var(--text-secondary); }
.recipe-panel__meta-count { font-size: 11.5px; font-family: ui-monospace, Menlo, monospace; color: var(--accent); }
.recipe-panel__meta-hint { margin-left: auto; font-size: 10.5px; color: var(--text-secondary); }

.recipe-panel__status { font-size: var(--text-sm); color: var(--text-secondary); text-align: center; }
.recipe-panel__status--error { color: var(--danger); }

/* 결과 리스트 */
.recipe-panel__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  max-height: 480px;
  overflow-y: auto;
}
.recipe-panel__list :deep(.fr-card) {
  /* 기존 4컬럼(썸네일/본문/도넛/화살표) 가로 배치를 세로로 변경 */
  display: flex;
  flex-direction: row;
  gap: var(--space-2);
  padding: var(--space-3);
}

.recipe-panel__list :deep(.fr-card__thumb) {
  /* 썸네일을 카드 폭에 맞게 줄임 */
  width: 58px;
  height: 58px;
  flex-shrink: 0;
  border-radius: 8px;
}
.recipe-panel__list :deep(.fr-card__tags) {
  gap: 4px;
}
.recipe-panel__list :deep(.fr-card__chef) {
  display: none;
}
.recipe-panel__list :deep(.fr-tag) {
  font-size: 10px;
  padding: 1px 6px;
}
.recipe-panel__list :deep(.fr-card__body) {
  flex: 1;
  min-width: 0;
}
.recipe-panel__list :deep(.fr-card__title) {
  font-size: var(--text-sm);
}

.recipe-panel__list :deep(.fr-card__arrow) {
  /* 화살표는 좁은 카드에서 불필요하니 숨김 */
  display: none;
}
.recipe-panel__empty {
  padding: 36px 12px;
  text-align: center;
  font-size: 12.5px;
  line-height: 1.7;
  color: var(--text-secondary);
}

/* 카드 */
.recipe-card {
  display: flex;
  gap: 11px;
  padding: 10px;
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: 11px;
  cursor: grab;
  transition: border-color .15s ease, box-shadow .15s ease;
}
.recipe-card:hover { border-color: var(--accent); box-shadow: 0 2px 10px rgba(0,0,0,.06); }
.recipe-card:active { cursor: grabbing; }
.recipe-card--dragging { opacity: .45; }

.recipe-card__thumb {
  position: relative;
  flex-shrink: 0;
  width: 58px;
  height: 58px;
  border-radius: 8px;
  background: var(--surface-sunken);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.recipe-card__thumb img { width: 100%; height: 100%; object-fit: cover; }
.recipe-card__thumb-fallback { font-size: 22px; }
.recipe-card__name-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 4px;
}
.recipe-card__bookmark {
  color: var(--accent);
  font-size: 16px;
  text-shadow: 0 0 3px rgba(255,255,255,.9);
}

.recipe-card__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.recipe-card__name {
  font-size: 13.5px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.recipe-card__stats {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: var(--text-secondary);
  font-family: ui-monospace, Menlo, monospace;
}
.recipe-card__dot { opacity: .5; }

.recipe-card__actions { display: flex;justify-content: flex-end; gap: 6px; margin-top: 1px; }
.recipe-card__btn {
  border: 1px solid var(--border);
  background: var(--surface-sunken);
  font-size: 11px;
  font-weight: 500;
  padding: 4px 9px;
  border-radius: 6px;
  color: var(--text-primary);
  cursor: pointer;
}
.recipe-card__btn--preview:hover { background: var(--text-primary); color: var(--surface-card); border-color: var(--text-primary); }
.recipe-card__btn--open {
  border-color: transparent;
  background: transparent;
  color: var(--text-secondary);
}
.recipe-card__btn--open:hover { color: var(--accent); }
/* 냉장고 탭 전체 섹션 공통 */
.fridge-panel__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.fridge-panel__section-title {
  font-size: 11.5px;
  font-weight: 700;
  color: var(--text-secondary);
}

.fridge-panel__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 선택한 재료 태그 목록 */
.fridge-panel__chosen-list {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.fridge-panel__chosen-item {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  background: var(--accent-subtle);
  border-radius: var(--radius-full, 999px);
  font-size: 12.5px;
  color: var(--text-primary);
}

.fridge-panel__remove-btn {
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: 12px;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.fridge-panel__empty-hint {
  font-size: 12.5px;
  color: var(--text-secondary);
}

/* 전체선택 체크박스 라벨 */
.fridge-panel__select-all {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
}

/* 나의 냉장고 체크박스 리스트 */
.fridge-panel__checklist {
  display: flex;
  flex-direction: column;
  gap: 4px;
  max-height: 160px;
  overflow-y: auto;
}

.fridge-panel__checklist-item label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: var(--text-primary);
  cursor: pointer;
  padding: 4px 0;
}

/* 매칭 버튼 */
.fridge-panel__match-btn {
  width: 100%;
  padding: 10px 0;
  background: var(--accent);
  color: var(--text-on-inverse);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}
.fridge-panel__match-btn:disabled {
  background: var(--surface-sunken);
  color: var(--text-secondary);
  cursor: not-allowed;
}
</style>
