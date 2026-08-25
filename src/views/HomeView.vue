<template>
  <div class="landing container">
    <!-- 큐레이션 히어로 -->
    <section class="landing__curation">
      <p class="landing__section-label">이달의 제철 큐레이션</p>
      <CurationSlider :slides="curations" />
    </section>

    <!-- 추천 레시피 -->
    <section class="landing__recommended">
      <div class="landing__section-head">
        <h2 class="landing__section-title">이번 주 추천 레시피</h2>
        <RouterLink to="/recipes" class="landing__more">
          전체보기 <IconArrowRight :size="16" />
        </RouterLink>
      </div>
      <div class="landing__grid">
        <RecipeCard v-for="recipe in recommended" :key="recipe.id" :recipe="recipe" />
      </div>
    </section>

    <!-- 기능 바로가기 -->
    <section class="landing__shortcuts">
      <RouterLink
        v-for="item in shortcuts"
        :key="item.to"
        :to="item.to"
        class="shortcut card card--hoverable"
      >
        <component :is="item.icon" :size="26" class="shortcut__icon" />
        <p class="shortcut__title">{{ item.title }}</p>
        <p class="shortcut__desc">{{ item.desc }}</p>
      </RouterLink>
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { IconFridge, IconCalendar, IconMessageCircle, IconArrowRight } from '@tabler/icons-vue'

import CurationSlider from '@/components/home/CurationSlider.vue'
import RecipeCard from '@/components/recipe/RecipeCard.vue'

const curations = ref([
  {
    id: 1,
    tag: '8월 · 제철 재료',
    title: '여름 가지로 만드는 한 상',
    subtitle: 'AI가 고른 제철 재료 3가지 + 인기 레시피 9선',
    image: '', // 빈 값이면 테라코타 그라디언트 폴백
    to: '/curations/1',
  },
  {
    id: 2,
    tag: '8월 · 제철 재료',
    title: '옥수수로 즐기는 초여름 별미',
    subtitle: '달큰한 제철 옥수수 활용 레시피 모음',
    image: '',
    to: '/curations/2',
  },
  {
    id: 3,
    tag: '8월 · 제철 재료',
    title: '복숭아가 주인공인 디저트',
    subtitle: '지금 가장 맛있는 복숭아 레시피',
    image: '',
    to: '/curations/3',
  },
])

// 추천 레시피
const recommended = ref(
  Array.from({ length: 4 }, (_, i) => ({
    id: i + 1,
    title: '레시피 제목',
    chef: '쉐프명',
    image: '',
    views: '2.3만',
    cookTime: '20분',
    category: '반찬',
  }))
)

// 기능 바로가기
const shortcuts = [
  { icon: IconFridge, title: '냉장고 파먹기', desc: '있는 재료로 뚝딱', to: '/fridge' },
  { icon: IconCalendar, title: '식단관리', desc: '일주일 식단 짜기', to: '/meal-plan' },
  { icon: IconMessageCircle, title: '커뮤니티', desc: '요리 후기 나누기', to: '/community' },
]
</script>

<style scoped>
.landing { padding-block: var(--space-6); }

.landing__section-label {
  font-size: var(--text-xs);
  color: var(--text-muted);
  font-weight: var(--weight-medium);
  margin-bottom: var(--space-2);
}

.landing__curation { margin-bottom: var(--space-8); }

.landing__section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}
.landing__section-title {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
}
.landing__more {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-sm);
  color: var(--accent);
}

.landing__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}
@media (max-width: 992px) { .landing__grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .landing__grid { grid-template-columns: repeat(2, 1fr); } }

.landing__recommended { margin-bottom: var(--space-8); }

/* 기능 바로가기 */
.landing__shortcuts {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
}
@media (max-width: 768px) { .landing__shortcuts { grid-template-columns: 1fr; } }

.shortcut {
  padding: var(--space-5);
  color: var(--text-primary);
  display: block;
}
.shortcut:hover { color: var(--text-primary); }
.shortcut__icon { color: var(--accent); margin-bottom: var(--space-2); }
.shortcut__title {
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  margin-bottom: 2px;
}
.shortcut__desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
</style>