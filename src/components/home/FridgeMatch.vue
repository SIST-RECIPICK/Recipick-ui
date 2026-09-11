<template>
  <section class="fridge-match">
    <div class="fridge-match__info">
      <h2 class="fridge-match__title">내 냉장고 속 맞춤 레시피</h2>
      <p class="fridge-match__desc">
        지금 냉장고에 있는 재료를 등록하면, 바로 만들 수 있는 레시피를 찾아드려요.
      </p>
      <ul class="fridge-match__ingredients">
        <li v-for="item in ingredients" :key="item" class="chip">{{ item }}</li>
      </ul>
      <RouterLink to="/fridge" class="btn btn--outline fridge-match__cta">
        <IconFridge :size="18" /> 재료 관리하기
      </RouterLink>
    </div>

    <ul class="fridge-match__matches">
      <li v-for="match in matches" :key="match.id" class="match-card">
        <RouterLink :to="`/recipes/${match.id}`" class="match-card__link">
          <span class="match-card__icon">
            <component :is="match.icon" :size="22" />
          </span>
          <span class="match-card__title">{{ match.title }}</span>
          <span class="chip chip--success match-card__tag">{{ match.matchLabel }}</span>
        </RouterLink>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { IconFridge } from '@tabler/icons-vue'

defineProps({
  ingredients: { type: Array, required: true }, // string[]
  matches: { type: Array, required: true }, // { id, title, icon, matchLabel }
})
</script>

<style scoped>
.fridge-match {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: var(--space-6);
  align-items: center;
  padding: var(--space-6);
  background: var(--accent-subtle);
  border: 1px solid var(--terracotta-100);
  border-radius: var(--radius-lg);
}
@media (max-width: 768px) {
  .fridge-match { grid-template-columns: 1fr; padding: var(--space-5); }
}

.fridge-match__title {
  font-size: var(--text-xl);
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-2);
}
.fridge-match__desc {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-4);
  max-width: 42ch;
}
.fridge-match__ingredients {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-bottom: var(--space-5);
}
.fridge-match__ingredients .chip { background: var(--surface-card); }

.fridge-match__cta { background: var(--surface-card); }

.fridge-match__matches {
  display: grid;
  gap: var(--space-3);
}
.match-card {
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  transition: border-color var(--dur-base) var(--ease);
}
.match-card:hover { border-color: var(--accent); }
.match-card__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  color: var(--text-primary);
}
.match-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 50%;
  background: var(--accent-subtle);
  color: var(--accent-text);
}
.match-card__title {
  flex: 1;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.match-card__tag { flex-shrink: 0; }
</style>
