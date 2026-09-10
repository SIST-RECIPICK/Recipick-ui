<template>
  <section class="diet card">
    <div class="diet__head">
      <h2 class="diet__title">이번 주 식단표</h2>
      <RouterLink to="/meal-plan" class="btn btn--outline diet__edit">
        <IconPencil :size="16" /> 식단 수정
      </RouterLink>
    </div>

    <div class="diet__table-wrap">
      <table class="diet__table">
        <thead>
          <tr>
            <th scope="col" class="diet__corner"></th>
            <th v-for="day in days" :key="day.label" scope="col">{{ day.label }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="meal in mealTypes" :key="meal.key">
            <th scope="row">{{ meal.label }}</th>
            <td v-for="day in days" :key="day.label + meal.key">
              {{ day[meal.key] || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { IconPencil } from '@tabler/icons-vue'

defineProps({
  days: { type: Array, required: true }, // { label, breakfast, lunch, dinner }
})

const mealTypes = [
  { key: 'breakfast', label: '아침' },
  { key: 'lunch', label: '점심' },
  { key: 'dinner', label: '저녁' },
]
</script>

<style scoped>
.diet { padding: var(--space-5); }

.diet__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
}
.diet__title { font-size: var(--text-xl); font-weight: var(--weight-bold); }

.diet__table-wrap { overflow-x: auto; }

.diet__table {
  width: 100%;
  min-width: 640px;
  border-collapse: collapse;
  font-size: var(--text-sm);
}
.diet__table th,
.diet__table td {
  padding: var(--space-3);
  text-align: center;
  border-bottom: 1px solid var(--border);
}
.diet__table thead th {
  color: var(--text-secondary);
  font-weight: var(--weight-medium);
  font-size: var(--text-xs);
}
.diet__corner { width: 64px; }
.diet__table tbody th {
  color: var(--text-primary);
  font-weight: var(--weight-medium);
  text-align: left;
}
.diet__table tbody td {
  color: var(--text-secondary);
  font-variant-numeric: tabular-nums;
}
.diet__table tbody tr:last-child th,
.diet__table tbody tr:last-child td { border-bottom: none; }
</style>
