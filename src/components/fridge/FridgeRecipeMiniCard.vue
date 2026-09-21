<template>
  <RouterLink :to="`/recipes/${recipe.recipeId}`" class="mini-card">
    <div class="mini-card__thumb">
      <img v-if="recipe.image" :src="recipe.image" :alt="`${recipe.title} 대표 이미지`" loading="lazy" />
      <span v-else class="mini-card__placeholder" aria-hidden="true">🍳</span>
    </div>

    <div class="mini-card__body">
      <p class="mini-card__title">{{ recipe.title }}</p>
      <ul class="mini-card__tags">
        <li
          v-for="(ing, i) in visibleTags"
          :key="i"
          class="mini-tag"
          :class="ing.have ? 'mini-tag--have' : 'mini-tag--miss'"
        >
          {{ ing.name }}
        </li>
        <li v-if="hiddenCount > 0" class="mini-tag mini-tag--more">+{{ hiddenCount }}</li>
      </ul>
    </div>

    <MatchDonut :have="recipe.matchCount" :total="recipe.totalCount" :size="44" :stroke="4" />
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import MatchDonut from '@/components/fridge/MatchDonut.vue'

const props = defineProps({
  recipe: { type: Object, required: true },
  // FridgeMatchRecipe: { recipeId, title, image, matchCount, totalCount, ingredients: [{ name, have }] }
})

const MAX_TAGS = 4

const sortedIngredients = computed(() =>
  [...props.recipe.ingredients].sort((a, b) => Number(b.have) - Number(a.have))
)
const visibleTags = computed(() => sortedIngredients.value.slice(0, MAX_TAGS))
const hiddenCount = computed(() =>
  Math.max(0, props.recipe.totalCount - MAX_TAGS)
)
</script>

<style scoped>
.mini-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  color: inherit;
}

.mini-card__thumb {
  flex-shrink: 0;
  width: 52px;
  height: 52px;
  border-radius: 8px;
  background: var(--surface-sunken);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}
.mini-card__thumb img { width: 100%; height: 100%; object-fit: cover; }
.mini-card__placeholder { font-size: 20px; }

.mini-card__body { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 5px; }
.mini-card__title {
  font-size: 12.5px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mini-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}
.mini-tag {
  font-size: 10px;
  padding: 1px 6px;
  border-radius: var(--radius-pill);
}
.mini-tag--have { background: var(--accent-subtle); color: var(--accent-text); }
.mini-tag--miss { background: var(--surface-sunken); color: var(--text-muted); border: 1px solid var(--border); }
.mini-tag--more { background: transparent; color: var(--text-muted); }

.mini-card :deep(.donut) { flex-shrink: 0; }
.mini-card :deep(.donut__label) { font-size: 10px; }
</style>
