<template>
  <div>
    <!-- 1. 리뷰 본문 영역 -->
    <h3>{{ board.subject }}</h3>
    <div>
      <p>작성자: {{ board.writer_nickname }} | 조회수: {{ board.hit }}</p>
      <p>작성일: {{ board.created_at }}</p>
      <p v-if="board.image_url">
        <img :src="board.image_url" alt="리뷰 이미지" width="300" />
      </p>
      <p>{{ board.content }}</p>

      <!-- 본인 글 삭제 (SessionStorage 기반) -->
      <button v-if="board.writer_id === currentUserId" @click="deleteReview">리뷰 삭제</button>
    </div>

    <hr />

    <!-- 2. 댓글 목록 영역 -->
    <div>
      <h4>댓글 ({{ replyList.length }})</h4>
      <p v-if="replyList.length === 0">등록된 댓글이 없습니다.</p>

      <div v-for="reply in replyList" :key="reply.id">
        <p>
          <b>{{ reply.writer_nickname }}</b>: {{ reply.content }}
          <button v-if="reply.users_id === currentUserId" @click="deleteReply(reply.id)">삭제</button>
        </p>
      </div>
    </div>

    <!-- 3. 댓글 작성 영역 -->
    <div>
      <input type="text" v-model="replyContent" placeholder="댓글을 입력하세요" />
      <button @click="insertReply">댓글 작성</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  data() {
    return {
      reviewId: this.$route.query.id || 1, // URL 쿼리 파라미터(?id=1) 받기
      currentUserId: Number(sessionStorage.getItem('users_id')) || 4, // 로그인 사용자 ID
      board: {},
      replyList: [],
      replyContent: ''
    }
  },
  mounted() {
    this.fetchDetail()
  },
  methods: {
    // 상세 조회 API 호출
    fetchDetail() {
      axios.get(`http://localhost:8080/review/detail?id=${this.reviewId}`)
        .then(res => {
          this.board = res.data.board
          this.replyList = res.data.replyList
        })
        .catch(err => console.error('상세 조회 에러:', err))
    },
    // 리뷰 삭제 API 호출
    deleteReview() {
      if (!confirm('리뷰를 삭제하시겠습니까?')) return

      axios.delete(`http://localhost:8080/review/delete?id=${this.reviewId}`)
        .then(() => {
          alert('삭제되었습니다.')
          this.$router.push('/review/list')
        })
        .catch(err => console.error('삭제 에러:', err))
    },
    // 댓글 작성 API 호출
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
          this.fetchDetail() // 댓글 목록 새로고침
        })
        .catch(err => console.error('댓글 작성 에러:', err))
    },
    // 댓글 삭제 API 호출
    deleteReply(replyId) {
      if (!confirm('댓글을 삭제하시겠습니까?')) return

      axios.delete(`http://localhost:8080/review/reply/delete?id=${replyId}`)
        .then(() => {
          this.fetchDetail() // 댓글 목록 새로고침
        })
        .catch(err => console.error('댓글 삭제 에러:', err))
    }
  }
}
</script>

<style scoped>
.community-page {
  padding-block: var(--space-8);
  max-width: 800px;
  margin: 0 auto;
}

.community-page__title {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-3);
}

.review-detail {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 헤더 영역 */
.review-header {
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 16px;
}

.review-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #111827;
}

.review-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #6b7280;
  font-size: 0.9rem;
}

.writer-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.profile-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.nickname {
  font-weight: 600;
  color: #374151;
}

.post-info {
  display: flex;
  gap: 12px;
}

/* 본문 영역 */
.review-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.main-image-wrapper {
  width: 100%;
  max-height: 400px;
  overflow: hidden;
  border-radius: 8px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.review-content {
  font-size: 1rem;
  line-height: 1.6;
  color: #1f2937;
  white-space: pre-line;
}

/* 댓글 / 관련 리뷰 섹션 공통 */
.section-title {
  font-size: 1.15rem;
  font-weight: bold;
  margin-bottom: 16px;
  color: #111827;
}

.empty-state {
  padding: 20px;
  background-color: #f9fafb;
  border-radius: 6px;
  color: #9ca3af;
  text-align: center;
  font-size: 0.9rem;
}

/* 댓글 목록 */
.reply-list {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reply-item {
  padding: 12px;
  border-bottom: 1px solid #f3f4f6;
}

.reply-writer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
}

.reply-profile {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

.reply-nickname {
  font-weight: 600;
  font-size: 0.85rem;
}

.reply-date {
  font-size: 0.75rem;
  color: #9ca3af;
}

.reply-content {
  font-size: 0.9rem;
  color: #374151;
  margin: 0;
}

/* 그리드 카드 영역 */
.review-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.review-card {
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  overflow: hidden;
}

.card-img {
  width: 100%;
  height: 100px;
  object-fit: cover;
}

.card-title {
  padding: 8px;
  font-size: 0.8rem;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.loading-state, .error-state {
  padding: 40px 0;
  text-align: center;
}
</style>