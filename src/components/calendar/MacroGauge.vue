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
  carbs: { type: Number, required: true },
  // carbs: 탄수화물 양. 숫자 타입, 부모가 넘겨줘야 함(필수)
  protein: { type: Number, required: true },
  // protein: 단밸질 양. 숫자 타입이며 필수
  fat: { type: Number, required: true },
  // 지방양
})

const total = computed(() => 
    props.carbs + props.protein + props.fat
)


const chartData = computed(() => ({
  // chartData: Doughnut 컴포넌트에 실제로 넘겨줄 데이터 형태를 만드는 계산된 값
  datasets: [
    // datasets: 차트에 그릴 데이터 묶음 (배열 형태로 여러 개 지정 가능하나 여기선 1개)
    {
      data: [props.carbs, props.protein, props.fat],
      // 도넛의 세 조각: [채워진 비율, 안 채워진 비율(나머지)]
      backgroundColor: ['#f97316', '#22c55e', '#3b82f6'], // --accent, --surface-tertiary 색상값에 맞게 조정
      
      borderWidth: 0,
      // 조각 사이 테두리 두께를 0으로 설정 (테두리 없이 매끄럽게)
    },
  ],
}))

const chartOptions = {
  // chartOptions: 차트의 생김새/동작을 설정하는 옵션 객체 (반응형일 필요 없어 computed 아닌 일반 객체)
  cutout: '50%',
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
  <div class="macro-gauge">
    <!-- 도넛 차트와 가운데 텍스트를 겹쳐서 보여줄 바깥 컨테이너 -->
    <Doughnut :data="chartData" :options="chartOptions" />
    <!-- 실제 도넛 차트를 그리는 부분, 위에서 만든 데이터와 옵션을 그대로 전달 -->
    <div class="macro-gauge__label">
    </div>
  </div>
</template>

<style scoped>
.macro-gauge {
  position: relative;
  width: 72px;
  height: 72px;
  margin-inline: 0;
}
.macro-gauge canvas {
  width: 72px !important;
  height: 72px !important;
}

.macro-gauge__label {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
}

.macro-gauge__value {
  font-size: var(--text-sm);
  font-weight: var(--weight-bold);
  color: var(--text-primary);
  line-height: 1.2;
}
</style>