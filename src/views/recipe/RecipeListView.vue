<template>
  <div class="home container">
    <!-- 히어로 -->
    <section class="home__hero">
      <p class="home__hero-text">
        오늘 뭐 해먹지?<br>
        <span class="home__count">{{ heroText }}</span>개의 맛있는 레시피가 준비되어 있어요.
      </p>
    </section>

    <!-- 검색 -->
    <section class="home__search">
      <div class="search-box">
        <input
          v-model="keyword"
          class="search-box__input"
          type="search"
          placeholder="레시피 검색 입력란"
          @keyup.enter="loadRecipes"
        />
        <button class="search-box__btn" aria-label="검색" @click="loadRecipes">
          <IconSearch :size="20" />
        </button>
      </div>
    </section>

    <!-- 카테고리 -->
    <section class="home__categories">
      <CategoryCarousel
        v-model="activeCategory"
        :categories="categories"
        @update:model-value="loadRecipes"
      />
    </section>

    <!-- 목록 헤더: 총 개수 + 정렬 -->
    <div class="home__list-head">
      <span class="text-secondary">총 {{ totalCount.toLocaleString() }}개</span>
      <SortSelect v-model="sort" @update:model-value="loadRecipes" />
    </div>

    <!-- 그리드 -->
    <section class="home__grid">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </section>

    <!-- 페이지네이션 -->
    <div class="home__pagination">
      <Pagination
        v-model="page"
        :total-pages="totalPages"
        @update:model-value="loadRecipes"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCountUp } from '@/composables/useCountUp'
import {
  IconSearch, IconCategory, IconBowl, IconSoup, IconCake,
  IconBowlChopsticks, IconMeat, IconSalad,
} from '@tabler/icons-vue'

import CategoryCarousel from '@/components/recipe/CategoryCarousel.vue'
import SortSelect from '@/components/recipe/SortSelect.vue'
import Pagination from '@/components/common/Pagination.vue'
import RecipeCard from '@/components/recipe/RecipeCard.vue'

// --- 히어로 카운트업 (와이어프레임 "애니메이션 추가") ---
const totalCount = ref(1200)
const { display: countDisplay } = useCountUp(totalCount, 1200)

// --- 카테고리 ---
const categories = [
  { key: 'all', label: '전체', icon: IconCategory },
  { key: 'banchan', label: '반찬', icon: IconBowl },
  { key: 'soup', label: '국·찌개', icon: IconSoup },
  { key: 'dessert', label: '후식', icon: IconCake },
  { key: 'rice', label: '밥', icon: IconBowlChopsticks },
  { key: 'meat', label: '고기', icon: IconMeat },
  { key: 'salad', label: '샐러드', icon: IconSalad },
]
const activeCategory = ref('all')

// --- 검색 · 정렬 · 페이지 ---
const keyword = ref('')
const sort = ref('latest')
const page = ref(1)
const totalPages = ref(10)

// --- 더미 레시피 (실제로는 API 응답) ---
const recipes = ref(
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: '레시피 제목',
    chef: '쉐프명',
    image: '',              // 빈 값이면 카드가 플레이스홀더 표시
    views: '2.3만',
    cookTime: '20분',
    category: '국·찌개',
  }))
)

const heroText = computed(() => `${countDisplay.value.toLocaleString()}`)

// TODO: 카테고리/검색/정렬/페이지 변경 시 서버에서 목록 재조회
function loadRecipes() {
  // 예: GET /api/recipes?category=&keyword=&sort=&page=
}
</script>


<style scoped>
.home { padding-block: var(--space-6); }

.home__hero { text-align: center; margin-bottom: var(--space-5); }
.home__hero-text {
  font-size: var(--text-xl);
  font-weight: var(--weight-medium);
  color: var(--text-primary);
}
.home__count { color: var(--accent); font-weight: var(--weight-bold); }

.home__search { margin-bottom: var(--space-5); }
.search-box {
  display: flex;
  align-items: center;
  max-width: 560px;
  margin-inline: auto;
  background: var(--surface-sunken);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  padding-right: var(--space-2);
  transition: border-color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
}
.search-box:focus-within {
  background: var(--surface-card);
  border-color: var(--accent);
}
.search-box__input {
  flex: 1;
  height: 52px;
  padding: 0 var(--space-4);
  background: transparent;
  border: none;
  color: var(--text-primary);
}
.search-box__input:focus { outline: none; }
.search-box__input::placeholder { color: var(--text-muted); }
.search-box__btn {
  display: flex;
  padding: var(--space-2);
  background: transparent;
  border: none;
  color: var(--text-muted);
}
.search-box__btn:hover { color: var(--accent); }

.home__categories { margin-bottom: var(--space-6); }

.home__list-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
  font-size: var(--text-sm);
}

.home__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}
@media (max-width: 992px) { .home__grid { grid-template-columns: repeat(3, 1fr); } }
@media (max-width: 768px) { .home__grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 480px) { .home__grid { grid-template-columns: 1fr; } }

.home__pagination { margin-top: var(--space-6); }
</style>
