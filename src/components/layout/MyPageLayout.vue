<template>
  <div class="mypage-layout container">
    <MyPageSidebar />
    <div class="mypage-layout__content">
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import MyPageSidebar from '@/components/mypage/MyPageSidebar.vue'
</script>

<style scoped>
.mypage-layout {
  display: flex;
  gap: var(--space-6);
  align-items: flex-start;
  padding-block: var(--space-6);
  min-height: calc(100vh - var(--header-height));
}
.mypage-layout__content {
  flex: 1;
  min-width: 0;
}
@media (max-width: 768px) {
  .mypage-layout {
    flex-direction: column;
  }
}
</style>