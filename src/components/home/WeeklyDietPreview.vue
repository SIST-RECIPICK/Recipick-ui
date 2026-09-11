<template>
  <section class="diet card">
    <div class="section-head diet__head">
      <h2 class="section-title diet__title">
        <IconCalendarWeek :size="20" /> 이번 주 식단표
      </h2>
      <RouterLink to="/meal-plan" class="btn btn--outline diet__edit">
        <IconPencil :size="16" /> 식단 수정
      </RouterLink>
    </div>

    <div class="diet__table-wrap">
      <table class="diet__table">
        <thead>
          <tr>
            <th scope="col" class="diet__corner"></th>
            <th
              v-for="day in days"
              :key="day.label"
              scope="col"
              :class="{ 'is-today': day.label === todayLabel }"
            >
              {{ day.label }}
              <span v-if="day.label === todayLabel" class="diet__today-badge">오늘</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="meal in mealTypes" :key="meal.key">
            <th scope="row">{{ meal.label }}</th>
            <td
              v-for="day in days"
              :key="day.label + meal.key"
              :class="{ 'is-today': day.label === todayLabel }"
            >
              {{ day[meal.key] || '-' }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { IconPencil, IconCalendarWeek } from '@tabler/icons-vue'

defineProps({
  days: { type: Array, required: true }, // { label, breakfast, lunch, dinner }
})

const mealTypes = [
  { key: 'breakfast', label: '아침' },
  { key: 'lunch', label: '점심' },
  { key: 'dinner', label: '저녁' },
]

const dayLabels = ['일', '월', '화', '수', '목', '금', '토']
const todayLabel = computed(() => dayLabels[new Date().getDay()])
</script>

<style scoped>
.diet { padding: var(--space-5); }

.diet__title {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}

.diet__table-wrap {
  overflow-x: auto;
  -webkit-mask-image: linear-gradient(to right, #000 calc(100% - var(--space-6)), transparent);
  mask-image: linear-gradient(to right, #000 calc(100% - var(--space-6)), transparent);
}
@media (min-width: 640px) {
  .diet__table-wrap { -webkit-mask-image: none; mask-image: none; }
}

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
  transition: background var(--dur-base) var(--ease);
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

.diet__table th.is-today,
.diet__table td.is-today {
  background: var(--accent-subtle);
}
.diet__table thead th.is-today {
  color: var(--accent-text);
  font-weight: var(--weight-bold);
}
.diet__today-badge {
  display: block;
  margin-top: 2px;
  color: var(--accent-text);
  font-size: 10px;
  font-weight: var(--weight-bold);
}
</style>
