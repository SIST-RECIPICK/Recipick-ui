<template>
  <div class="detail container">
    <div class="detail__layout">
      <!-- ===== 좌: 본문 ===== -->
      <div class="detail__main">
        <!-- 대표 이미지 -->
        <img
          class="detail__hero"
          :src="recipe.image"
          :alt="`${recipe.title} 완성 대표 이미지`"
        />

        <!-- 음식명 + 작성자 -->
        <div class="detail__head">
          <h1 class="detail__title">{{ recipe.title }}</h1>
          <div class="detail__author">
            <span class="chip chip--accent">{{ recipe.badge }}</span>
            <span class="detail__chef">{{ recipe.chef }}</span>
            <button class="btn btn--outline detail__follow">
              레시피 매료 문의하기
            </button>
          </div>
          <div class="detail__tags">
            <span v-for="tag in recipe.tags" :key="tag" class="chip"># {{ tag }}</span>
          </div>
        </div>

        <!-- 앵커 탭 (③번 결정: 같은 페이지 스크롤) -->
        <nav class="detail__tabs" aria-label="상세 항목 이동">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            class="detail__tab"
            :class="{ 'is-active': activeTab === tab.id }"
            @click="scrollTo(tab.id)"
          >
            {{ tab.label }}
          </button>
        </nav>

        <!-- 만드는 법 -->
        <section :id="tabs[0].id" ref="stepsSection" class="detail__section">
          <h2 class="detail__section-title">만드는 법</h2>
          <ol class="steps">
            <li v-for="(step, i) in recipe.steps" :key="i" class="steps__item">
              <img
                v-if="step.image"
                class="steps__image"
                :src="step.image"
                :alt="`순서 ${i + 1} 이미지`"
                loading="lazy"
              />
              <div v-else class="steps__image steps__image--empty" aria-hidden="true">
                순서 이미지
              </div>
              <p class="steps__text">
                <span class="steps__num">{{ i + 1 }}.</span>
                {{ step.text }}
              </p>
            </li>
          </ol>
        </section>

        <!-- 연관 레시피 (②번 결정: 가로 스크롤 캐러셀) -->
        <section :id="tabs[1].id" ref="relatedSection" class="detail__section">
          <h2 class="detail__section-title">연관 레시피</h2>
          <div class="related">
            <RecipeCard
              v-for="r in relatedRecipes"
              :key="r.id"
              :recipe="r"
              class="related__item"
            />
          </div>
        </section>

        <!-- 후기 -->
        <section :id="tabs[2].id" ref="reviewsSection" class="detail__section">
          <h2 class="detail__section-title">후기 ({{ reviews.length }})</h2>
          <div class="reviews">
            <RecipeReviewCard
              v-for="review in reviews"
              :key="review.id"
              :review="review"
            />
          </div>
        </section>
      </div>

      <!-- ===== 우: sticky 사이드바 (①번 결정) ===== -->
      <aside class="detail__aside">
        <IngredientPanel
          :ingredients="recipe.ingredients"
          :cooking="recipe.cooking"
          :nutrition="recipe.nutrition"
          :base-servings="1"
        />
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import RecipeCard from '@/components/recipe/RecipeCard.vue'
import IngredientPanel from '@/components/recipe/IngredientPanel.vue'
import RecipeReviewCard from '@/components/recipe/RecipeReviewCard.vue'

// 탭 정의 (앵커 id 한 곳에서 관리)
const tabs = [
  { id: 'steps', label: '만드는 법' },
  { id: 'related', label: '연관 레시피' },
  { id: 'reviews', label: '후기' },
]

const activeTab = ref('steps')
const stepsSection = ref(null)
const relatedSection = ref(null)
const reviewsSection = ref(null)

// 탭 클릭 → 해당 섹션으로 부드럽게 스크롤
function scrollTo(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// 스크롤 위치에 따라 활성 탭 자동 갱신 (IntersectionObserver)
let observer = null
onMounted(() => {
  const sections = [stepsSection.value, relatedSection.value, reviewsSection.value].filter(Boolean)
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) activeTab.value = entry.target.id
      }
    },
    // 헤더(64px) 아래를 기준선으로
    { rootMargin: '-40% 0px -55% 0px' }
  )
  sections.forEach((el) => observer.observe(el))
})
onUnmounted(() => observer?.disconnect())

