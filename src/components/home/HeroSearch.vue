<template>
  <section class="hero">
    <div class="hero__glow" aria-hidden="true"></div>
    <div class="container hero__inner">
      <p class="hero__badge">
        <IconChefHat :size="14" /> 냉장고에서 시작하는 요리
      </p>
      <h1 class="hero__title">오늘 어떤 요리를<br class="hero__break" /> 시작해볼까요?</h1>
      <p class="hero__subtitle">
        냉장고에 남은 재료만 알려주면, 근사한 한 끼가 완성됩니다.
      </p>

      <form class="hero__search" role="search" @submit.prevent="submitSearch">
        <IconSearch :size="20" class="hero__search-icon" />
        <input
          v-model="keyword"
          type="search"
          class="hero__search-input"
          placeholder="재료, 요리명 검색 (예: 김치, 제육볶음)"
          aria-label="레시피 검색"
        />
        <button type="submit" class="btn btn--primary hero__search-btn">검색</button>
      </form>

      <div class="hero__actions">
        <RouterLink to="/fridge" class="hero__cta hero__cta--solid">
          <IconFridge :size="18" /> 냉장고 파먹기
        </RouterLink>
        <RouterLink to="/recipes" class="hero__cta hero__cta--outline">
          전체 레시피 보기 <IconArrowRight :size="16" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { RouterLink } from 'vue-router'
import { IconSearch, IconFridge, IconArrowRight, IconChefHat } from '@tabler/icons-vue'
import recipeBanner from '@/assets/recipeBanner.png'

const router = useRouter()

// 부모(HomeView)로부터 검색어 값을 받기 위한 props
const props = defineProps({
  modelValue: { type: String, default: '' }
})
// 검색어가 바뀌면 부모에게 알리기 위한 emit
const emit = defineEmits(['update:modelValue'])

// keyword를 v-model처럼 쓰되, 실제 값은 부모(HomeView)의 heroKeyword가 소유
// get: 부모 값을 읽어서 보여줌 / set: 입력하면 부모에게 변경사항을 emit
const keyword = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})
const heroImage = `url(${recipeBanner})`

function submitSearch() {
  router.push({ path: '/recipes', query: keyword.value ? { keyword: keyword.value } : {} })
}
</script>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  background: v-bind(heroImage) center 65% / cover no-repeat, var(--neutral-900);
  color: var(--text-on-inverse);
}

.hero__glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    100deg,
    rgba(18, 13, 10, 0.94) 0%,
    rgba(18, 13, 10, 0.82) 32%,
    rgba(18, 13, 10, 0.5) 58%,
    rgba(18, 13, 10, 0.22) 100%
  );
  pointer-events: none;
}

.hero__inner {
  position: relative;
  padding-block: var(--space-8) var(--space-8);
  max-width: 640px;
}
@media (max-width: 768px) {
  .hero__inner { padding-block: var(--space-6); }
}

.hero__badge {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  margin-bottom: var(--space-4);
  border-radius: var(--radius-pill);
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.16);
  backdrop-filter: blur(8px);
  color: var(--terracotta-200);
  font-size: var(--text-xs);
  font-weight: var(--weight-medium);
}

.hero__title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: var(--weight-bold);
  letter-spacing: -0.02em;
  line-height: var(--leading-tight);
  margin-bottom: var(--space-3);
}
.hero__break { display: none; }
@media (min-width: 480px) { .hero__break { display: inline; } }

.hero__subtitle {
  font-size: var(--text-base);
  color: rgba(255, 255, 255, 0.72);
  margin-bottom: var(--space-5);
}

.hero__search {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  max-width: 480px;
  padding: var(--space-2);
  padding-left: var(--space-4);
  background: #fff;
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-lg);
  margin-bottom: var(--space-4);
}
.hero__search-icon { color: var(--text-muted); flex-shrink: 0; }
.hero__search-input {
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--neutral-900);
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
.hero__cta {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-pill);
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  transition: background var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}
.hero__cta--solid {
  background: rgba(255, 255, 255, 0.94);
  color: var(--neutral-900);
}
.hero__cta--solid:hover { background: #fff; color: var(--neutral-900); }
.hero__cta--outline {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.35);
  color: #fff;
}
.hero__cta--outline:hover { border-color: var(--terracotta-300); color: var(--terracotta-200); }
</style>
