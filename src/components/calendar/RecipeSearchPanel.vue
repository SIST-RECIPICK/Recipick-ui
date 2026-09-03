<script setup>
import { useRecipeSearch } from '@/composables/useRecipeSearch.js'
import { useDragDrop } from '@/composables/useDragDrop.js' // 드롭파일 임포트

const props = defineProps({
  userId: { type: [Number, Object], required: true },
})

const { keyword, results, loading, errorMsg, search } = useRecipeSearch(props.userId)
const { dragging, startDrag } = useDragDrop() // 드래그 파일에서 두개의 함수 가져오기

function clearQuery() {
  keyword.value = ''
  results.value = []
}

function onPointerDown(event, recipe) {
  if (event.target.closest('button')) return // 버튼 클릭시 드래그 방지
  startDrag(recipe, event) // 버튼이 아니면 함수 실행(useDragDrop)
}
</script>

<template>
  <aside class="recipe-panel">
    <!-- 탭 (냉장고 모드는 추후 연결) -->
    <div class="recipe-panel__tabs">
      <button class="recipe-panel__tab recipe-panel__tab--active">레시피 검색</button>
      <button class="recipe-panel__tab" disabled title="추후 지원 예정">나의 냉장고</button>
    </div>

    <!-- 검색창 -->
    <div class="recipe-panel__search-box">
      <span class="recipe-panel__search-dot"></span>
      <input
        v-model="keyword"
        class="recipe-panel__search-input"
        type="search"
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
          <span v-if="r.is_bookmark" class="recipe-card__bookmark">★</span>
        </div>

        <div class="recipe-card__body">
          <div class="recipe-card__name">{{ r.rcp_nm }}</div>
          <div class="recipe-card__stats">
            <span>{{ r.info_eng }} kcal</span>
            <span class="recipe-card__dot">·</span>
            <span>{{ r.rcp_pat2 }}</span>
          </div>
          <div class="recipe-card__actions">
            <button class="recipe-card__btn recipe-card__btn--preview">미리보기</button>
            <button class="recipe-card__btn recipe-card__btn--open">조리법 →</button>
          </div>
        </div>
      </div>

      <div v-if="!loading && !errorMsg && results.length === 0 && keyword" class="recipe-panel__empty">
        검색 결과가 없어요.<br>다른 키워드로 찾아보세요.
      </div>
    </div>
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
.recipe-card__bookmark {
  position: absolute;
  top: 3px;
  left: 3px;
  color: var(--accent);
  font-size: 12px;
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

.recipe-card__actions { display: flex; gap: 6px; margin-top: 1px; }
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
</style>
