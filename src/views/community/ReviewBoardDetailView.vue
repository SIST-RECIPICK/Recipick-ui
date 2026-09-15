```vue
<template>
  <div class="container community-page">

    <!-- 리뷰 본문 -->
    <section class="review-detail">
      <div class="review-detail__header">
        <h1>
          {{ board.subject }}
        </h1>

        <div class="review-detail__meta">
          <span>
            작성자: {{ board.writer_nickname }}
          </span>

          <span>
            조회수: {{ board.hit }}
          </span>

          <span>
            {{ board.created_at }}
          </span>
        </div>
      </div>

      <div class="review-detail__body">
        <img
          v-if="board.image_url"
          :src="board.image_url"
          alt="리뷰 이미지"
          class="review-detail__image"
        />

        <p class="review-detail__content">
          {{ board.content }}
        </p>
      </div>

      <!-- 본인 글 삭제 -->
      <div class="review-detail__actions">
        <button
          v-if="board.writer_id === currentUserId"
          type="button"
          class="btn btn--primary"
          @click="deleteReview"
        >
          리뷰 삭제
        </button>
      </div>
    </section>

    <!-- 댓글 -->
    <section class="review-detail__reply">
      <h2>
        댓글 ({{ replyList.length }})
      </h2>

      <p
        v-if="replyList.length === 0"
        class="review-detail__empty"
      >
        등록된 댓글이 없습니다.
      </p>

      <div
        v-for="reply in replyList"
        :key="reply.id"
        class="review-detail__reply-item"
      >
        <div class="review-detail__reply-content">
          <strong>
            {{ reply.writer_nickname }}
          </strong>

          <p>
            {{ reply.content }}
          </p>
        </div>

        <button
          v-if="reply.users_id === currentUserId"
          type="button"
          class="btn btn--ghost"
          @click="deleteReply(reply.id)"
        >
          삭제
        </button>
      </div>

      <!-- 댓글 작성 -->
      <div class="review-detail__reply-form">
        <input
          v-model="replyContent"
          type="text"
          class="input"
          placeholder="댓글을 입력하세요"
        />

        <button
          type="button"
          class="btn btn--primary"
          @click="insertReply"
        >
          댓글 작성
        </button>
      </div>
    </section>

  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      reviewId: this.$route.query.id || 1,
      currentUserId: Number(sessionStorage.getItem('users_id')) || 4,
      board: {},
      replyList: [],
      replyContent: ''
    }
  },
  mounted() {
    this.fetchDetail()
  },
  methods: {
    fetchDetail() {
      axios.get(`http://localhost:8080/review/detail?id=${this.reviewId}`)
        .then(res => {
          this.board = res.data.board
          this.replyList = res.data.replyList
        })
        .catch(err => console.error('상세 조회 에러:', err))
    },

    deleteReview() {
      if (!confirm('리뷰를 삭제하시겠습니까?')) return

      axios.delete(`http://localhost:8080/review/delete?id=${this.reviewId}`)
        .then(() => {
          alert('삭제되었습니다.')
          this.$router.push('/review/list')
        })
        .catch(err => console.error('삭제 에러:', err))
    },

    insertReply() {
      if (!this.replyContent.trim()) return

      const data = {
        review_board_id: Number(this.reviewId),
        users_id: this.currentUserId,
        content: this.replyContent
      }

      axios.post('http://localhost:8080/review/reply/insert', data)
        .then(() => {
          this.replyContent = ''
          this.fetchDetail()
        })
        .catch(err => console.error('댓글 작성 에러:', err))
    },

    deleteReply(replyId) {
      if (!confirm('댓글을 삭제하시겠습니까?')) return

      axios.delete(`http://localhost:8080/review/reply/delete?id=${replyId}`)
        .then(() => {
          this.fetchDetail()
        })
        .catch(err => console.error('댓글 삭제 에러:', err))
    }
  }
}
</script>

<style scoped>
.community-page {
  max-width: 800px;
  margin: 0 auto;
  padding-block: var(--space-8);
}

.review-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.review-detail__header {
  padding-bottom: var(--space-4);
  border-bottom: 1px solid var(--border);
}

.review-detail__header h1 {
  margin: 0;
}

.review-detail__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  margin-top: var(--space-3);
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

.review-detail__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.review-detail__image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
}

.review-detail__content {
  margin: 0;
  white-space: pre-line;
}

.review-detail__actions {
  display: flex;
  justify-content: flex-end;
}

.review-detail__reply {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--border);
}

.review-detail__reply h2 {
  margin: 0 0 var(--space-4);
}

.review-detail__empty {
  margin: 0;
  padding: var(--space-5);
  text-align: center;
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border-radius: var(--radius-md);
}

.review-detail__reply-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4) 0;
  border-bottom: 1px solid var(--border);
}

.review-detail__reply-content {
  min-width: 0;
}

.review-detail__reply-content strong {
  font-size: var(--text-sm);
}

.review-detail__reply-content p {
  margin: var(--space-2) 0 0;
}

.review-detail__reply-item .btn {
  flex-shrink: 0;
  padding-inline: var(--space-2);
}

.review-detail__reply-form {
  display: flex;
  gap: var(--space-2);
  margin-top: var(--space-4);
}

.review-detail__reply-form .input {
  flex: 1;
  min-width: 0;
}

.review-detail__reply-form .btn {
  flex-shrink: 0;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .review-detail__meta {
    flex-wrap: wrap;
  }

  .review-detail__reply-form {
    flex-direction: column;
  }

  .review-detail__reply-form .btn {
    width: 100%;
  }
}
</style>
```
