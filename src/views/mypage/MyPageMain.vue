<template>
  <div class="my-page-main">

    <!-- 내 레시피 -->
    <section class="my-page-main__section">
      <div class="my-page-main__header">
        <h2>내 레시피</h2>
        <button type="button" class="btn btn--ghost">
          더보기 &gt;
        </button>
      </div>

      <div class="my-page-main__recipe-list">
        
        <!--<MyRecipeCard />
        <MyRecipeCard />
        <MyRecipeCard />-->

      </div>
    </section>


    <!-- 찜한 레시피 -->
    <section class="my-page-main__section">
      <div class="my-page-main__header">
        <h2>찜한 레시피</h2>
        <button type="button" class="btn btn--ghost">
          더보기 &gt;
        </button>
      </div>

      <div class="my-page-main__recipe-list">

        <!--<MyRecipeCard />
        <MyRecipeCard />
        <MyRecipeCard />-->

      </div>
    </section>


    <!-- 후기 / 댓글 -->
    <div class="my-page-main__activity">

      <!-- 내 후기 -->
      <section class="my-page-main__section">
        <div class="my-page-main__header">
          <h2>내 후기</h2>
          <button type="button" class="btn btn--ghost">
            더보기 &gt;
          </button>
        </div>

        <div class="my-page-main__text-list">
          <p>정말 맛있게 먹었습니다.</p>
          <p>간단하고 맛있어서 좋았습니다.</p>
          <p>다음에도 다시 만들어 먹을 것 같아요.</p>
        </div>
      </section>


      <!-- 내 댓글 -->
      <section class="my-page-main__section">
        <div class="my-page-main__header">
          <h2>내 댓글</h2>
          <button type="button" class="btn btn--ghost">
            더보기 &gt;
          </button>
        </div>

        <div class="my-page-main__text-list">
          <p>이 레시피 정말 맛있네요.</p>
          <p>재료를 구하기도 쉬워서 좋았습니다.</p>
          <p>저도 한번 만들어봐야겠어요.</p>
        </div>
      </section>

    </div>

  </div>
</template>

<script setup>
import MyRecipeCard from '@/components/mypage/MyRecipeCard.vue'
</script>

<style scoped>
.my-page-main {
  padding: var(--space-6) 0;
}

.my-page-main__section {
  margin-bottom: var(--space-6);
}

.my-page-main__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.my-page-main__recipe-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}

.my-page-main__activity {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-6);
}

.my-page-main__text-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.my-page-main__text-list p {
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>