<template>
  <div
    class="hero-slider"
    @mouseenter="stop"
    @mouseleave="start"
  >
    <!-- 슬라이드들 (겹쳐두고 활성만 opacity로 노출) -->
    <div
      v-for="(slide, i) in slides"
      :key="slide.id"
      class="hero-slider__slide"
      :class="{ 'is-active': i === current }"
      :style="{ backgroundImage: slide.image ? `url(${slide.image})` : undefined }"
      role="button"
      :tabindex="i === current ? 0 : -1"
      @click="openSlide(slide)"
      @keyup.enter="openSlide(slide)"
    >
      <div class="hero-slider__scrim"></div>
      <div class="hero-slider__caption">
        <p v-if="slide.tag" class="hero-slider__tag">{{ slide.tag }}</p>
        <h2 class="hero-slider__title">{{ slide.title }}</h2>
        <p v-if="slide.subtitle" class="hero-slider__subtitle">{{ slide.subtitle }}</p>
      </div>
    </div>

    <!-- 화살표 -->
    <button class="hero-slider__arrow hero-slider__arrow--prev" aria-label="이전 슬라이드" @click.stop="prev">
      <IconChevronLeft :size="20" />
    </button>
    <button class="hero-slider__arrow hero-slider__arrow--next" aria-label="다음 슬라이드" @click.stop="next">
      <IconChevronRight :size="20" />
    </button>

    <!-- 인디케이터 -->
    <div class="hero-slider__dots">
      <button
        v-for="(slide, i) in slides"
        :key="slide.id"
        class="hero-slider__dot"
        :class="{ 'is-active': i === current }"
        :aria-label="`${i + 1}번 슬라이드로 이동`"
        :aria-current="i === current ? 'true' : undefined"
        @click="goTo(i)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'

const props = defineProps({
  slides: { type: Array, required: true },
  interval: { type: Number, default: 4000 }, // 자동 전환 간격(ms)
})
const router = useRouter()

const current = ref(0)
let timer = null

function next() {
  current.value = (current.value + 1) % props.slides.length
}
function prev() {
  current.value = (current.value - 1 + props.slides.length) % props.slides.length
}
function goTo(i) {
  current.value = i
}

function start() {
  stop()
  if (props.slides.length > 1) timer = setInterval(next, props.interval)
}
function stop() {
  if (timer) { clearInterval(timer); timer = null }
}

function openSlide(slide) {
  if (slide.to) router.push(slide.to)
}

onMounted(start)
onUnmounted(stop)
</script>

<style scoped>
.hero-slider {
  position: relative;
  height: 320px;
  border-radius: 16px;
  overflow: hidden;
  background: var(--surface-sunken);
}
@media (max-width: 768px) { .hero-slider { height: 240px; } }

.hero-slider__slide {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  opacity: 0;
  transition: opacity 0.6s var(--ease);
  cursor: pointer;
}
.hero-slider__slide.is-active { opacity: 1; }
/* 이미지 없을 때 기본 배경 (테라코타 그라디언트) */
.hero-slider__slide:not([style*='url']) {
  background: linear-gradient(120deg, var(--terracotta-500), var(--terracotta-300));
}

.hero-slider__scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(28, 20, 15, 0.6), transparent 55%);
}

.hero-slider__caption {
  position: absolute;
  left: var(--space-5);
  bottom: var(--space-5);
  right: var(--space-8);
  color: #fff;
}
.hero-slider__tag {
  font-size: var(--text-xs);
  opacity: 0.9;
  margin-bottom: var(--space-1);
}
.hero-slider__title {
  font-size: var(--text-2xl);
  font-weight: var(--weight-bold);
  color: #fff;
  margin-bottom: var(--space-1);
}
.hero-slider__subtitle {
  font-size: var(--text-sm);
  opacity: 0.85;
}

.hero-slider__arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.85);
  color: var(--neutral-900);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background var(--dur-fast) var(--ease);
}
.hero-slider__arrow:hover { background: #fff; }
.hero-slider__arrow--prev { left: var(--space-3); }
.hero-slider__arrow--next { right: var(--space-3); }

.hero-slider__dots {
  position: absolute;
  bottom: var(--space-3);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-1);
}
.hero-slider__dot {
  width: 6px;
  height: 6px;
  border-radius: var(--radius-pill);
  border: none;
  background: rgba(255, 255, 255, 0.5);
  padding: 0;
  transition: width var(--dur-base) var(--ease), background var(--dur-base) var(--ease);
}
.hero-slider__dot.is-active {
  width: 22px;
  background: #fff;
}
</style>
