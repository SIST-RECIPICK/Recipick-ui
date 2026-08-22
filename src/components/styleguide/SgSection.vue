<script setup>
/**
 * 스타일가이드 섹션 래퍼.
 * 제목 + 설명 + (미리보기 슬롯) + (코드 슬롯) 구조를 통일.
 */
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <section class="sg-section">
    <div class="sg-section__head">
      <h2 class="sg-section__title">{{ title }}</h2>
      <p v-if="description" class="sg-section__desc">{{ description }}</p>
    </div>

    <!-- 미리보기 -->
    <div v-if="$slots.preview" class="sg-section__preview">
      <slot name="preview" />
    </div>

    <!-- 코드 -->
    <div v-if="$slots.code" class="sg-section__code">
      <slot name="code" />
    </div>

    <!-- 자유 영역 -->
    <slot />
  </section>
</template>

<style scoped>
.sg-section {
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: var(--space-5);
  margin-bottom: var(--space-5);
}
.sg-section__head { margin-bottom: var(--space-4); }
.sg-section__title {
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-1);
}
.sg-section__desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
.sg-section__preview {
  padding: var(--space-4);
  background: var(--surface-page);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  margin-bottom: var(--space-3);
}
</style>
