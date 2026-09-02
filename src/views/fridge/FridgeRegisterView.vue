<template>
  <div class="freg container">
    <header class="freg__head">
      <div>
        <h1 class="freg__title">냉장고 등록</h1>
        <p class="freg__subtitle text-secondary">
          가지고 있는 재료를 골라 냉장고에 담아보세요.
        </p>
      </div>
      <RouterLink to="/fridge" class="btn btn--outline">← 냉장고 파먹기</RouterLink>
    </header>

    <div class="freg__layout">
      <!-- ===== 좌: 재료 고르기 ===== -->
      <div class="freg__picker">
        <!-- 검색 -->
        <div class="search">
          <IconSearch :size="18" class="search__icon" />
          <input
            v-model="query"
            class="search__input"
            type="text"
            placeholder="재료를 검색하세요."
          />
        </div>

        <!-- 카테고리 탭 -->
        <div class="cat-tabs" role="tablist">
          <button
            v-for="cat in categories"
            :key="cat.key"
            class="cat-tabs__tab"
            role="tab"
            :aria-selected="activeCat === cat.key"
            @click="activeCat = cat.key"
          >
            {{ cat.label }}
          </button>
        </div>

        <!-- 재료 그리드 -->
        <div v-if="visibleIngredients.length" class="ing-grid">
          <button
            v-for="ing in visibleIngredients"
            :key="ing.id"
            class="ing-chip"
            :class="{ 'is-picked': picked.has(ing.id) }"
            @click="toggle(ing)"
          >
            {{ ing.name }}
            <component :is="picked.has(ing.id) ? IconCheck : IconPlus" :size="15" />
          </button>
        </div>
        <p v-else class="ing-grid__empty text-muted">검색 결과가 없습니다.</p>
      </div>

      <!-- ===== 우: 내 냉장고 (담기 패널) ===== -->
      <aside class="freg__cart">
        <div class="fridge-box">
          <div class="fridge-box__head">
            <IconFridge :size="18" />
            <span>내 냉장고</span>
            <span class="fridge-box__count">{{ pickedList.length }}</span>
          </div>

          <div class="fridge-box__body">
            <p v-if="!pickedList.length" class="fridge-box__empty text-muted">
              아직 담은 재료가 없습니다.<br />왼쪽에서 재료를 선택하세요.
            </p>

            <!-- 카테고리별로 묶어서 표시 -->
            <div
              v-for="group in pickedByCategory"
              :key="group.key"
              class="fridge-box__group"
            >
              <p class="fridge-box__cat">{{ group.label }}</p>
              <ul class="picked-list">
                <li v-for="ing in group.items" :key="ing.id" class="picked-list__row">
                  <span>{{ ing.name }}</span>
                  <button class="picked-list__remove" aria-label="빼기" @click="toggle(ing)">
                    <IconX :size="15" />
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <button
            class="btn btn--primary btn--block fridge-box__save"
            :disabled="!pickedList.length || saving"
            @click="handleSave"
          >
            냉장고에 저장 ({{ pickedList.length }})
          </button>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import {
  IconSearch, IconPlus, IconCheck, IconX, IconFridge,
} from '@tabler/icons-vue'
import { useFridgeStore } from '@/stores/fridgeStore'

const router = useRouter()
const fridgeStore = useFridgeStore()
const { ingredients } = storeToRefs(fridgeStore)

// ── 화면 로컬 UI 상태 ──
const query = ref('')
const activeCat = ref('all')
const saving = ref(false)
const picked = ref(new Set()) // 담은 재료 id 집합

const categories = [
  { key: 'all', label: '전체' },
  { key: 'vegetable', label: '채소' },
  { key: 'meat', label: '육류·해산물' },
  { key: 'dairy', label: '유제품·달걀' },
  { key: 'grain', label: '곡물·면' },
  { key: 'sauce', label: '양념·소스' },
]

// 진입 시: 재료 마스터 + 기존 냉장고 재료 로드 → 이미 담긴 재료 프리필
onMounted(async () => {
  await Promise.all([fridgeStore.loadIngredients(), fridgeStore.loadMyFridge()])
  picked.value = new Set(fridgeStore.myFridgeIds)
})

const categoryLabel = (key) =>
  categories.find((c) => c.key === key)?.label ?? key

