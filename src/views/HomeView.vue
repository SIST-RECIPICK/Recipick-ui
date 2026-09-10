<template>
  <div class="landing">
    <HeroSearch />

    <div class="container landing__sections">
      <!-- 오늘의 인기 레시피 -->
      <section class="landing__block">
        <div class="landing__section-head">
          <h2 class="landing__section-title">오늘의 인기 레시피</h2>
          <RouterLink to="/recipes" class="landing__more">
            전체보기 <IconArrowRight :size="16" />
          </RouterLink>
        </div>
        <div class="landing__grid">
          <PopularRecipeCard v-for="recipe in popularRecipes" :key="recipe.id" :recipe="recipe" />
        </div>
      </section>

      <!-- 내 냉장고 속 맞춤 레시피 -->
      <section class="landing__block">
        <FridgeMatch :ingredients="fridgeIngredients" :matches="fridgeMatches" />
      </section>

      <!-- 제철 재료 -->
      <section class="landing__block">
        <SeasonalIngredients :month="8" :items="seasonalItems" />
      </section>

      <!-- 이번 주 식단표 -->
      <section class="landing__block">
        <WeeklyDietPreview :days="weeklyDiet" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import {
  IconArrowRight,
  IconBowlChopsticks,
  IconSoup,
  IconSalad,
  IconGrape,
  IconFish,
  IconMushroom,
  IconPepper,
} from '@tabler/icons-vue'

import HeroSearch from '@/components/home/HeroSearch.vue'
import PopularRecipeCard from '@/components/home/PopularRecipeCard.vue'
import FridgeMatch from '@/components/home/FridgeMatch.vue'
import SeasonalIngredients from '@/components/home/SeasonalIngredients.vue'
import WeeklyDietPreview from '@/components/home/WeeklyDietPreview.vue'

// 오늘의 인기 레시피 (mock)
const popularRecipes = [
  {
    id: 1,
    title: '돼지고기 김치찜',
    image: '',
    rating: 4.8,
    reviews: 204,
    cookTime: '25분',
    category: '찌개',
  },
  {
    id: 2,
    title: '알알한 소불고기',
    image: '',
    rating: 4.6,
    reviews: 131,
    cookTime: '30분',
    category: '메인',
  },
  {
    id: 3,
    title: '바삭한 야채튀김',
    image: '',
    rating: 4.5,
    reviews: 89,
    cookTime: '20분',
    category: '간식',
  },
  {
    id: 4,
    title: '불향가득 제육볶음',
    image: '',
    rating: 4.7,
    reviews: 160,
    cookTime: '25분',
    category: '메인',
  },
]

// 내 냉장고 속 맞춤 레시피 (mock)
const fridgeIngredients = ['밥', '당근', '계란', '김치', '대파']
const fridgeMatches = [
  { id: 11, title: '계란볶음밥', icon: IconBowlChopsticks, matchLabel: '재료 4/5 보유' },
  { id: 12, title: '감자조림', icon: IconSoup, matchLabel: '재료 3/5 보유' },
  { id: 13, title: '김치무침', icon: IconSalad, matchLabel: '재료 5/5 보유' },
]

// 8월 제철 재료 (mock)
const seasonalItems = [
  { id: 1, name: '포도', icon: IconGrape, color: 'var(--accent-text)', tint: 'var(--accent-subtle)', trend: 'down' },
  { id: 2, name: '고등어', icon: IconFish, color: 'var(--info)', tint: 'var(--info-bg)', trend: 'up' },
  { id: 3, name: '버섯', icon: IconMushroom, color: 'var(--warning)', tint: 'var(--warning-bg)', trend: 'down' },
  { id: 4, name: '고추', icon: IconPepper, color: 'var(--danger)', tint: 'var(--danger-bg)', trend: 'up' },
]

// 이번 주 식단표 (mock)
const weeklyDiet = [
  { label: '월', breakfast: '계란말이', lunch: '된장찌개', dinner: '제육볶음' },
  { label: '화', breakfast: '토스트', lunch: '비빔밥', dinner: '닭볶음탕' },
  { label: '수', breakfast: '요거트', lunch: '김치찌개', dinner: '고등어구이' },
  { label: '목', breakfast: '누룽지', lunch: '샐러드', dinner: '소불고기' },
  { label: '금', breakfast: '계란후라이', lunch: '떡볶이', dinner: '삼겹살구이' },
  { label: '토', breakfast: '시리얼', lunch: '잔치국수', dinner: '치킨' },
  { label: '일', breakfast: '과일', lunch: '외식', dinner: '집밥' },
]
</script>

<style scoped>
.landing__sections { padding-block: var(--space-6); }

.landing__block { margin-bottom: var(--space-8); }
.landing__block:last-child { margin-bottom: 0; }

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
</style>
