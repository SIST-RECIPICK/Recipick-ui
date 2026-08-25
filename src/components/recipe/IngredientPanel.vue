<template>
  <div class="ing-panel">
    <!-- 액션 (좋아요 / 북마크) -->
    <div class="ing-panel__actions">
      <button
        class="ing-panel__action"
        :class="{ 'is-active': liked }"
        :aria-pressed="liked"
        @click="liked = !liked"
      >
        <component :is="liked ? IconHeartFilled : IconHeart" :size="18" />
        좋아요
      </button>
      <button
        class="ing-panel__action"
        :class="{ 'is-active': bookmarked }"
        :aria-pressed="bookmarked"
        @click="bookmarked = !bookmarked"
      >
        <component :is="bookmarked ? IconBookmarkFilled : IconBookmark" :size="18" />
        북마크
      </button>
    </div>

    <!-- 재료 정보 -->
    <section class="ing-panel__section">
      <div class="ing-panel__head">
        <h3 class="ing-panel__title">재료 정보</h3>
        <div class="stepper" role="group" aria-label="인분 조절">
          <button class="stepper__btn" aria-label="인분 줄이기" @click="dec">
            <IconMinus :size="16" />
          </button>
          <span class="stepper__value">{{ servings }}인분</span>
          <button class="stepper__btn" aria-label="인분 늘리기" @click="inc">
            <IconPlus :size="16" />
          </button>
        </div>
      </div>

      <!-- 단위 탭 -->
      <div class="unit-tabs" role="tablist" aria-label="단위 선택">
        <button
          v-for="u in units"
          :key="u.key"
          class="unit-tabs__tab"
          role="tab"
          :aria-selected="unit === u.key"
          @click="unit = u.key"
        >
          {{ u.label }}
        </button>
      </div>

      <!-- 재료 리스트 (많아지면 이 영역만 스크롤) -->
      <ul class="ing-list">
        <li v-for="(item, i) in scaledIngredients" :key="i" class="ing-list__row">
          <span class="ing-list__name">{{ item.name }}</span>
          <span class="ing-list__amount text-secondary">{{ item.display }}</span>
        </li>
      </ul>
    </section>

    <!-- 요리 정보 -->
    <section class="ing-panel__section">
      <h3 class="ing-panel__title">요리 정보</h3>
      <div class="ing-panel__chips">
        <span class="chip">{{ cooking.type }}</span>
        <span class="chip">{{ cooking.method }}</span>
      </div>
    </section>

    <!-- 영양 정보 -->
    <section class="ing-panel__section">
      <h3 class="ing-panel__title">영양 정보</h3>
      <div class="nutri-grid">
        <div v-for="n in nutrition" :key="n.label" class="nutri-grid__cell">
          <strong class="nutri-grid__value">{{ n.value }}</strong>
          <span class="nutri-grid__label text-secondary">{{ n.label }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  IconHeart, IconHeartFilled,
  IconBookmark, IconBookmarkFilled,
  IconMinus, IconPlus,
} from '@tabler/icons-vue'

const props = defineProps({
  // [{ name, amount(number, 1인분 기준 g), }]
  ingredients: { type: Array, required: true },
  cooking: { type: Object, required: true },     // { type, method }
  nutrition: { type: Array, required: true },     // [{ value, label }]
  baseServings: { type: Number, default: 1 },
})

const liked = ref(false)
const bookmarked = ref(false)
const servings = ref(props.baseServings)
const unit = ref('g')

const units = [
  { key: 'g', label: '그램(g)' },
  { key: 'spoon', label: '숟가락' },
  { key: 'cup', label: '컵' },
]

function inc() { servings.value += 1 }
function dec() { if (servings.value > 1) servings.value -= 1 }

// 인분·단위 반영해 표시값 계산
const scaledIngredients = computed(() =>
  props.ingredients.map((item) => {
    const grams = item.amount * (servings.value / props.baseServings)
    let display
    if (unit.value === 'spoon') display = `${(grams / 15).toFixed(1)}스푼`
    else if (unit.value === 'cup') display = `${(grams / 240).toFixed(1)}컵`
    else display = `${Math.round(grams)}g`
    return { name: item.name, display }
  })
)
</script>

<style scoped>
.ing-panel {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  background: var(--surface-card);
}

/* 액션 */
.ing-panel__actions {
  display: flex;
  gap: var(--space-2);
}
.ing-panel__action {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--text-sm);
  transition: border-color var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.ing-panel__action:hover { border-color: var(--accent); color: var(--accent); }
.ing-panel__action.is-active { border-color: var(--accent); color: var(--accent); }

/* 섹션 공통 */
.ing-panel__section {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.ing-panel__title {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
}
.ing-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 인분 조절 */
.stepper {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-pill);
  padding: var(--space-1);
}
.stepper__btn {
  display: flex;
  width: 28px; height: 28px;
  align-items: center;
  justify-content: center;
  border: none;
  background: transparent;
  border-radius: 50%;
  color: var(--text-secondary);
}
.stepper__btn:hover { background: var(--surface-sunken); color: var(--text-primary); }
.stepper__value {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  min-width: 44px;
  text-align: center;
}

/* 단위 탭 */
.unit-tabs {
  display: flex;
  gap: var(--space-2);
}
.unit-tabs__tab {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-sm);
  border: none;
  font-size: var(--text-xs);
  background: var(--surface-sunken);
  color: var(--text-secondary);
  transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.unit-tabs__tab[aria-selected='true'] {
  background: var(--surface-inverse);
  color: var(--text-on-inverse);
}

/* 재료 리스트 — 여기만 내부 스크롤 (①번 결정) */
.ing-list {
  max-height: 260px;
  overflow-y: auto;
  scrollbar-width: thin;
  /* 스크롤바를 패널 여백 쪽으로 밀어 200g 텍스트와 겹치지 않게.
     스크롤이 없을 때도 다른 섹션과 오른쪽 정렬이 어긋나지 않음. */
  margin-right: calc(var(--space-3) * -1);
  padding-right: var(--space-3);
}
.ing-list__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) 0;
  border-bottom: 1px solid var(--border);
  font-size: var(--text-sm);
}
.ing-list__row:last-child { border-bottom: none; }
.ing-list__amount { flex-shrink: 0; }

/* 요리 정보 칩 */
.ing-panel__chips {
  display: flex;
  gap: var(--space-2);
}

/* 영양 정보 그리드 */
.nutri-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-2);
}
.nutri-grid__cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-3) var(--space-2);
  background: var(--surface-sunken);
  border-radius: var(--radius-md);
}
.nutri-grid__value {
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
}
.nutri-grid__label { font-size: var(--text-xs); }
</style>