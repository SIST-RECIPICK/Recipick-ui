<template>
  <AdminPanel>
    <!-- 제목 + 액션 -->
    <div class="cdetail__head">
      <div>
        <h1 class="cdetail__title">{{ curation.title }}</h1>
        <p class="cdetail__meta text-secondary">
          {{ curation.yearMonthLabel }} · 등록일 {{ curation.registeredAt }}
        </p>
      </div>
      <div class="cdetail__actions">
        <RouterLink :to="`/admin/curations/${curation.id}/edit`" class="btn btn--outline">
          수정
        </RouterLink>
        <button class="btn btn--outline" @click="handleDelete">삭제</button>
      </div>
    </div>

    <!-- 재료 칩 -->
    <div class="cdetail__chips">
      <span v-for="ing in curation.ingredients" :key="ing.name" class="chip chip--accent">
        {{ ing.name }}
      </span>
    </div>

    <!-- 재료별 그룹 -->
    <div class="cdetail__groups">
      <CurationGroup
        v-for="ing in curation.ingredients"
        :key="ing.name"
        :ingredient="ing.name"
        :recipes="ing.recipes"
      />
    </div>
  </AdminPanel>
</template>

<script setup>
import AdminPanel from '@/components/admin/AdminPanel.vue'
import CurationGroup from '@/components/admin/CurationGroup.vue'

// TODO: route.params.id로 조회 (FR-222)
function handleDelete() {
  // TODO: 삭제 확인 모달 + 삭제 API
}

// 목업 데이터
const curation = {
  id: 3,
  title: '가을 뿌리채소 밥상',
  yearMonthLabel: '2025년 10월',
  registeredAt: '2025.10.02',
  ingredients: [
    {
      name: '무',
      recipes: [
        { id: 1, title: '무나물', views: 1204, image: '' },
        { id: 2, title: '뭇국', views: 980, image: '' },
        { id: 3, title: '무조림', views: 742, image: '' },
      ],
    },
    {
      name: '배추',
      recipes: [
        { id: 4, title: '배추전', views: 1510, image: '' },
        { id: 5, title: '배춧국', views: 833, image: '' },
        { id: 6, title: '겉절이', views: 645, image: '' },
      ],
    },
    {
      name: '대파',
      recipes: [
        { id: 7, title: '파전', views: 2041, image: '' },
        { id: 8, title: '파김치', views: 712, image: '' },
        { id: 9, title: '대파볶음', views: 508, image: '' },
      ],
    },
  ],
}
</script>

<style scoped>
.cdetail__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}
.cdetail__title {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-1);
}
.cdetail__meta {
  font-size: var(--text-sm);
}
.cdetail__actions {
  display: flex;
  gap: var(--space-2);
  flex-shrink: 0;
}

.cdetail__chips {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}

.cdetail__groups {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
</style>