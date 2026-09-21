<template>
  <article class="review-card" @click="goToDetail">
    <img
      class="review-card__thumb"
      :src="review.image"
      :alt="`${review.title} 후기 이미지`"
      loading="lazy"
    />
    <div class="review-card__body">
      <h4 class="review-card__title">{{ review.title }}</h4>
      <p class="review-card__text text-secondary">{{ review.content }}</p>
    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter()
const props =defineProps({
  review: { type: Object, required: true },
  // { id, title, content, image }
})

const goToDetail = () => {
  router.push(`/community/reviews/${props.review.id}`)
}
</script>

<style scoped>
.review-card {
  display: flex;
  gap: var(--space-4);
  align-items: flex-start;
}
.review-card__thumb {
  width: 88px;
  height: 88px;
  flex-shrink: 0;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
}
.review-card__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}
.review-card__title {
  font-weight: var(--weight-bold);
}
.review-card__text {
  font-size: var(--text-sm);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.review-card:hover{
  cursor: pointer;
}
</style>
