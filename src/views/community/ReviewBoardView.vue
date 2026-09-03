<template>
  <div class="container community-page">
    <h1 class="community-page__title">후기게시판</h1>
    <p class="text-secondary">후기게시판 화면은 요건 확정 후 구현 예정입니다.</p>
  </div>
  <div class="container">
    <div class="review_list_grid">
      <iframe src="about:blank" width="250" height="250">push test</iframe>
      <iframe src="about:blank" width="250" height="250"></iframe>
      <iframe src="about:blank" width="250" height="250"></iframe>
      <iframe src="about:blank" width="250" height="250"></iframe>

      <iframe src="about:blank" width="250" height="250"></iframe>
      <iframe src="about:blank" width="250" height="250"></iframe>
      <iframe src="about:blank" width="250" height="250"></iframe>
      <iframe src="about:blank" width="250" height="250"></iframe>
      
      <iframe src="about:blank" width="250" height="250"></iframe>
      <iframe src="about:blank" width="250" height="250"></iframe>
      <iframe src="about:blank" width="250" height="250"></iframe>
      <iframe src="about:blank" width="250" height="250"></iframe>
    </div>
  </div>
</template>

<script setup>

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
