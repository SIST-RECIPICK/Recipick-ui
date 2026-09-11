<template>
  <RouterLink :to="`/recipes/${recipe.rcp_seq}`" class="recipe-card-link">
    <article class="card card--hoverable recipe-card">
      <div class="recipe-card__image-wrap">
        <img
          class="recipe-card__image"
          :src="recipe.att_file_no_main"
          :alt="`${recipe.rcp_nm} 대표 이미지`"
          loading="lazy"
        />
      </div>
      <div class="card__body">
        <span class="chip chip--accent recipe-card__category">{{ recipe.rcp_pat2 }}</span>
        <h3 class="recipe-card__title">{{ recipe.rcp_nm }}</h3>
      </div>
    </article>
  </RouterLink>
</template>

<script setup>

defineProps({
  recipe: { type: Object, required: true },
})


</script>

<style scoped>
.recipe-card-link {
  display: block;
  color: inherit;
  height: 100%;   /* 추가: 그리드가 늘려준 높이를 그대로 받음 */
}

.recipe-card.card--hoverable:hover {
  box-shadow: none;
  transform: none;
  border-color: var(--border-strong);
}
.recipe-card.card--hoverable {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.recipe-card__image-wrap {
  position: relative;
}

.recipe-card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: var(--surface-sunken);
  transition: transform 0.4s var(--ease);
}
.recipe-card:hover .recipe-card__image {
  transform: scale(1.06);
}

.card__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* 키테고리 배지는 길이 늘어나지 않게 방지 */
}

.recipe-card__category {
  display: inline-block;
  margin-bottom: var(--space-2);
}

.recipe-card__title {
  margin-bottom: var(--space-1);
  transition: color var(--dur-base) var(--ease);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 162px;
  line-height: 1.4;
  min-height: calc(1.4em);
}
.recipe-card:hover .recipe-card__title {
  color: var(--accent);
}
.recipe-card__meta {
  font-size: var(--text-sm);
  margin-bottom: var(--space-3);
}

</style>