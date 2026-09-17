<template>
  <article class="card my-reply-card">
    <div class="card__body">

      <!-- 체크박스 -->
      <div class="my-reply-card__check">
        <input
          type="checkbox"
          :id="`reply-${reply.id}`"
          :checked="selected"
          @change="$emit('toggle', reply.id)"
        />
      </div>

      <!-- 댓글 내용 -->
      <div class="my-reply-card__content">

        <!-- 원본 글 제목 -->
        <p class="my-reply-card__original clickable" @click="goToReview">
          {{ reply.rev_subject }}
        </p>

        <!-- 댓글 + 날짜 -->
        <div class="my-reply-card__text-row">

          <p class="clickable" @click="goToReview">
            {{ reply.content }}
          </p>

          <span class="my-reply-card__date">
            {{ formatDate(reply.created_at) }}
          </span>

        </div>

      </div>

    </div>
  </article>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  reply: {
    type: Object,
    required: true,
  },
  selected: {
    type: Boolean,
    required: true,
  },
})

defineEmits(['toggle'])

const router = useRouter()

const goToReview = () => {
  if (props.reply?.review_board_id) {
    router.push(`/community/reviews/${props.reply.review_board_id}`)
  }
}

const formatDate = (date) => {
  if (!date) return ''

  return new Date(date).toLocaleDateString('ko-KR')
}
</script>

<style scoped>
.my-reply-card .card__body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-4);
}

.my-reply-card__check {
  display: flex;
  align-items: flex-start;
  padding-top: var(--space-1);
}

.my-reply-card__check input {
  width: 18px;
  height: 18px;
  accent-color: var(--accent);
  cursor: pointer;
}

.my-reply-card__original {
  margin: 0 0 var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

.my-reply-card__content {
  min-width: 0;
}

.my-reply-card__text-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
}

.my-reply-card__text-row p {
  margin: 0;
}

.my-reply-card__date {
  flex-shrink: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.clickable {
  cursor: pointer;
}

.clickable:hover {
  text-decoration: underline;
}
</style>