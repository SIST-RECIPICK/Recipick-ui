```vue
<template>
  <aside class="mypage-sidebar">

    <!-- 회원 정보 -->
    <div class="mypage-sidebar__profile">

      <!-- 사진 + 이름 -->
      <div class="mypage-sidebar__profile-top">

        <div class="mypage-sidebar__profile-image">
          사진
        </div>

        <p class="mypage-sidebar__name">
          홍길동
        </p>

      </div>


      <!-- 회원정보 관리 -->
      <RouterLink
        to="/mypage/accountsetting"
        class="btn btn--primary btn--block"
      >
        회원정보 관리
      </RouterLink>

    </div>

    <br>

    <!-- 새 레시피 작성 -->
    <RouterLink
      to="/mypage/newrecipe"
      class="btn btn--primary btn--block"
    >
      새 레시피 작성
    </RouterLink>


    <!-- 마이페이지 메뉴 -->
    <nav
      class="mypage-sidebar__nav"
      aria-label="마이페이지 메뉴"
    >

      <!-- 전체 보기 -->
      <RouterLink
        to="/mypage/main"
        class="mypage-sidebar__link mypage-sidebar__link--main"
      >
        전체 보기
      </RouterLink>


      <!-- 레시피 -->
      <div class="mypage-sidebar__section">

        <p class="mypage-sidebar__section-title">
          레시피
        </p>

        <RouterLink
          to="/mypage/myrecipe"
          class="mypage-sidebar__link"
        >
          <span>나의 레시피</span>
          <span class="mypage-sidebar__count">
            {{ recipeCount }}
          </span>
        </RouterLink>

        <RouterLink
          to="/mypage/saverecipe"
          class="mypage-sidebar__link"
        >
          <span>찜한 레시피</span>
          <span class="mypage-sidebar__count">
            {{ savedRecipeCount }}
          </span>
        </RouterLink>

      </div>


      <!-- 활동 -->
      <div class="mypage-sidebar__section">

        <p class="mypage-sidebar__section-title">
          활동
        </p>

        <RouterLink
          to="/mypage/myreview"
          class="mypage-sidebar__link"
        >
          <span>내 후기 관리</span>
          <span class="mypage-sidebar__count">
            {{ reviewCount }}
          </span>
        </RouterLink>

        <RouterLink
          to="/mypage/myreply"
          class="mypage-sidebar__link"
        >
          <span>내 댓글 관리</span>
          <span class="mypage-sidebar__count">
            {{ replyCount }}
          </span>
        </RouterLink>

      </div>

    </nav>

  </aside>
</template>


<script setup>
import { ref } from 'vue'

const recipeCount = ref(5)
const savedRecipeCount = ref(10)
const reviewCount = ref(5)
const replyCount = ref(10)
</script>


<style scoped>
.mypage-sidebar {
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  padding: var(--space-5) var(--space-3);
  align-self: stretch;
}


/* =========================
   회원 정보
   ========================= */

.mypage-sidebar__profile {
  display: flex;
  flex-direction: column;

  gap: var(--space-4);

  padding: var(--space-4);

  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
}


/* 사진 + 이름 */
.mypage-sidebar__profile-top {
  display: flex;
  align-items: center;

  gap: var(--space-3);
}


/* 프로필 사진 */
.mypage-sidebar__profile-image {
  width: 56px;
  height: 56px;

  flex-shrink: 0;

  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--surface-sunken);
  border-radius: 50%;

  color: var(--text-secondary);
  font-size: var(--text-sm);
}


/* 이름 */
.mypage-sidebar__name {
  margin: 0;
  color: var(--text-primary);
  font-weight: var(--weight-bold);
}


/* =========================
   메뉴
   ========================= */

.mypage-sidebar__nav {
  display: flex;
  flex-direction: column;

  margin-top: var(--space-5);
}

.mypage-sidebar__link--main {
  margin-bottom: var(--space-4);
}


/* =========================
   메뉴 카테고리
   ========================= */

.mypage-sidebar__section {
  display: flex;
  flex-direction: column;

  margin-bottom: var(--space-4);
}

.mypage-sidebar__section-title {
  margin: 0 0 var(--space-1);

  padding: 0 var(--space-3);

  color: var(--text-secondary);

  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
}


/* =========================
   메뉴 링크
   ========================= */

.mypage-sidebar__link {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: var(--space-3);

  border-radius: var(--radius-sm);

  font-size: var(--text-sm);
  color: var(--text-secondary);

  transition:
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}

.mypage-sidebar__link:hover {
  background: var(--surface-sunken);
  color: var(--text-primary);
}

.mypage-sidebar__link.router-link-active {
  background: var(--accent-subtle);
  color: var(--accent-text);

  font-weight: var(--weight-medium);
}


/* =========================
   글 개수
   ========================= */

.mypage-sidebar__count {
  color: var(--text-secondary);
  font-size: var(--text-sm);
}


/* =========================
   모바일
   ========================= */

@media (max-width: 768px) {

  .mypage-sidebar {
    width: 100%;
    padding: var(--space-3);
  }

  .mypage-sidebar__profile {
    width: 100%;
  }

  .mypage-sidebar__nav {
    flex-direction: row;
    gap: var(--space-2);

    overflow-x: auto;
    white-space: nowrap;

    scrollbar-width: none;
  }

  .mypage-sidebar__nav::-webkit-scrollbar {
    display: none;
  }

  .mypage-sidebar__section {
    flex-direction: row;
    align-items: center;

    margin-bottom: 0;
  }

  .mypage-sidebar__section-title {
    display: none;
  }

  .mypage-sidebar__link--main {
    margin-bottom: 0;
  }
}
</style>
```
