<template>
  <AdminPanel>
    <div class="clist__head">
      <p class="clist__caption">이달의 제철 음식 큐레이션</p>
      <RouterLink to="/admin/curations/new" class="btn btn--primary"> + 등록 </RouterLink>
    </div>

    <table class="clist__table">
      <thead>
        <tr>
          <th class="clist__col-no">번호</th>
          <th>제목</th>
          <th class="clist__col-ym">년/월</th>
          <th class="clist__col-date">등록일</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in curations" :key="item.id" class="clist__row" @click="goDetail(item.id)">
          <td>{{ item.id }}</td>
          <td class="clist__title">{{ item.title }}</td>
          <td>{{ item.yearMonth }}</td>
          <td>{{ item.registeredAt }}</td>
        </tr>
      </tbody>
    </table>

    <!-- 페이지네이션 -->
    <Pagination
      class="list__pagination"
      :curpage="page.curpage"
      :startpage="page.startpage"
      :endpage="page.endpage"
      :totalpage="page.totalpage"
      @change="loadCuration"
    />

  </AdminPanel>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AdminPanel from '@/components/admin/AdminPanel.vue'
import Pagination from '@/components/common/Pagination.vue'

const router = useRouter()

function goDetail(id) {
  router.push(`/admin/curations/${id}`)
}

// 목업 데이터 (FR-211 API 연동 시 교체)
const curations = computed(() => [
  { id: 3, title: '가을 뿌리채소 밥상', yearMonth: '2025.10', registeredAt: '10.02' },
  { id: 2, title: '환절기 보양 큐레이션', yearMonth: '2025.09', registeredAt: '09.01' },
  { id: 1, title: '여름 제철 채소 모음', yearMonth: '2025.08', registeredAt: '08.03' },
])

const page = ref({
  curpage: 1,
  startpage: 1,
  endpage: 1,
  totalpage: 1,
})

async function loadCuration(curpage = 1) {
  // TODO: 실제 API 호출로 교체
  // const res = await api.getMembers(curpage)
  // members.value = res.list
  // page.value = {
  //   curpage: res.curpage,
  //   startpage: res.startpage,
  //   endpage: res.endpage,
  //   totalpage: res.totalpage,
  // }
  page.value = { curpage, startpage: 1, endpage: 3, totalpage: 3 }
}

onMounted(()=>{
  loadCuration(1)
})

</script>

<style scoped>
.clist__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}
.clist__caption {
  font-weight: var(--weight-medium);
}

/* 테이블 */
.clist__table {
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid var(--border-strong);
}
.clist__table th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--border);
}
.clist__table td {
  padding: var(--space-4);
  border-bottom: 1px solid var(--border);
}
.clist__col-no {
  width: 80px;
}
.clist__col-ym {
  width: 120px;
}
.clist__col-date {
  width: 100px;
}

.clist__row {
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease);
}
.clist__row:hover {
  background: var(--surface-sunken);
}
.clist__title {
  font-weight: var(--weight-bold);
  color: var(--accent);
}

/* 페이지네이션 여백 */
.list__pagination { margin-top: var(--space-6); }

</style>