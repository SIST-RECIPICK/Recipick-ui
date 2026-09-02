<template>
  <div class="fridge container">
    <header class="fridge__head">
      <div class="fridge__head-text">
        <h1 class="fridge__title">냉장고 파먹기</h1>
        <p class="fridge__subtitle text-secondary">
          가지고 있는 재료로 지금 만들 수 있는 레시피를 확인해보세요!
        </p>
      </div>
      <RouterLink to="/fridge/register" class="btn btn--primary fridge__register">
        <IconPlus :size="18" /> 냉장고 등록
      </RouterLink>
    </header>

    <div class="fridge__layout">
      <!-- ===== 좌: 재료 사이드바 ===== -->
      <aside class="fridge__aside">
        <!-- 선택한 재료 -->
        <section class="ingbox">
          <h2 class="ingbox__title">선택한 재료</h2>
          <ul v-if="selectedIngredients.length" class="chosen">
            <li v-for="ing in selectedIngredients" :key="ing.id" class="chosen__row">
              <span>{{ ing.name }}</span>
              <button class="chosen__remove" aria-label="제거" @click="deselect(ing)">
                <IconX :size="16" />
              </button>
            </li>
          </ul>
          <p v-else class="ingbox__empty text-muted">아래에서 재료를 선택하세요.</p>
        </section>

        <!-- 나의 냉장고 -->
        <section class="ingbox">
          <div class="ingbox__head">
            <h2 class="ingbox__title">나의 냉장고</h2>
            <label class="ingbox__all">
              <input
                type="checkbox"
                :checked="allFridgeSelected"
                @change="toggleAllFridge"
              />
              전체 선택
            </label>
          </div>
          <div class="search">
            <IconSearch :size="16" class="search__icon" />
            <input
              v-model="fridgeQuery"
              class="search__input"
              type="text"
              placeholder="냉장고 속 재료를 검색하세요."
            />
          </div>
          <ul class="checklist">
            <li v-for="ing in filteredFridge" :key="ing.id" class="checklist__row">
              <label class="checklist__label">
                <input type="checkbox" v-model="ing.checked" />
                {{ ing.name }}
              </label>
            </li>
          </ul>
        </section>

        <!-- 추가 재료 -->
        <section class="ingbox">
          <h2 class="ingbox__title">추가 재료</h2>
          <div class="search">
            <IconSearch :size="16" class="search__icon" />
            <input
              v-model="extraQuery"
              class="search__input"
              type="text"
              placeholder="추가하고 싶은 재료를 검색하세요."
            />
          </div>
          <ul class="checklist">
            <li v-for="ing in filteredExtra" :key="ing.id" class="checklist__row">
              <label class="checklist__label">
                <input type="checkbox" v-model="ing.checked" />
                {{ ing.name }}
              </label>
            </li>
          </ul>
        </section>
      </aside>

      <!-- ===== 우: 검색 결과 ===== -->
      <div class="fridge__results">
        <div class="results__head">
          <div class="results__info">
            <strong>검색 결과 {{ totalCount }}개</strong>
            <span class="legend"><i class="legend__dot legend__dot--have"></i> 냉장고 재료</span>
            <span class="legend"><i class="legend__dot legend__dot--miss"></i> 추가로 필요한 재료</span>
          </div>
          <div class="sort">
            <button
              class="sort__btn"
              :class="{ 'is-active': sort === 'match' }"
              @click="sort = 'match'"
            >
              일치율순
            </button>
            <button
              class="sort__btn"
              :class="{ 'is-active': sort === 'popular' }"
              @click="sort = 'popular'"
            >
              인기순
            </button>
          </div>
        </div>

        <p v-if="loading" class="results__empty text-muted">불러오는 중…</p>
        <div v-else-if="recipes.length" class="results__list">
          <FridgeRecipeCard
            v-for="recipe in recipes"
            :key="recipe.id"
            :recipe="recipe"
          />
        </div>
        <p v-else class="results__empty text-muted">
          선택한 재료로 만들 수 있는 레시피가 없습니다.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { IconX, IconSearch, IconPlus } from '@tabler/icons-vue'
import FridgeRecipeCard from '@/components/fridge/FridgeRecipeCard.vue'
import { useFridgeStore } from '@/stores/fridgeStore'

const fridgeStore = useFridgeStore()
const { recipes, totalCount, loading } = storeToRefs(fridgeStore)

// ── 화면 로컬 UI 상태 ──
const fridgeQuery = ref('')
const extraQuery = ref('')
const sort = ref('match')

// 냉장고 재료: store에서 로드한 재료에 화면용 checked 를 입힌 로컬 목록
// (checked = 이번 검색에 사용할지 여부. 체크 상태는 이 화면에서만 쓰는 UI 상태)
const fridge = ref([])

