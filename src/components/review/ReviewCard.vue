<template>
  <article class="card card--hoverable review-card">
    <img
      :src="review.image"
      :alt="review.title"
      class="review-card__image"
    />

    <div class="card__body">
      <h3 class="review-card__title">
        {{ review.title }}
      </h3>

      <p class="review-card__writer">
        {{ review.writer }}
      </p>

      <div class="review-card__recipe">
        <img
          :src="review.recipeImage"
          :alt="review.recipeTitle"
          class="review-card__recipe-image"
        />

        <p>
          {{ review.recipeTitle }}
        </p>
      </div>
    </div>
  </article>
</template>

<script setup>
defineProps({
  review: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.review-card {
  cursor: pointer;
}

.review-card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: var(--surface-sunken);
}

.review-card__title {
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.review-card__writer {
  margin: var(--space-2) 0 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.review-card__recipe {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-3);
  padding-top: var(--space-3);
  border-top: 1px solid var(--border);
}

.review-card__recipe-image {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
}

.review-card__recipe p {
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>