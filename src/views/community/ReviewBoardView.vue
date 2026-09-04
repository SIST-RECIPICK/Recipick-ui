<template>
  <div class="container community-page">
    <h1 class="community-page__title">후기게시판</h1>
    <p class="text-secondary">후기게시판 화면은 요건 확정 후 구현 예정입니다.</p>
  </div>
  <div class="container">
    <div class="review_list_grid">
      <div v-if="reviewList.length > 0">
        <img :src="reviewList[0].image_url" style="width: 100%; height: 150px; object-fit: cover;" />
        <h3>{{ reviewList[0].subject }}</h3>
        <p>작성자 ID: {{ reviewList[0].users_id }}</p>
        <p>조회수: {{ reviewList[0].hit }}</p>
      </div>

      <div v-else>
        <p>데이터가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const reviewList = ref([])

onMounted(async () => {
  try {
    const res = await axios.get('http://localhost:8080/review/list?page=1')
    reviewList.value = res.data.list
  } catch (err) {
    console.error('오류:', err)
  }
})
</script>

<style scoped>
.community-page {
  padding-block: var(--space-8);
}
.community-page__title {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-3);
}

.review_list_grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--space-4);
  justify-items: center;
}
</style>
