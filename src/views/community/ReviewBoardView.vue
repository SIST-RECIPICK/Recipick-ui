<template>
  <div class="container community-page">
    <h1 class="community-page__title">후기게시판</h1>

    <!-- 컨트롤 바 -->
    <div class="board-control-bar">
      <div>
        <button 
          v-if="isLoggedIn" 
          type="button" 
          class="btn-write" 
          @click="goWrite"
        >
          글쓰기
        </button>
      </div>

      <!-- 검색 영역: 드롭다운 추가 -->
      <div class="mini-search-box">
        <select v-model="searchType" class="search-select">
          <option value="subject">제목</option>
          <option value="content">본문</option>
          <option value="writer">작성자</option>
        </select>

        <input 
          type="text" 
          v-model="searchKeyword" 
          @keyup.enter="searchReviews"
          placeholder="검색어 입력" 
          class="search-input"
        />
        <button type="button" class="search-btn" @click="searchReviews">검색</button>
      </div>
    </div>

    <!-- 리뷰 목록 그리드 -->
    <div v-if="reviewList.length > 0" class="review-grid">
      <div 
        v-for="item in reviewList" 
        :key="item.id" 
        class="review-card"
        @click="goDetail(item.id)"
      >
        <img :src="item.image_url" alt="후기 이미지" class="card-image" />
        <div class="card-body">
          <h3 class="review-title">{{ item.subject }}</h3>
          <p class="writer-name">작성자: {{ item.writer_nickname }}</p>
          <p class="review-content">{{ item.content }}</p>
          <hr />
          <p class="recipe-title">🍳 {{ item.rcp_nm }}</p>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <p>조회된 리뷰가 없습니다.</p>
    </div>

    <!-- 하단 페이징 -->
    <div v-if="pageInfo.totalpage > 0" class="pagination-wrap">
      <div class="pagination">
        <button 
          :disabled="pageInfo.startpage <= 1" 
          @click="changePage(pageInfo.startpage - 1)"
          class="page-btn"
        >
          이전
        </button>

        <button 
          v-for="page in pageNumbers" 
          :key="page" 
          :class="['page-btn', { active: page === pageInfo.curpage }]"
          @click="changePage(page)"
        >
          {{ page }}
        </button>

        <button 
          :disabled="pageInfo.endpage >= pageInfo.totalpage" 
          @click="changePage(pageInfo.endpage + 1)"
          class="page-btn"
        >
          다음
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()

const isLoggedIn = computed(() => !!sessionStorage.getItem('users_id'))

const reviewList = ref([])
const searchType = ref('subject') // 기본값: 제목
const searchKeyword = ref('')
const pageInfo = ref({
  curpage: 1,
  totalpage: 1,
  startpage: 1,
  endpage: 1
})

const pageNumbers = computed(() => {
  const pages = []
  for (let i = pageInfo.value.startpage; i <= pageInfo.value.endpage; i++) {
    pages.push(i)
  }
  return pages
})

const fetchReviewList = async (page = 1) => {
  try {
    const url = `http://localhost:8080/review/list?page=${page}&keyword=${searchKeyword.value.trim()}&type=${searchType.value}`
    console.log('요청 URL:', url)

    const res = await axios.get(url)
    console.log('백엔드 응답 데이터:', res.data)

    reviewList.value = res.data.list
    pageInfo.value = {
      curpage: res.data.curpage,
      totalpage: res.data.totalpage,
      startpage: res.data.startpage,
      endpage: res.data.endpage
    }
  } catch (err) {
    console.error('리뷰 목록 조회 실패:', err)
  }
}

const searchReviews = () => {
  console.log(`검색 조건: [${searchType.value}] / 입력어: [${searchKeyword.value}]`)
  fetchReviewList(1)
}

const changePage = (newPage) => {
  if (newPage < 1 || newPage > pageInfo.value.totalpage) return
  fetchReviewList(newPage)
}

const goWrite = () => {
  router.push('/community/reviews/write')
}

const goDetail = (id) => {
  router.push(`/community/reviews/detail?id=${id}`)
}

onMounted(() => {
  fetchReviewList(1)
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.community-page__title {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 20px;
}

.board-control-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.btn-write {
  padding: 8px 16px;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.btn-write:hover {
  background-color: #1d4ed8;
}

.mini-search-box {
  display: flex;
  gap: 6px;
}

/* 드롭다운 셀렉트 박스 스타일 */
.search-select {
  padding: 6px 8px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: #ffffff;
  outline: none;
}

.search-select:focus {
  border-color: #2563eb;
}

.search-input {
  width: 180px;
  padding: 6px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
}

.search-input:focus {
  outline: none;
  border-color: #2563eb;
}

.search-btn {
  padding: 6px 12px;
  background-color: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.875rem;
  cursor: pointer;
}

.search-btn:hover {
  background-color: #e5e7eb;
}

.review-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.review-card {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  cursor: pointer;
}

.card-image {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.card-body {
  padding: 12px;
}

.review-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 6px;
}

.writer-name {
  font-size: 0.85rem;
  color: #6b7280;
}

.review-content {
  font-size: 0.875rem;
  color: #374151;
  margin-top: 8px;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  margin-top: 36px;
}

.pagination {
  display: flex;
  gap: 6px;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  background-color: #ffffff;
  color: #374151;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
}

.page-btn.active {
  background-color: #2563eb;
  color: #ffffff;
  border-color: #2563eb;
  font-weight: bold;
}

.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #9ca3af;
}
</style>