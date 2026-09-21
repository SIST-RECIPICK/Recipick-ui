<template>
  <article class="card card--hoverable review-card">
    <!-- 상단 대표 이미지 -->
    <img
      :src="review.image_url || review.att_file_no_main"
      :alt="review.subject"
      class="review-card__image"
    />

    <div class="card__body">
      <!-- 제목 -->
      <h3 class="review-card__title">
        {{ review.subject }}
      </h3>

      <!-- 작성자 닉네임 -->
      <p class="review-card__writer">
        {{ review.writer_nickname }}
      </p>

      <!-- [신규] 조회수 & 작성일 (우측 정렬 영역) -->
      <div class="review-card__meta">
        <span class="review-card__hit">👁 {{ review.hit }}</span>
        <span class="review-card__date">{{ formatDate(review.created_at) }}</span>
      </div>

      <!-- 하단: 원본 레시피 -->
      <div class="review-card__recipe">
        <img
          :src="review.att_file_no_main || 'https://res.cloudinary.com/ekfbpizi/image/upload/v1789966269/null.png'"
          :alt="review.rcp_nm || '삭제된 레시피입니다'"
          class="review-card__recipe-image"
        />
        <p>
          {{ review.rcp_nm || '삭제된 레시피입니다' }}
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

// 날짜 포맷 함수 (2026-09-03 형태로 변환)
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.split('T')[0]
}
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

.review-card__meta {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-1);
  font-size: var(--text-xs);
  color: var(--text-secondary);
}

.review-card__hit {
  display: flex;
  align-items: center;
  gap: 2px;
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