// 검색 + 카테고리 필터
const visibleIngredients = computed(() =>
  ingredients.value.filter((ing) => {
    const matchCat = activeCat.value === 'all' || ing.category === activeCat.value
    const matchQuery = ing.name.includes(query.value.trim())
    return matchCat && matchQuery
  })
)

// 담기 토글
function toggle(ing) {
  const next = new Set(picked.value)
  if (next.has(ing.id)) next.delete(ing.id)
  else next.add(ing.id)
  picked.value = next
}

// 담은 재료 목록
const pickedList = computed(() =>
  ingredients.value.filter((ing) => picked.value.has(ing.id))
)

// 담은 재료를 카테고리별로 그룹핑
const pickedByCategory = computed(() => {
  const groups = {}
  for (const ing of pickedList.value) {
    if (!groups[ing.category]) {
      groups[ing.category] = { key: ing.category, label: categoryLabel(ing.category), items: [] }
    }
    groups[ing.category].items.push(ing)
  }
  return Object.values(groups)
})

// 저장 → store action (내부에서 api 호출)
async function handleSave() {
  saving.value = true
  try {
    await fridgeStore.saveFridge([...picked.value])
    router.push('/fridge')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.freg { padding-block: var(--space-6); }

.freg__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-5);
}
.freg__title { font-size: var(--text-2xl); margin-bottom: var(--space-1); }

.freg__layout {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: var(--space-6);
  align-items: start;
}

/* ----- 좌: 재료 고르기 ----- */
.search { position: relative; margin-bottom: var(--space-4); }
.search__icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}
.search__input {
  width: 100%;
  height: 44px;
  padding: 0 var(--space-4) 0 var(--space-8);
  background: var(--surface-sunken);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  color: var(--text-primary);
}
.search__input:focus {
  outline: none;
  background: var(--surface-card);
  border-color: var(--accent);
}

/* 카테고리 탭 */
.cat-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}
.cat-tabs__tab {
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  background: var(--surface-card);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.cat-tabs__tab:hover { border-color: var(--accent); color: var(--accent); }
.cat-tabs__tab[aria-selected='true'] {
  background: var(--surface-inverse);
  color: var(--text-on-inverse);
  border-color: var(--surface-inverse);
}

/* 재료 그리드 */
.ing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-2);
}
.ing-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  color: var(--text-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
}
.ing-chip svg { color: var(--text-muted); flex-shrink: 0; }
.ing-chip:hover { border-color: var(--accent); }
.ing-chip.is-picked {
  border-color: var(--accent);
  background: var(--accent-subtle);
  color: var(--accent-text);
}
.ing-chip.is-picked svg { color: var(--accent); }
.ing-grid__empty { padding: var(--space-6) 0; }

/* ----- 우: 내 냉장고 ----- */
.freg__cart {
  position: sticky;
  top: calc(var(--header-height) + var(--space-4));
}
.fridge-box {
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  background: var(--surface-card);
  overflow: hidden;
}
.fridge-box__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-4);
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--border);
  font-weight: var(--weight-bold);
}
.fridge-box__count {
  margin-left: auto;
  min-width: 24px;
  height: 24px;
  padding: 0 var(--space-2);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--accent);
  color: var(--text-on-accent);
  border-radius: var(--radius-pill);
  font-size: var(--text-xs);
}
.fridge-box__body {
  padding: var(--space-4);
  max-height: 440px;
  overflow-y: auto;
}
.fridge-box__empty {
  font-size: var(--text-sm);
  text-align: center;
  padding: var(--space-6) 0;
  line-height: var(--leading-normal);
}
.fridge-box__group { margin-bottom: var(--space-4); }
.fridge-box__group:last-child { margin-bottom: 0; }
.fridge-box__cat {
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
  color: var(--text-muted);
  margin-bottom: var(--space-2);
}
.picked-list { display: flex; flex-direction: column; gap: var(--space-1); }
.picked-list__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-3);
  background: var(--surface-sunken);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
}
.picked-list__remove {
  display: flex;
  border: none;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
}
.picked-list__remove:hover { color: var(--danger); }

.fridge-box__save {
  margin: var(--space-4);
  width: calc(100% - var(--space-4) * 2);
}

@media (max-width: 900px) {
  .freg__layout { grid-template-columns: 1fr; }
  .freg__cart { position: static; }
}
</style>