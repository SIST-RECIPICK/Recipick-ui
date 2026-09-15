<template>
  <div class="my-reply">

    <h1>
      나의 댓글
      <span class="my-reply__count">(164)</span>
    </h1>

    <!-- 전체 선택 / 선택 삭제 -->
    <div class="my-reply__actions">
      <button type="button" class="btn btn--outline">
        전체 선택
      </button>

      <button type="button" class="btn btn--primary">
        선택 삭제
      </button>
    </div>

    <!-- 댓글 목록 -->
    <div class="my-reply__list">
      <MyReplyCard />
    </div>

    <!-- 페이지네이션 -->
    <Pagination />

  </div>
</template>

<script setup lang="ts">
import MyReplyCard from '@/components/mypage/MyReplyCard.vue'
import Pagination from '@/components/common/Pagination.vue'
</script>

<style scoped>
.my-reply {
  padding: var(--space-6) 0;
}

.my-reply__count {
  color: var(--accent);
}

.my-reply__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  margin-top: var(--space-4);
  margin-bottom: var(--space-3);
}

.my-reply__list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
</style>