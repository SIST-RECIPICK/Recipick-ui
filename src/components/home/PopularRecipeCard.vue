<template>
  <RouterLink :to="`/recipes/${recipe.id}`" class="pop-card-link">
    <article class="card card--hoverable pop-card">
      <div class="pop-card__media">
        <img
          class="pop-card__image"
          :src="recipe.image"
          :alt="`${recipe.title} 대표 이미지`"
          loading="lazy"
        />
        <button
          class="pop-card__like"
          :class="{ 'is-active': liked }"
          type="button"
          :aria-pressed="liked"
          :aria-label="liked ? '찜 해제' : '찜하기'"
          @click.stop.prevent="liked = !liked"
        >
          <IconHeartFilled v-if="liked" :size="16" />
          <IconHeart v-else :size="16" />
        </button>
      </div>
      <div class="card__body">
        <p class="pop-card__rating">
          <IconStarFilled :size="14" class="pop-card__star" />
          {{ recipe.rating.toFixed(1) }}
          <span class="text-muted">({{ recipe.reviews }})</span>
        </p>
        <h3 class="pop-card__title">{{ recipe.title }}</h3>
        <div class="pop-card__meta">
          <span class="pop-card__time"><IconClock :size="14" /> {{ recipe.cookTime }}</span>
          <span class="chip chip--accent">{{ recipe.category }}</span>
        </div>
      </div>
    </article>
  </RouterLink>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { IconHeart, IconHeartFilled, IconStarFilled, IconClock } from '@tabler/icons-vue'

defineProps({
  recipe: { type: Object, required: true },
  // { id, title, image, rating, reviews, cookTime, category }
})

const liked = ref(false)
</script>

<style scoped>
.pop-card-link { display: block; color: inherit; }

.pop-card.card--hoverable:hover {
  box-shadow: none;
  transform: none;
  border-color: var(--border-strong);
}

.pop-card__media { position: relative; }
.pop-card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  background: var(--surface-sunken);
  transition: transform 0.4s var(--ease);
}
.pop-card:hover .pop-card__image { transform: scale(1.06); }

.pop-card__like {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  border-radius: 50%;
  background: rgba(28, 27, 26, 0.45);
  backdrop-filter: blur(4px);
  color: #fff;
  transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
}
.pop-card__like:hover { background: rgba(28, 27, 26, 0.65); }
.pop-card__like.is-active { background: rgba(255, 255, 255, 0.92); color: var(--accent); }

.pop-card__rating {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  margin-bottom: var(--space-1);
}
.pop-card__star { color: var(--amber-500); }

.pop-card__title {
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  margin-bottom: var(--space-3);
  transition: color var(--dur-base) var(--ease);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pop-card:hover .pop-card__title { color: var(--accent); }

.pop-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}
.pop-card__time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--text-xs);
  color: var(--text-muted);
}
</style>
