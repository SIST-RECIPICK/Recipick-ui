<template>
  <article class="card card--hoverable recipe-card">
    <img
      class="recipe-card__image"
      :src="recipe.image"
      :alt="`${recipe.title} 대표 이미지`"
      loading="lazy"
    />
    <div class="card__body">
      <h3 class="recipe-card__title">{{ recipe.title }}</h3>
      <p class="recipe-card__meta text-secondary">
        {{ recipe.chef }} · 조회 {{ recipe.views }}
      </p>
      <div class="recipe-card__tags">
        <span class="chip">{{ recipe.cookTime }}</span>
        <span class="chip chip--accent">{{ recipe.category }}</span>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  recipe: { type: Object, required: true },
  // { id, title, chef, image, views, cookTime, category }
})
</script>

<style scoped>
.recipe-card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: var(--surface-sunken);
}
.recipe-card__title {
  margin-bottom: var(--space-1);
}
.recipe-card__meta {
  font-size: var(--text-sm);
  margin-bottom: var(--space-3);
}
.recipe-card__tags {
  display: flex;
  gap: var(--space-2);
}
</style>
