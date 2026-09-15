<template>
  <div class="container community-page">
    <h1>후기게시판</h1>

    <!-- 검색 / 글쓰기 -->
    <div class="review-board__control">
      <button
        type="button"
        class="btn btn--primary"
        @click="goWrite"
      >
        글쓰기
      </button>

      <div class="review-board__search">
        <select
          v-model="searchType"
          class="review-board__select"
        >
          <option value="subject">제목</option>
          <option value="content">본문</option>
          <option value="writer">작성자</option>
        </select>

        <input
          v-model="keyword"
          type="text"
          class="input"
          placeholder="검색"
          @keyup.enter="searchReviews"
        />

        <button
          type="button"
          class="btn btn--outline"
          @click="searchReviews"
        >
          검색
        </button>
      </div>
    </div>

    <!-- 리뷰 목록 -->
    <div class="review-board__list">
      <ReviewCard
        v-for="review in reviewList"
        :key="review.id"
        :review="review"
        @click="goDetail(review.id)"
      />
    </div>

    <!-- 페이지네이션 -->
    <Pagination
      class="review-board__pagination"
      :curpage="page.curpage"
      :startpage="page.startpage"
      :endpage="page.endpage"
      :totalpage="page.totalpage"
      @change="loadReviews"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

import Pagination from '@/components/common/Pagination.vue'
import ReviewCard from '@/components/review/ReviewCard.vue'

const router = useRouter()

const reviewList = ref([])

const page = ref({
  curpage: 1,
  startpage: 1,
  endpage: 1,
  totalpage: 1
})

const searchType = ref('subject')
const keyword = ref('')

async function loadReviews(pageInfo = 1) {
  try {
    const res = await axios.get(
      'http://localhost:8080/review/list',
      {
        params: {
          page: pageInfo,
          keyword: keyword.value,
          type: searchType.value
        }
      }
    )

    reviewList.value = res.data.list

    page.value = {
      curpage: res.data.curpage,
      startpage: res.data.startpage,
      endpage: res.data.endpage,
      totalpage: res.data.totalpage
    }
  } catch (error) {
    console.error('후기 목록 조회 실패:', error)
  }
}

function searchReviews() {
  loadReviews(1)
}

function goDetail(id) {
  router.push(`/review/${id}`)
}

function goWrite() {
  router.push('/review/new')
}

onMounted(() => {
  loadReviews(1)
})
</script>

<style scoped>
.review-board__control {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin: var(--space-4) 0;
}

.review-board__search {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-left: auto;
}

.review-board__select {
  flex-shrink: 0;
  padding: var(--space-2) var(--space-3);
  background: var(--accent-subtle);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  color: var(--text-primary);
  white-space: nowrap;
}

.review-board__search .input {
  width: 180px;
  flex-shrink: 0;
}

.review-board__search .btn {
  flex-shrink: 0;
  white-space: nowrap;
}

.review-board__list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}

.review-board__pagination {
  margin-top: var(--space-6);
}

@media (max-width: 1024px) {
  .review-board__list {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .review-board__control {
    flex-direction: column;
    align-items: stretch;
  }

  .review-board__search {
    width: 100%;
    margin-left: 0;
  }

  .review-board__search .input {
    flex: 1;
    min-width: 0;
  }

  .review-board__list {
    grid-template-columns: 1fr;
  }
}
</style>