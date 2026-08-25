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
    <nav class="pagination" aria-label="페이지 이동">
      <button class="pagination__btn" :disabled="page === 1" @click="page--">‹</button>
      <button
        v-for="p in totalPages"
        :key="p"
        class="pagination__btn"
        :class="{ 'is-active': page === p }"
        @click="page = p"
      >
        {{ p }}
      </button>
      <button class="pagination__btn" :disabled="page === totalPages" @click="page++">›</button>
    </nav>
  </AdminPanel>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminPanel from '@/components/admin/AdminPanel.vue'

const router = useRouter()
const page = ref(1)
const totalPages = 3

function goDetail(id) {
  router.push(`/admin/curations/${id}`)
}

// 목업 데이터 (FR-211 API 연동 시 교체)
const curations = computed(() => [
  { id: 3, title: '가을 뿌리채소 밥상', yearMonth: '2025.10', registeredAt: '10.02' },
  { id: 2, title: '환절기 보양 큐레이션', yearMonth: '2025.09', registeredAt: '09.01' },
  { id: 1, title: '여름 제철 채소 모음', yearMonth: '2025.08', registeredAt: '08.03' },
])
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

/* 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  gap: var(--space-2);
  margin-top: var(--space-5);
}
.pagination__btn {
  min-width: 36px;
  height: 36px;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-card);
  color: var(--text-secondary);
  transition:
    border-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}
.pagination__btn:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}
.pagination__btn.is-active {
  border-color: var(--accent);
  color: var(--accent);
  font-weight: var(--weight-bold);
}
.pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>