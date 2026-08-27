<template>
  <div class="donut" role="img" :aria-label="`${have}/${total} 재료 보유`">
    <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
      <!-- 배경 원 -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="'var(--border)'"
        :stroke-width="stroke"
      />
      <!-- 진행 원 -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="radius"
        fill="none"
        :stroke="'var(--accent)'"
        :stroke-width="stroke"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
        :transform="`rotate(-90 ${size / 2} ${size / 2})`"
      />
    </svg>
    <span class="donut__label">{{ have }}/{{ total }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  have: { type: Number, required: true },
  total: { type: Number, required: true },
  size: { type: Number, default: 56 },
  stroke: { type: Number, default: 5 },
})

const radius = computed(() => (props.size - props.stroke) / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => {
  const ratio = props.total ? props.have / props.total : 0
  return circumference.value * (1 - ratio)
})
</script>

<style scoped>
.donut {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.donut svg {
  transition: stroke-dashoffset var(--dur-base) var(--ease);
}
.donut__label {
  position: absolute;
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
}
</style>
