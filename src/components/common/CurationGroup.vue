<template>
  <section class="cgroup">
    <div class="cgroup__head">
      <h3 class="cgroup__title">
        <component :is="ingIcon(ingredient)" :size="18" :stroke="1.75" />
        {{ ingredient }}
      </h3>
      <span class="cgroup__count">{{ recipes.length }}개</span>
    </div>

    <div class="cgroup__grid">
      <article
        v-for="recipe in recipes"
        :key="recipe.rcp_seq"
        class="crecipe"
        @click="goRecipe(recipe.rcp_seq)"
      >
        <div class="crecipe__thumb">
          <img
            v-if="recipe.att_file_no_main"
            :src="recipe.att_file_no_main"
            :alt="`${recipe.rcp_nm} 이미지`"
            loading="lazy"
          />
          <span v-else class="crecipe__placeholder" aria-hidden="true">이미지 준비 중</span>
        </div>
        <div class="crecipe__body">
          <h4 class="crecipe__name">{{ recipe.rcp_nm }}</h4>
          <p class="crecipe__views">조회 {{ formatViews(recipe.hit) }}</p>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ingIcon } from '@/utils/ingredientIcon'

const router = useRouter()
defineProps({
  ingredient: { type: String, required: true },
  recipes: { type: Array, required: true },
})
function formatViews(n) {
  return typeof n === 'number' ? n.toLocaleString('ko-KR') : n
}
function goRecipe(id) {
  router.push(`/recipes/${id}`)
}
</script>

<style scoped>
.cgroup { min-width: 0; scroll-margin-top: var(--space-5); }

.cgroup__head {
  display: flex;
  align-items: baseline;
  gap: var(--space-2);
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-3);
  border-bottom: 1px solid var(--border-strong);
}
.cgroup__title {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--text-base);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
}
.cgroup__count {
  font-size: var(--text-xs);
  color: var(--text-muted);
}

/* 카드 그리드: 간격 좁혀 밀도 ↑ */
.cgroup__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-3);
}

.crecipe {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  cursor: pointer;
  background: var(--surface-card);
  transition: border-color var(--dur-fast) var(--ease);
}
.crecipe:hover { border-color: var(--accent); }

.crecipe__thumb {
  height: 190px;
  background: var(--surface-sunken);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.crecipe__thumb img { width: 100%; height: 100%; object-fit: cover; }
.crecipe__placeholder { color: var(--text-muted); font-size: var(--text-sm); }

/* 본문 컴팩트 */
.crecipe__body {
  padding: var(--space-2) var(--space-3) var(--space-3);
}
.crecipe__name {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
  margin-bottom: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.crecipe:hover .crecipe__name { color: var(--accent); }
.crecipe__views {
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

@media (max-width: 640px) {
  .cgroup__grid { grid-template-columns: repeat(2, 1fr); }
}
</style>