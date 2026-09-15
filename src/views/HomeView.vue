<template>
  <div class="landing">
    <HeroSearch v-model="heroKeyword" :top-recipe="popularRecipes[0]" />

    <div class="container landing__sections">
      <!-- 오늘의 인기 레시피 -->
      <section class="landing__block">
        <div class="section-head">
          <h2 class="section-title">지금 가장 많이 만드는 레시피</h2>
          <RouterLink to="/recipes" class="section-link">
            전체보기 <IconArrowRight :size="16" />
          </RouterLink>
        </div>
        <div class="landing__grid">
          <div v-for="(recipe, i) in popularRecipes" :key="recipe.rcp_seq" class="landing__rank-card">
            <span class="landing__rank" :class="{ 'landing__rank--top': i === 0 }">{{ i + 1 }}위</span>
            <RecipeCard :recipe="recipe" @tag-click="fillHeroKeyword" />
          </div>
        </div>
      </section>

      <!-- 내 냉장고 속 맞춤 레시피 -->
      <section class="landing__block">
        <FridgeMatch :ingredients="fridgeIngredients" :matches="fridgeMatches" />
      </section>

      <!-- 이번 주 식단표 -->
      <section class="landing__block">
        <WeeklyDietPreview :days="weeklyDiet" />
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { RouterLink } from 'vue-router'
import { IconArrowRight, IconBowlChopsticks, IconSoup, IconSalad } from '@tabler/icons-vue'

import HeroSearch from '@/components/home/HeroSearch.vue'
import RecipeCard from '@/components/recipe/RecipeCard.vue'
import FridgeMatch from '@/components/home/FridgeMatch.vue'
import WeeklyDietPreview from '@/components/home/WeeklyDietPreview.vue'

// 오늘의 인기 레시피 (조회수 상위 4개, 실 API)
const popularRecipes = ref([])

// 히어로 검색창의 검색어 상태 (HeroSearch와 v-model로 연결)
const heroKeyword = ref('')

// 인기 레시피 카드의 해시태그 클릭 시: 히어로 검색창에 값만 채움 (검색 실행은 안 함)
function fillHeroKeyword(tag) {
  heroKeyword.value = tag
}

// 내 냉장고 속 맞춤 레시피 (mock)
const fridgeIngredients = ['밥', '당근', '계란', '김치', '대파']
const fridgeMatches = [
  { id: 11, title: '계란볶음밥', icon: IconBowlChopsticks, matchLabel: '재료 4/5 보유' },
  { id: 12, title: '감자조림', icon: IconSoup, matchLabel: '재료 3/5 보유' },
  { id: 13, title: '김치무침', icon: IconSalad, matchLabel: '재료 5/5 보유' },
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

onMounted(async () => {
  // 조회수(hit) 기준 정렬된 레시피 목록에서 상위 4개만 노출
  const res = await axios.get('http://localhost:8080/recipe/list', {
    params: {
      page: 1,
      sort: 'hit',
    },
  })
  popularRecipes.value = res.data.list.slice(0, 4)
})
</script>

<style scoped>
.landing__sections { padding-block: var(--space-6); }

.landing__block { margin-bottom: var(--space-8); }
.landing__block:last-child { margin-bottom: 0; }

.landing__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}
@media (max-width: 992px) { .landing__grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .landing__grid { grid-template-columns: repeat(2, 1fr); } }

.landing__rank-card { position: relative; height: 100%; }
.landing__rank {
  position: absolute;
  top: var(--space-2);
  left: var(--space-2);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 26px;
  padding-inline: var(--space-2);
  border-radius: var(--radius-pill);
  background: var(--surface-inverse);
  color: var(--text-on-inverse);
  font-size: var(--text-xs);
  font-weight: var(--weight-bold);
}
.landing__rank--top { background: var(--accent); }
</style>
