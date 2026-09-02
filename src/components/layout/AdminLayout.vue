<template>
  <div class="admin-layout container">
    <AdminSidebar />

    <div class="admin-layout__content">
      <!-- 브레드크럼 (라우트 meta에서 읽음) -->
      <nav v-if="crumbs.length" class="breadcrumb" aria-label="현재 위치">
        <template v-for="(crumb, i) in crumbs" :key="i">
          <RouterLink
            v-if="crumb.to && i < crumbs.length - 1"
            :to="crumb.to"
            class="breadcrumb__link"
          >
            {{ crumb.label }}
          </RouterLink>
          <span v-else class="breadcrumb__current">{{ crumb.label }}</span>
          <IconChevronRight v-if="i < crumbs.length - 1" :size="14" class="breadcrumb__sep" />
        </template>
      </nav>

      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AdminSidebar from '@/components/admin/AdminSidebar.vue'
import { IconChevronRight } from '@tabler/icons-vue'

const route = useRoute()

// 각 라우트 meta.breadcrumb = [{ label, to? }] 로 정의
const crumbs = computed(() => route.meta.breadcrumb ?? [])
</script>

<style scoped>
.admin-layout {
  display: flex;
  gap: var(--space-6);
  align-items: flex-start;
  padding-block: var(--space-6);
  min-height: calc(100vh - var(--header-height));
}
.admin-layout__content {
  flex: 1;
  min-width: 0;
}

/* 브레드크럼 */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
}
.breadcrumb__link {
  color: var(--text-secondary);
}
.breadcrumb__link:hover {
  color: var(--accent);
}
.breadcrumb__current {
  color: var(--text-primary);
  font-weight: var(--weight-medium);
}
.breadcrumb__sep {
  color: var(--text-muted);
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
    gap: var(--space-4);
  }
  .admin-layout__content {
    width: 100%;
  }
}
</style>
