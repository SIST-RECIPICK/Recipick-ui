<template>
  <div class="other-card" @click="$emit('click')">
    <div class="other-card__img-box">
      <img
        :src="review.image_url"
        :alt="review.subject"
        class="other-card__img"
      />
    </div>

    <div class="other-card__info">
      <h4 class="other-card__title">{{ review.subject }}</h4>

      <span class="other-card__date text-secondary">
        {{ formatDate(review.created_at) }}
      </span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  review: {
    type: Object,
    required: true,
  }
})

defineEmits(['click'])

const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
</script>

<style scoped>
.other-card {
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--surface-card);
  cursor: pointer;
  transition: transform var(--dur-fast) var(--ease);
}

.other-card:hover {
  transform: translateY(-2px);
}

.other-card__img-box {
  width: 100%;
  height: 140px;
  background: var(--surface-sunken);
}

.other-card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.other-card__info {
  padding: var(--space-3);
}

.other-card__title {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  margin-bottom: var(--space-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.other-card__date {
  font-size: var(--text-xs);
}
</style>
