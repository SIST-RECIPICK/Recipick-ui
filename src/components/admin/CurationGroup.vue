<template>
  <div class="cgroup">
    <h3 class="cgroup__title"># {{ ingredient }}</h3>
    <div class="cgroup__grid">
      <article v-for="recipe in recipes" :key="recipe.rcp_seq" class="crecipe" @click="goRecipe(recipe.rcp_seq)">
        <div class="crecipe__thumb">
          <img
            v-if="recipe.att_file_no_main"
            :src="recipe.att_file_no_main"
            :alt="`${recipe.rcp_nm} 이미지`"
            loading="lazy"
          />
          <span v-else class="crecipe__placeholder" aria-hidden="true">이미지</span>
        </div>
        <div class="crecipe__body">
          <h4 class="crecipe__name">{{ recipe.rcp_nm }}</h4>
          <p class="crecipe__views text-secondary">조회 {{ formatViews(recipe.hit) }}</p>
        </div>
      </article>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

defineProps({
  ingredient: { type: String, required: true },
  recipes: { type: Array, required: true },
})

function formatViews(n) {
  return typeof n === 'number' ? n.toLocaleString('ko-KR') : n
}

function goRecipe(id){
  router.push(`/recipes/${id}`)
}
</script>

<style scoped>
.cgroup {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.cgroup__title {
  padding: var(--space-3) var(--space-4);
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--border);
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
}
.cgroup__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  padding: var(--space-4);
}

/* 개별 레시피 카드 */
.crecipe {
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  overflow: hidden;
}
.crecipe__thumb {
  aspect-ratio: 16 / 10;
  background: var(--surface-sunken);
  display: flex;
  align-items: center;
  justify-content: center;
}
.crecipe__thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.crecipe__placeholder {
  color: var(--text-muted);
  font-size: var(--text-sm);
}
.crecipe__body {
  padding: var(--space-3);
}
.crecipe__name {
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-1);
}
.crecipe__views {
  font-size: var(--text-sm);
}

@media (max-width: 640px) {
  .cgroup__grid {
    grid-template-columns: 1fr;
  }
}
</style>
