<template>
  <section class="hero">
    <div class="container hero__inner">
      <div class="hero__copy">
        <h1 class="hero__title">오늘 어떤 요리를<br class="hero__break" /> 시작해볼까요?</h1>
        <p class="hero__subtitle">
          냉장고에 남은 재료만 알려주면, 근사한 한 끼가 완성됩니다.
        </p>

        <form
          class="hero__search"
          :class="{ 'is-focused': searchFocused }"
          role="search"
          @submit.prevent="submitSearch"
        >
          <IconSearch :size="20" class="hero__search-icon" />
          <input
            v-model="keyword"
            type="search"
            class="hero__search-input"
            placeholder="재료, 요리명 검색 (예: 김치, 제육볶음)"
            aria-label="레시피 검색"
            @focus="searchFocused = true"
            @blur="searchFocused = false"
          />
          <button type="submit" class="btn btn--primary hero__search-btn">검색</button>
        </form>

        <div class="hero__actions">
          <RouterLink to="/fridge" class="btn btn--primary">
            <IconFridge :size="18" /> 냉장고 파먹기
          </RouterLink>
          <RouterLink to="/recipes" class="btn btn--outline">
            전체 레시피 보기 <IconArrowRight :size="16" />
          </RouterLink>
        </div>
      </div>

      <div class="hero__visual">
        <div class="hero__blob" aria-hidden="true"></div>
        <img class="hero__photo" :src="topRecipeImage" :alt="topRecipeName" />
        <p class="hero__photo-tag"><IconFlame :size="14" /> 지금 많이 만드는 메뉴 · {{ topRecipeName }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { IconSearch, IconFridge, IconArrowRight, IconFlame } from '@tabler/icons-vue'
import recipeBanner from '@/assets/recipeBanner.png'

const router = useRouter()
const searchFocused = ref(false)

// 부모(HomeView)로부터 검색어 값과 1위 인기 레시피를 받기 위한 props
const props = defineProps({
  modelValue: { type: String, default: '' },
  topRecipe: { type: Object, default: null }, // { rcp_nm, att_file_no_main, ... } 1위 인기 레시피
})
// 검색어가 바뀌면 부모에게 알리기 위한 emit
const emit = defineEmits(['update:modelValue'])

// keyword를 v-model처럼 쓰되, 실제 값은 부모(HomeView)의 heroKeyword가 소유
// get: 부모 값을 읽어서 보여줌 / set: 입력하면 부모에게 변경사항을 emit
const keyword = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

// 인기 레시피 로딩 전에는 배너 이미지를 임시로 보여줌
const topRecipeImage = computed(() => props.topRecipe?.att_file_no_main || recipeBanner)
const topRecipeName = computed(() => props.topRecipe?.rcp_nm || '새콤한 연어샐러드')

function submitSearch() {
  router.push({ path: '/recipes', query: keyword.value ? { keyword: keyword.value } : {} })
}
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  background: linear-gradient(160deg, var(--terracotta-50) 0%, var(--surface-page) 55%);
}

.hero__inner {
  position: relative;
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  align-items: center;
  gap: var(--space-8);
  padding-block: var(--space-8);
}
@media (max-width: 900px) {
  .hero__inner { grid-template-columns: 1fr; gap: var(--space-6); padding-block: var(--space-6); }
}

.hero__copy {
  animation: hero-rise 0.6s var(--ease) both;
}
@media (prefers-reduced-motion: reduce) {
  .hero__copy { animation: none; }
}
@keyframes hero-rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}

.hero__title {
  font-size: clamp(2rem, 4vw, 2.75rem);
  font-weight: var(--weight-bold);
  letter-spacing: -0.02em;
  line-height: var(--leading-tight);
  color: var(--text-primary);
  max-width: 14ch;
  margin-bottom: var(--space-3);
}
.hero__break { display: none; }
@media (min-width: 480px) { .hero__break { display: inline; } }

.hero__subtitle {
  font-size: var(--text-base);
  color: var(--text-secondary);
  max-width: 42ch;
  margin-bottom: var(--space-5);
}

.hero__search {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  max-width: 480px;
  padding: var(--space-2);
  padding-left: var(--space-4);
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-md);
  margin-bottom: var(--space-4);
  outline: 2px solid transparent;
  outline-offset: 2px;
  transition: outline-color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease);
}
.hero__search.is-focused { outline-color: var(--accent); border-color: var(--accent); }
.hero__search-icon { color: var(--text-muted); flex-shrink: 0; }
.hero__search-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--text-primary);
  font-size: var(--text-sm);
}
.hero__search-input:focus { outline: none; }
.hero__search-input::placeholder { color: var(--text-muted); }
.hero__search-btn { border-radius: var(--radius-pill); flex-shrink: 0; }

.hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
}

.hero__visual {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 280px;
}
.hero__blob {
  position: absolute;
  width: 78%;
  aspect-ratio: 1;
  background: var(--terracotta-100);
  border-radius: 50%;
}
.hero__photo {
  position: relative;
  z-index: 1;
  width: 88%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: var(--radius-lg);
  border: 6px solid var(--surface-card);
  box-shadow: var(--shadow-lg);
  transform: rotate(-2deg);
}
.hero__photo-tag {
  position: absolute;
  z-index: 2;
  right: 4%;
  bottom: 6%;
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  background: var(--surface-card);
  color: var(--accent-text);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-md);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
}
@media (max-width: 900px) {
  .hero__visual { min-height: 220px; margin-top: var(--space-2); }
  .hero__photo { transform: none; }
}
</style>
