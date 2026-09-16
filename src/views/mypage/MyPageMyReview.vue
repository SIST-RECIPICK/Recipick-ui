<script setup lang="ts">

</script>

<template>

  <div class="my-review">

    <h1>
      나의 리뷰
      <span class="my-review__count">(27)</span>
    </h1>

    <!-- 리뷰 목록 -->
    <div class="my-review__list">
      <MyReviewCard />
    </div>

    <!-- 페이지네이션 -->
    <Pagination />

  </div>
</template>

<script setup>
import MyReviewCard from '@/components/mypage/MyReviewCard.vue'
import Pagination from '@/components/common/Pagination.vue'
</script>

<style scoped>
.my-review {
  padding: var(--space-6) 0;
}

.my-review__count {
  color: var(--accent);
}

.my-review__list {
  margin-top: var(--space-4);
}
</style>
