<template>
  <nav class="pagination" aria-label="페이지 이동">
    <!-- 이전 페이지 -->
    <button
      class="pagination__btn"
      :disabled="curpage === 1"
      @click="go(curpage - 1)"
    >
      <span class="sr-only">이전 페이지</span>
      <IconChevronLeft :size="16" />
    </button>

    <!-- 페이지 번호 -->
    <button
      v-for="page in pageList"
      :key="page"
      class="pagination__btn"
      :class="{ 'is-active': page === curpage }"
      :aria-current="page === curpage ? 'page' : undefined"
      @click="go(page)"
    >
      {{ page }}
    </button>

    <!-- 다음 페이지 -->
    <button
      class="pagination__btn"
      :disabled="curpage === totalpage"
      @click="go(curpage + 1)"
    >
      <span class="sr-only">다음 페이지</span>
      <IconChevronRight :size="16" />
    </button>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-vue'

const props = defineProps({
  curpage: { type: Number, required: true },    // 현재 페이지
  startpage: { type: Number, required: true },  // 화면에 보이는 첫 번째 번호
  endpage: { type: Number, required: true },    // 화면에 보이는 마지막 번호
  totalpage: { type: Number, required: true },  // 전체 페이지 수
})

const emit = defineEmits(['change'])

// startpage부터 endpage까지 번호 배열 만들기
const pageList = computed(() => {
  const list = []
  for (let i = props.startpage; i <= props.endpage; i++) {
    list.push(i)
  }
  return list
})

// 페이지 버튼 클릭 시
function go(page) {
  if (page < 1 || page > props.totalpage || page === props.curpage) return
  emit('change', page)
}
</script>