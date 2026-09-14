<script setup>
import { computed } from 'vue'
// computed: 다른 값(props)을 기반으로 자동 계산되는 값을 만들기 위해 가져옴
import { Doughnut } from 'vue-chartjs'
// vue-chartjs 라이브러리에서 도넛(원형) 차트 컴포넌트를 가져옴
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js'
// chart.js 본체(ChartJS)와, 도넛/파이 차트를 그리는 데 필요한 ArcElement, 툴팁 기능(Tooltip)을 가져옴

ChartJS.register(ArcElement, Tooltip)
// Chart.js는 쓰려는 기능(요소)을 미리 등록해야 동작함 — 여기서 ArcElement, Tooltip을 사용 가능하게 등록

const props = defineProps({
  filledCount: { type: Number, required: true },
  // filledCount: 채운 끼니 개수. 숫자 타입이며 반드시 부모가 넘겨줘야 함(필수)
  totalSlots: { type: Number, required: true },
  // totalSlots: 이번 달 전체 슬롯 개수. 숫자 타입이며 필수
})

const fillRate = computed(() => {
  // fillRate: totalSlots 대비 filledCount의 비율(퍼센트)을 자동 계산하는 값
  if (!props.totalSlots) return 0
  // totalSlots가 0이거나 없으면 나눗셈 에러(0으로 나누기) 방지를 위해 0을 반환
  return (props.filledCount / props.totalSlots) * 100
  // 채운 개수를 전체 개수로 나누고 100을 곱해 퍼센트 값으로 변환
})

const chartData = computed(() => ({
  // chartData: Doughnut 컴포넌트에 실제로 넘겨줄 데이터 형태를 만드는 계산된 값
  datasets: [
    // datasets: 차트에 그릴 데이터 묶음 (배열 형태로 여러 개 지정 가능하나 여기선 1개)
    {
      data: [fillRate.value, 100 - fillRate.value],
      // 도넛의 두 조각: [채워진 비율, 안 채워진 비율(나머지)]
      backgroundColor: ['#f97316', '#e5e7eb'], // --accent, --surface-tertiary 색상값에 맞게 조정
      // 각 조각의 색상: 첫 번째는 채워진 부분(강조색), 두 번째는 빈 부분(연한 회색)
      borderWidth: 0,
      // 조각 사이 테두리 두께를 0으로 설정 (테두리 없이 매끄럽게)
    },
  ],
}))

const chartOptions = {
  // chartOptions: 차트의 생김새/동작을 설정하는 옵션 객체 (반응형일 필요 없어 computed 아닌 일반 객체)
  cutout: '70%',
  // 도넛 가운데 구멍의 크기를 전체의 70%로 설정 (숫자 넣을 공간 확보)
  plugins: { tooltip: { enabled: false } },
  // 마우스 올렸을 때 나오는 툴팁(설명 박스)을 비활성화
  responsive: true,
  // 화면 크기가 바뀌면 차트 크기도 자동으로 반응하게 설정
  maintainAspectRatio: true,
  // 차트의 가로세로 비율을 고정 유지하도록 설정
}
</script>

<template>
  <div class="fill-rate-gauge">
    <!-- 도넛 차트와 가운데 텍스트를 겹쳐서 보여줄 바깥 컨테이너 -->
    <Doughnut :data="chartData" :options="chartOptions" />
    <!-- 실제 도넛 차트를 그리는 부분, 위에서 만든 데이터와 옵션을 그대로 전달 -->
    <div class="fill-rate-gauge__label">
      <!-- 도넛 가운데 뚫린 공간에 텍스트를 얹기 위한 레이어 -->
      <span class="fill-rate-gauge__value">{{ filledCount }}/{{ totalSlots }}</span>
      <!-- 채운 끼니 수와 전체 슬롯 수를 "N/M" 형태로 표시 -->
      <span class="fill-rate-gauge__unit">끼니</span>
      <!-- 단위 텍스트 "끼니" 표시 -->
    </div>
  </div>
</template>

<style scoped>
.fill-rate-gauge {
  position: relative;
  width: 72px;
  height: 72px;
  margin-inline: auto;
}

.fill-rate-gauge__label {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.fill-rate-gauge__value {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
  line-height: 1.2;
}

.fill-rate-gauge__unit {
  font-size: 10px;
  color: var(--text-secondary);
}
</style>