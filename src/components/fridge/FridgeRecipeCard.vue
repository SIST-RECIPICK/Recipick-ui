<template>
  <div class="ai-card card">
    <RouterLink :to="`/recipes/${recipe.recipeId}`" class="ai-card__head">
      <span class="ai-card__icon">🍜</span>
      <h3 class="ai-card__title">{{ recipe.title }}</h3>
      <IconChevronRight :size="18" class="ai-card__arrow" />
    </RouterLink>

    <div class="ai-card__top">
      <div class="ai-card__badges">
        <span class="badge badge--similarity">AI 유사도 {{ recipe.similarity }}%</span>
        <span class="badge badge--rate">재료 충족률 {{ matchRatePercent }}%</span>
      </div>
      <div class="ai-card__image">
        <img v-if="recipe.image" :src="recipe.image" :alt="recipe.title" loading="lazy" />
        <span v-else class="ai-card__placeholder">대표 이미지</span>
      </div>
    </div>

    <div class="ai-card__ingredients">
      <div class="ing-box ing-box--have">
        <p class="ing-box__title">가지고 있는 재료</p>
        <ul class="ing-box__list">
          <li v-for="ing in haveIngredients" :key="ing.name" class="ing-chip ing-chip--have">
            {{ ing.name }}
          </li>
        </ul>
      </div>
      <div class="ing-box ing-box--miss">
        <p class="ing-box__title">부족한 재료</p>
        <ul class="ing-box__list">
          <li v-for="ing in missIngredients" :key="ing.name" class="ing-chip ing-chip--miss">
            {{ ing.name }}
          </li>
        </ul>
      </div>
    </div>

    <div class="ai-card__final">
      <!-- <h4 class="ai-card__final-title">최종 레시피</h4>
      <div class="ai-card__final-body">
        <div class="final-ingredients">
          <p class="final-label">재료</p>
          <ul>
            <li v-for="ing in recipe.ingredients" :key="ing.name">
              {{ ing.name }}<span v-if="!ing.have" class="miss-label"> (부족)</span>
            </li>
          </ul>
        </div>
        <div class="final-steps">
          <p class="final-label">조리 방법</p>
          <RouterLink :to="`/recipes/${recipe.recipeId}`" class="step-link">
            레시피 상세 화면에서 조리 방법을 확인해주세요.
          </RouterLink>
        </div>
      </div> -->
      <div v-if="recipe.tip" class="ai-tip">
        <strong>AI 추천 TIP</strong>
        <p>{{ recipe.tip }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { IconChevronRight } from '@tabler/icons-vue'

const props = defineProps({
  recipe: { type: Object, required: true },
})

const haveIngredients = computed(() => props.recipe.ingredients.filter((i) => i.have))
const missIngredients = computed(() => props.recipe.ingredients.filter((i) => !i.have))

const matchRatePercent = computed(() => {
  if (!props.recipe.totalCount) return 0
  return Math.round((props.recipe.matchCount / props.recipe.totalCount) * 100)
})
</script>

<style scoped>
.ai-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  background: var(--surface-card);
  padding: var(--space-3);
  margin-bottom: var(--space-3);
  height: 100%;              /* 추가 — grid가 준 전체 높이를 채움 */
  display: flex;             /* 추가 — 세로 배치를 위한 flex 컨테이너로 */
  flex-direction: column;    /* 추가 — 자식 요소들을 세로로 쌓음 */
}

.ai-card__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-2);          /* space-4 → space-2 */
  color: inherit;
}
.ai-card__icon { font-size: 1.1rem; }      /* 1.4rem → 1.1rem */
.ai-card__title { font-size: var(--text-sm); font-weight: var(--weight-bold); flex: 1; }  /* lg → sm */
.ai-card__arrow { color: var(--text-muted); }

.ai-card__top {
  display: grid;
  grid-template-columns: 1fr 140px;       /* 240px → 140px */
  gap: var(--space-2);                     /* space-4 → space-2 */
  align-items: start;
  margin-bottom: var(--space-2);          /* space-4 → space-2 */
}
.ai-card__badges { display: flex; flex-direction: column; gap: 4px; align-items: flex-start; }
.badge {
  padding: 1px var(--space-2);            /* 살짝 줄임 */
  border-radius: var(--radius-pill);
  font-weight: var(--weight-bold);
  font-size: 10px;                          /* xs보다 더 작게 */
}
.badge--similarity { background: var(--accent-subtle); color: var(--accent-text); }
.badge--rate { background: var(--surface-sunken); color: var(--text-secondary); }

.ai-card__image {
  width: 140px; height: 90px;              /* 240x140 → 140x90 */
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--surface-sunken);
  display: flex; align-items: center; justify-content: center;
}
.ai-card__image img { width: 100%; height: 100%; object-fit: cover; }
.ai-card__placeholder { color: var(--text-muted); font-size: 10px; }

.ai-card__ingredients {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);                     /* space-3 → space-2 */
  margin-bottom: var(--space-2);          /* space-4 → space-2 */
}
.ing-box {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  padding: var(--space-2);                 /* space-3 → space-2 */
  background: var(--surface-sunken);
}
.ing-box__title {
  font-weight: var(--weight-bold);
  font-size: 10px;                          /* xs → 10px */
  color: var(--text-secondary);
  margin-bottom: 4px;                       /* space-2 → 4px */
}
.ing-box__list { display: flex; flex-wrap: wrap; gap: 4px; }
.ing-chip {
  font-size: 10px;                          /* xs → 10px */
  padding: 1px var(--space-2);
  border-radius: var(--radius-pill);
  background: var(--surface-card);
  border: 1px solid var(--border);
}
.ing-chip--have { color: var(--accent-text); border-color: var(--accent); }
.ing-chip--miss { color: var(--text-muted); }

.ai-card__final {
  border-top: 1px solid var(--border);
  padding-top: var(--space-2);
  margin-top: auto;   /* 이 줄 추가 — 이 블록을 카드 맨 아래로 밀착 */
}
.ai-card__final-title { font-weight: var(--weight-bold); margin-bottom: var(--space-2); font-size: 11px; }
.ai-card__final-body {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-2);                     /* space-4 → space-2 */
  margin-bottom: var(--space-2);          /* space-4 → space-2 */
}
.final-label { font-weight: var(--weight-bold); font-size: 10px; color: var(--text-secondary); margin-bottom: 4px; }
.final-ingredients ul { padding-left: var(--space-3); font-size: 11px; }   /* text-sm → 11px */
.miss-label { color: var(--text-muted); }
.step-link { color: var(--accent); font-size: 11px; text-decoration: underline; }

.ai-tip {
  background: var(--surface-sunken);
  border-radius: var(--radius-sm);
  padding: var(--space-2) var(--space-3);  /* 줄임 */
  font-size: 11px;                           /* text-sm → 11px */
  color: var(--text-secondary);
  line-height: var(--leading-normal);
}
.ai-tip strong { color: var(--text-primary); display: block; margin-bottom: 2px; font-size: 11px; }

@media (max-width: 640px) {
  .ai-card__top { grid-template-columns: 1fr; }
  .ai-card__image { width: 100%; height: 120px; }
  .ai-card__final-body { grid-template-columns: 1fr; }
}
</style>