// 진입 시: 재료 마스터 + 내 냉장고 로드 → checked=true 로 초기화
onMounted(async () => {
  await Promise.all([fridgeStore.loadIngredients(), fridgeStore.loadMyFridge()])
  fridge.value = fridgeStore.myIngredients.map((ing) => ({
    id: ing.id,
    name: ing.name,
    checked: true,
  }))
})

// 추가 재료: "냉장고엔 없지만 있다 치고" 넣어보는 임시 재료 (화면 로컬)
const extra = ref([
  { id: 'e1', name: '돼지고기', checked: true },
  { id: 'e2', name: '고추장', checked: true },
  { id: 'e3', name: '간장', checked: true },
  { id: 'e4', name: '설탕', checked: false },
  { id: 'e5', name: '참기름', checked: false },
  { id: 'e6', name: '고춧가루', checked: false },
])

// 검색 필터
const filteredFridge = computed(() =>
  fridge.value.filter((i) => i.name.includes(fridgeQuery.value.trim()))
)
const filteredExtra = computed(() =>
  extra.value.filter((i) => i.name.includes(extraQuery.value.trim()))
)

// 전체 선택 (냉장고)
const allFridgeSelected = computed(
  () => fridge.value.length > 0 && fridge.value.every((i) => i.checked)
)
function toggleAllFridge(e) {
  const val = e.target.checked
  fridge.value.forEach((i) => (i.checked = val))
}

// 선택한 재료 = 냉장고✓ + 추가재료✓ 합집합
const selectedIngredients = computed(() => [
  ...fridge.value.filter((i) => i.checked),
  ...extra.value.filter((i) => i.checked),
])
const selectedNames = computed(() => selectedIngredients.value.map((i) => i.name))

function deselect(ing) {
  const inFridge = fridge.value.find((i) => i.id === ing.id)
  if (inFridge) inFridge.checked = false
  const inExtra = extra.value.find((i) => i.id === ing.id)
  if (inExtra) inExtra.checked = false
}

// 선택 재료·정렬이 바뀔 때마다 store action 으로 재조회
watch(
  [selectedNames, sort],
  () => fridgeStore.loadMatches(selectedNames.value, sort.value),
  { immediate: true }
)
</script>

<style scoped>
.fridge { padding-block: var(--space-6); }

.fridge__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}
.fridge__register { flex-shrink: 0; }
.fridge__title { font-size: var(--text-2xl); margin-bottom: var(--space-1); }

.fridge__layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--space-6);
  align-items: start;
}

/* ----- 좌: 사이드바 ----- */
.fridge__aside {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.ingbox {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  padding: var(--space-4);
}
.ingbox__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.ingbox__title {
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-3);
}
.ingbox__head .ingbox__title { margin-bottom: 0; }
.ingbox__all {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  margin-bottom: var(--space-3);
}
.ingbox__empty { font-size: var(--text-sm); }

/* 선택한 재료 */
.chosen {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  /* 많이 선택하면 이 영역만 스크롤 */
  max-height: 220px;
  overflow-y: auto;
  scrollbar-width: thin;
  /* 스크롤바가 X 버튼과 겹치지 않도록 여백 확보 (정렬 유지) */
  margin-right: calc(var(--space-2) * -1);
  padding-right: var(--space-2);
}
.chosen__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  background: var(--surface-sunken);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}
.chosen__remove {
  display: flex;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}
.chosen__remove:hover { color: var(--danger); }

/* 검색창 */
.search {
  position: relative;
  margin-bottom: var(--space-3);
}
.search__icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}
.search__input {
  width: 100%;
  height: 38px;
  padding: 0 var(--space-3) 0 var(--space-6);
  background: var(--surface-sunken);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--text-primary);
  font-size: var(--text-sm);
}
.search__input:focus {
  outline: none;
  background: var(--surface-card);
  border-color: var(--accent);
}

/* 체크리스트 */
.checklist { display: flex; flex-direction: column; }
.checklist__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) 0;
  font-size: var(--text-sm);
}
.checklist__label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

/* ----- 우: 결과 ----- */
.results__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: var(--space-3);
  padding-bottom: var(--space-4);
  margin-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}
.results__info {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  font-size: var(--text-sm);
}
.legend {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--text-secondary);
}
.legend__dot {
  width: 8px; height: 8px;
  border-radius: 50%;
  display: inline-block;
}
.legend__dot--have { background: var(--accent); }
.legend__dot--miss { background: var(--border-strong); }

/* 정렬 토글 */
.sort { display: flex; gap: var(--space-1); }
.sort__btn {
  padding: var(--space-1) var(--space-3);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--surface-card);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.sort__btn.is-active {
  background: var(--surface-inverse);
  color: var(--text-on-inverse);
  border-color: var(--surface-inverse);
}

.results__list { display: flex; flex-direction: column; gap: var(--space-3); }
.results__empty { padding: var(--space-8) 0; text-align: center; }

@media (max-width: 900px) {
  .fridge__layout { grid-template-columns: 1fr; }
}
</style>