// --- 아래는 목업 데이터 (API 연동 시 교체, FR-2xx) ---
const recipe = {
  title: '음식명(레시피명)',
  chef: '쉐프명',
  badge: '오늘의 레시피',
  image: '',
  tags: ['태그', '태그', '태그'],
  steps: [
    { image: '', text: '고구마는 깨끗이 씻어서 껍질을 벗기고 4cm 정도로 잘라준다.' },
    { image: '', text: '찜기에 고구마를 넣고 20~30분 정도 삶아 주고, 블렌더나 체를 이용하여 잘 으깨어 곱게 만든다.' },
  ],
  ingredients: [
    { name: '재료명', amount: 200 },
    { name: '재료명', amount: 200 },
    { name: '재료명', amount: 200 },
    { name: '재료명', amount: 200 },
    { name: '재료명', amount: 200 },
    { name: '재료명', amount: 200 },
  ],
  cooking: { type: '요리 종류', method: '조리 방법' },
  nutrition: [
    { value: '205', label: '열량' },
    { value: '35g', label: '탄수화물' },
    { value: '3g', label: '단백질' },
    { value: '6g', label: '지방' },
    { value: '68mg', label: '나트륨' },
  ],
}

const relatedRecipes = [
  { id: 1, title: '레시피 제목', chef: '쉐프명', image: '', views: '1.2천', cookTime: '30분', category: '반찬' },
  { id: 2, title: '레시피 제목', chef: '쉐프명', image: '', views: '1.2천', cookTime: '30분', category: '반찬' },
  { id: 3, title: '레시피 제목', chef: '쉐프명', image: '', views: '1.2천', cookTime: '30분', category: '반찬' },
]

const reviews = [
  { id: 1, title: '후기 제목', content: '후기 내용 간략하게 (…로 말줄임 가능)', image: '' },
  { id: 2, title: '후기 제목', content: '후기 내용 간략하게 (…로 말줄임 가능)', image: '' },
  { id: 3, title: '후기 제목', content: '후기 내용 간략하게 (…로 말줄임 가능)', image: '' },
  { id: 4, title: '후기 제목', content: '후기 내용 간략하게 (…로 말줄임 가능)', image: '' },
]
</script>

<style scoped>
.detail {
  padding-block: var(--space-6);
}

/* 2단 레이아웃 */
.detail__layout {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: var(--space-8);
  align-items: start;
}

/* ----- 좌: 본문 ----- */
.detail__hero {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-lg);
  background: var(--surface-sunken);
}

.detail__head {
  margin-top: var(--space-5);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.detail__title { font-size: var(--text-2xl); }
.detail__author {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-wrap: wrap;
}
.detail__chef { font-weight: var(--weight-medium); }
.detail__follow {
  font-size: var(--text-xs);
  padding: var(--space-1) var(--space-3);
}
.detail__tags { display: flex; gap: var(--space-2); }

/* 앵커 탭 */
.detail__tabs {
  display: flex;
  gap: var(--space-6);
  margin-top: var(--space-6);
  border-bottom: 1px solid var(--border);
  /* 헤더 아래에 붙어 따라오도록 */
  position: sticky;
  top: var(--header-height);
  background: var(--surface-page);
  z-index: 10;
}
.detail__tab {
  padding: var(--space-3) 0;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-size: var(--text-base);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
}
.detail__tab:hover { color: var(--text-primary); }
.detail__tab.is-active {
  color: var(--text-primary);
  font-weight: var(--weight-bold);
  border-bottom-color: var(--accent);
}

/* 섹션 */
.detail__section {
  padding-top: var(--space-6);
  /* 앵커 스크롤 시 sticky 탭에 가리지 않도록 여백 확보 */
  scroll-margin-top: calc(var(--header-height) + 56px);
}
.detail__section-title {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-4);
}

/* 만드는 법 */
.steps {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
}
.steps__item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: var(--space-4);
  align-items: start;
}
.steps__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-md);
  background: var(--surface-sunken);
}
.steps__image--empty {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-size: var(--text-sm);
}
.steps__text {
  line-height: var(--leading-normal);
  padding-top: var(--space-2);
}
.steps__num {
  font-weight: var(--weight-bold);
  margin-right: var(--space-1);
}

/* 연관 레시피 — 가로 스크롤 */
.related {
  display: flex;
  gap: var(--space-4);
  overflow-x: auto;
  padding-bottom: var(--space-2);
  scrollbar-width: thin;
  scroll-snap-type: x mandatory;
}
.related__item {
  flex: 0 0 260px;
  scroll-snap-align: start;
}

/* 후기 — 2열 리스트 */
.reviews {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-5);
}

/* ----- 우: sticky 사이드바 ----- */
.detail__aside {
  position: sticky;
  top: calc(var(--header-height) + var(--space-4));
}

/* 반응형: 1024px 이하는 1단 */
@media (max-width: 1024px) {
  .detail__layout { grid-template-columns: 1fr; }
  .detail__aside { position: static; }
}
@media (max-width: 640px) {
  .steps__item { grid-template-columns: 1fr; }
  .reviews { grid-template-columns: 1fr; }
}
</style>
