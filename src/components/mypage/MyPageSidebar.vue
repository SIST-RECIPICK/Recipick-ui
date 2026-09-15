<template>
  <aside class="mypage-sidebar">
    <p class="mypage-sidebar__brand" style="font-size: var(--text-base)">마이페이지</p>
    <nav class="mypage-sidebar__nav" aria-label="마이페이지 메뉴">
      <div v-for="group in menuGroups" :key="group.label" class="mypage-sidebar__group">
        <p class="mypage-sidebar__group-label">{{ group.label }}</p>
        <RouterLink
          v-for="item in group.items"
          :key="item.to"
          :to="item.to"
          class="mypage-sidebar__link"
        >
          {{ item.label }}
        </RouterLink>
      </div>
    </nav>
  </aside>
</template>

<script setup>
const menuGroups = [
  {
    label: '레시피',
    items: [
      { label: '내 레시피', to: '/mypage/myrecipe' },
      { label: '새 레시피 작성', to: '/mypage/newrecipe' },
    ],
  },
  {
    label: '활동',
    items: [
      { label: '좋아요 레시피', to: '/mypage/saverecipe' },
      { label: '나의 후기', to: '/mypage/myreview' },
      { label: '나의 댓글', to: '/mypage/myreply' },
    ],
  },
  {
    label: '계정',
    items: [
      { label: '회원정보 변경', to: '/mypage/accountsetting' },
    ],
  },
]
</script>

<style scoped>
.mypage-sidebar {
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  padding: var(--space-5) var(--space-3);
  align-self: stretch;
}

.mypage-sidebar__brand {
  padding: 0 var(--space-3) var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-muted);
}

.mypage-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}

.mypage-sidebar__group {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.mypage-sidebar__group-label {
  padding: 0 var(--space-3) var(--space-2);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
  color: var(--text-muted);
  letter-spacing: 0.02em;
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

@media (max-width: 768px) {
  .mypage-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: var(--space-3);
  }
  .mypage-sidebar__brand {
    display: none;
  }
  .mypage-sidebar__nav {
    flex-direction: row;
    gap: var(--space-4);
    overflow-x: auto;
    white-space: nowrap;
    scrollbar-width: none;
  }
  .mypage-sidebar__nav::-webkit-scrollbar {
    display: none;
  }
  .mypage-sidebar__group {
    flex-direction: row;
    align-items: center;
    gap: var(--space-1);
  }
  .mypage-sidebar__group-label {
    display: none;
  }
}
</style>