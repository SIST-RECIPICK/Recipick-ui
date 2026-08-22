import { ref, watch, onUnmounted } from 'vue'

/**
 * 숫자 카운트업 애니메이션
 * target 값까지 duration 동안 부드럽게 증가.
 * @param {import('vue').Ref<number>|number} target - 목표 숫자
 * @param {number} duration - 애니메이션 시간(ms)
 * @returns { display } - 화면에 뿌릴 반응형 숫자(정수)
 */
export function useCountUp(target, duration = 1200) {
  const display = ref(0)
  let rafId = null
  const targetRef = ref(typeof target === 'object' ? target.value : target)

  function run(to) {
    cancelAnimationFrame(rafId)
    const from = 0
    const start = performance.now()

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3)
      display.value = Math.round(from + (to - from) * eased)
      if (progress < 1) rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)
  }

  // target이 ref면 변화 감지, 아니면 즉시 실행
  if (typeof target === 'object') {
    watch(target, (v) => run(v), { immediate: true })
  } else {
    run(target)
  }

  onUnmounted(() => cancelAnimationFrame(rafId))

  return { display }
}
