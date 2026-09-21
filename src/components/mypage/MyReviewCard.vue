<template>
  <article class="card my-review-card">
    <div class="card__body">

      <!-- 왼쪽 : 후기 사진 (클릭 시 이동) -->
      <div
        class="my-review-card__image clickable"
        @click="goToReview"
      >
        <img
          v-if="review.image_url"
          :src="review.image_url"
          alt="후기 이미지"
        />
        <img
          v-else-if="review.att_file_no_main"
          :src="review.att_file_no_main"
          :alt="review.rcp_nm"
        />
        <span v-else>사진 없음</span>
      </div>

      <!-- 오른쪽 -->
      <div class="my-review-card__content">

        <!-- 리뷰 제목 (클릭 시 이동) + 삭제 버튼 -->
        <div class="my-review-card__title-row">
          <h3>
            <span
              class="my-review-card__title-link clickable"
              @click="goToReview"
            >
              {{ review.subject }}
            </span>
          </h3>

          <button
            type="button"
            class="btn btn--primary"
            @click="$emit('delete', review.id)"
          >
            삭제
          </button>
        </div>

        <!-- 후기 내용 -->
        <p class="my-review-card__text">
          {{ review.content }}
        </p>

        <!-- 하단 정보 -->
        <div class="my-review-card__bottom">

          <!-- 레시피 정보 -->
          <div class="my-review-card__recipe">
            <h3>{{ review.rcp_nm }}</h3>

            <p class="my-review-card__recipe-author">
              {{ review.chef_nickname || '작성자 정보 없음' }}
            </p>
          </div>

          <!-- 후기 작성일 -->
          <div class="my-review-card__date">
            <span>후기작성일</span>
            <span>{{ formatDate(review.created_at) }}</span>
          </div>

        </div>

      </div>

    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  review: {
    type: Object,
    required: true,
  },
})

defineEmits(['delete'])

const router = useRouter()

const goToReview = () => {
  if (props.review?.id) {
    router.push(`/community/reviews/${props.review.id}`)
  }
}

const formatDate = (date) => {
  if (!date) return ''

  return String(date).slice(0, 10)
}
</script>

<style scoped>
.my-review-card {
  width: 100%;
}

.my-review-card .card__body {
  display: grid;
  grid-template-columns: 3fr 7fr;
  gap: var(--space-5);
}

/* 사진 */
.my-review-card__image {
  min-height: 220px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--surface-sunken);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);

  color: var(--text-secondary);
  overflow: hidden;
}

.my-review-card__image img {
  width: 100%;
  height: 100%;
  min-height: 220px;
  object-fit: cover;
  transition: transform 0.2s ease;
}

/* 이미지 호버 시 살짝 확대 효과 */
.my-review-card__image:hover img {
  transform: scale(1.03);
}

/* 오른쪽 리뷰 영역 */
.my-review-card__content {
  min-width: 0;

  display: flex;
  flex-direction: column;
}

/* 리뷰 제목 + 삭제 버튼 */
.my-review-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

/* 제목 링크 스타일 */
.my-review-card__title-link {
  color: inherit;
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  text-decoration: underline;
}

/* 후기 내용 */
.my-review-card__text {
  margin: var(--space-3) 0 0;

  color: var(--text-secondary);

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 하단 정보 */
.my-review-card__bottom {
  margin-top: auto;
  padding-top: var(--space-3);

  border-top: 1px solid var(--border);

  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: var(--space-4);
}

/* 레시피 작성자 */
.my-review-card__recipe-author {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

/* 후기 작성일 */
.my-review-card__date {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  text-align: right;
}

.my-review-card__date span {
  display: block;
}

.my-review-card__date span:last-child {
  margin-top: var(--space-1);
}
</style>