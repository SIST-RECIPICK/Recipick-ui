<template>
  <aside class="admin-sidebar">
    <p class="admin-sidebar__brand">관리자</p>
    <nav class="admin-sidebar__nav" aria-label="관리자 메뉴">
      <RouterLink v-for="item in menu" :key="item.to" :to="item.to" class="admin-sidebar__link">
        <component :is="item.icon" :size="18" />
        {{ item.label }}
      </RouterLink>
    </nav>
  </aside>
</template>

<script setup>
import { IconUsers, IconLayoutGrid } from '@tabler/icons-vue'

// 대분류만 노출(평면형). 등록/상세는 본문 브레드크럼·버튼으로 이동.
const menu = [
  { label: '회원관리', to: '/admin/members', icon: IconUsers },
  { label: '큐레이션 관리', to: '/admin/curations', icon: IconLayoutGrid },
]
</script>

<style scoped>
.admin-sidebar {
  width: 220px;
  flex-shrink: 0;
  border-right: 1px solid var(--border);
  padding: var(--space-5) var(--space-3);
  align-self: stretch;
}
.admin-sidebar__brand {
  padding: 0 var(--space-3) var(--space-3);
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-muted);
  letter-spacing: 0.04em;
}
.admin-sidebar__nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.admin-sidebar__link {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  color: var(--text-secondary);
  transition:
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}
.admin-sidebar__link svg {
  color: var(--text-muted);
}
.admin-sidebar__link:hover {
  background: var(--surface-sunken);
  color: var(--text-primary);
}
.admin-sidebar__link.router-link-active {
  background: var(--accent-subtle);
  color: var(--accent-text);
  font-weight: var(--weight-medium);
}
.admin-sidebar__link.router-link-active svg {
  color: var(--accent);
}

@media (max-width: 768px) {
  .admin-sidebar {
    width: 100%;
    border-right: none;
    border-bottom: 1px solid var(--border);
    padding: var(--space-3);
  }
  .admin-sidebar__nav {
    flex-direction: row;
  }
  .admin-sidebar__brand {
    display: none;
  }
}
</style>
