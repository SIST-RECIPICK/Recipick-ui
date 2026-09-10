<template>
  <section class="seasonal">
    <div class="seasonal__head">
      <h2 class="seasonal__title">{{ month }}월 제철 재료</h2>
    </div>
    <ul class="seasonal__grid">
      <li v-for="item in items" :key="item.id" class="seasonal-card">
        <span class="seasonal-card__icon" :style="{ background: item.tint, color: item.color }">
          <component :is="item.icon" :size="24" />
        </span>
        <p class="seasonal-card__name">{{ item.name }}</p>
        <span class="chip" :class="item.trend === 'up' ? 'chip--danger' : 'chip--success'">
          {{ item.trend === 'up' ? '가격 상승' : '가격 하락' }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup>
defineProps({
  month: { type: Number, required: true },
  items: { type: Array, required: true }, // { id, name, icon, color, tint, trend }
})
</script>

<style scoped>
.seasonal__head { margin-bottom: var(--space-4); }
.seasonal__title { font-size: var(--text-xl); font-weight: var(--weight-bold); }

.seasonal__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-4);
}
@media (max-width: 768px) { .seasonal__grid { grid-template-columns: repeat(2, 1fr); } }

.seasonal-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-5) var(--space-3);
  text-align: center;
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  transition: border-color var(--dur-base) var(--ease);
}
.seasonal-card:hover { border-color: var(--border-strong); }

.seasonal-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
}
.seasonal-card__name {
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
}
</style>
