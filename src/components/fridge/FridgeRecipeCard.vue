<template>
  <RouterLink :to="`/recipes/${recipe.id}`" class="fr-card card card--hoverable">
    <!-- 대표 이미지 -->
    <div class="fr-card__thumb">
      <img
        v-if="recipe.image"
        :src="recipe.image"
        :alt="`${recipe.title} 대표 이미지`"
        loading="lazy"
      />
      <span v-else class="fr-card__placeholder" aria-hidden="true">레시피 대표이미지</span>
    </div>

    <!-- 본문 -->
    <div class="fr-card__body">
      <h3 class="fr-card__title">{{ recipe.title }}</h3>
      <p class="fr-card__chef text-secondary">
        <span class="fr-card__badge">오늘의<br />레시피</span>
        {{ recipe.chef }}
      </p>

      <!-- 재료 태그: 보유(진하게) / 미보유(연하게), 최대 6개 -->
      <ul class="fr-card__tags">
        <li
          v-for="(ing, i) in visibleTags"
          :key="i"
          class="fr-tag"
          :class="ing.have ? 'fr-tag--have' : 'fr-tag--miss'"
        >
          {{ ing.name }}
        </li>
        <li v-if="hiddenCount > 0" class="fr-tag fr-tag--more">
          +{{ hiddenCount }}
        </li>
      </ul>
    </div>

    <!-- 매칭 도넛 (서버가 계산한 matchCount/totalCount 사용) -->
    <MatchDonut :have="recipe.matchCount" :total="recipe.totalCount" />

    <!-- 화살표 -->
    <IconChevronRight :size="24" class="fr-card__arrow" />
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { IconChevronRight } from '@tabler/icons-vue'
import MatchDonut from '@/components/fridge/MatchDonut.vue'

const props = defineProps({
  recipe: { type: Object, required: true },
  // FridgeMatchRecipe: { id, title, chef, image, matchCount, totalCount, ingredients: [{ ingredientId, name, have }] }
})

const MAX_TAGS = 6

// 보유 재료를 앞으로 정렬한 뒤 최대 6개만 노출
const sortedIngredients = computed(() =>
  [...props.recipe.ingredients].sort((a, b) => Number(b.have) - Number(a.have))
)
const visibleTags = computed(() => sortedIngredients.value.slice(0, MAX_TAGS))
const hiddenCount = computed(() =>
  Math.max(0, props.recipe.totalCount - MAX_TAGS)
)
</script>

<style scoped>
.fr-card {
  display: grid;
  grid-template-columns: 140px 1fr auto auto;
  gap: var(--space-4);
  align-items: center;
  padding: var(--space-4);
  color: inherit;
}

/* 이미지 */
.fr-card__thumb {
  width: 140px;
  height: 100px;
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.fr-card__thumb img { width: 100%; height: 100%; object-fit: cover; }
.fr-card__placeholder { color: var(--text-muted); font-size: var(--text-sm); }

/* 본문 */
.fr-card__body { min-width: 0; }
.fr-card__title {
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-1);
}
.fr-card__chef {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-sm);
  margin-bottom: var(--space-2);
}
.fr-card__badge {
  font-size: 10px;
  line-height: 1.1;
  text-align: center;
  padding: 2px 4px;
  border-radius: var(--radius-sm);
  background: var(--surface-sunken);
  color: var(--text-muted);
}

/* 재료 태그 */
.fr-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
.fr-tag {
  font-size: var(--text-xs);
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
}
.fr-tag--have {
  background: var(--accent-subtle);
  color: var(--accent-text);
}
.fr-tag--miss {
  background: var(--surface-sunken);
  color: var(--text-muted);
}
.fr-tag--more {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border);
}

.fr-card__arrow { color: var(--text-muted); }

@media (max-width: 640px) {
  .fr-card {
    grid-template-columns: 96px 1fr auto;
  }
  .fr-card__thumb { width: 96px; height: 72px; }
  .fr-card__arrow { display: none; }
}
</style>
