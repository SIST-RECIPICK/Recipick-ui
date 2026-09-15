<template>
  <aside class="mypage-sidebar">
    <p class="mypage-sidebar__brand">마이페이지</p>
    <nav class="mypage-sidebar__nav" aria-label="마이페이지 메뉴">
      <RouterLink v-for="item in menu" :key="item.to" :to="item.to" class="mypage-sidebar__link">
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
const menu = [
  { label: '전체 보기', to: '/mypage/main' },
  { label: '내 레시피', to: '/mypage/myrecipe' },
  { label: '저장한 레시피', to: '/mypage/saverecipe' },
  { label: '새 레시피 작성', to: '/mypage/newrecipe' },
  { label: '나의 후기', to: '/mypage/myreview' },
  { label: '나의 댓글', to: '/mypage/myreply' },
  { label: '회원정보 변경', to: '/mypage/accountsetting' },
]
</script>

<style scoped>
.mypage-sidebar {
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  padding: var(--space-5) var(--space-3);
  align-self: stretch; /* 세로선이 끝까지 내려오도록 추가 */
}

.mypage-sidebar__brand {
  padding: 0 var(--space-3) var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-muted);
}

.mypage-sidebar__nav {
  display: flex;
  flex-direction: column; /* PC 화면에서 확실하게 세로 배열 */
  gap: var(--space-1);
}

.mypage-sidebar__link {
  display: flex;
  align-items: center;
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
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

/* 🔥 핵심 원인 해결: 브라우저 창이 좁아졌을 때의 반응형 레이아웃 */
@media (max-width: 768px) {
  .mypage-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: var(--space-3);
  }
  .mypage-sidebar__brand {
    display: none; /* 모바일에서는 타이틀 숨김 */
  }
  .mypage-sidebar__nav {
    flex-direction: row; /* 세로로 쭈욱 늘어지지 않고 가로로 나열 */
    overflow-x: auto; /* 항목이 7개라 넘치므로 가로 스크롤 허용 */
    white-space: nowrap;
    scrollbar-width: none;
  }
  .mypage-sidebar__nav::-webkit-scrollbar {
    display: none; /* 크롬 스크롤바 숨김 */
  }
}
</style>