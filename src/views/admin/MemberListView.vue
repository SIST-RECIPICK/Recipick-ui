<template>
  <AdminPanel>
    <p class="mlist__caption">회원관리</p>

    <table class="mlist__table">
      <thead>
        <tr>
          <th>회원명</th>
          <th>회원아이디</th>
          <th class="mlist__col-date">가입일</th>
          <th class="mlist__col-select">회원상태</th>
          <th class="mlist__col-select">권한</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="member in members" :key="member.id">
          <td class="mlist__name">{{ member.name }}</td>
          <td class="text-secondary">{{ member.username }}</td>
          <td class="text-secondary">{{ member.joinedAt }}</td>

          <td>
            <select
              v-model="member.status"
              class="cell-select"
              :class="statusClass(member.status)"
              :disabled="member.saving"
              @change="updateStatus(member)"
            >
              <option v-for="opt in statusOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </td>

          <td>
            <select
              v-model="member.role"
              class="cell-select"
              :class="{ 'cell-select--accent': member.role === 'ADMIN' }"
              :disabled="member.saving"
              @change="updateRole(member)"
            >
              <option v-for="opt in roleOptions" :key="opt.value" :value="opt.value">
                {{ opt.label }}
              </option>
            </select>
          </td>
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
      @change="loadMembers"
    />
  </AdminPanel>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminPanel from '@/components/admin/AdminPanel.vue'
import Pagination from '@/components/common/Pagination.vue'

const statusOptions = [
  { value: 'ACTIVE', label: '활성' },
  { value: 'SUSPENDED', label: '정지' },
  { value: 'WITHDRAWN', label: '탈퇴' },
]
const roleOptions = [
  { value: 'USER', label: '일반' },
  { value: 'ADMIN', label: '관리자' },
]

function statusClass(status) {
  return {
    'cell-select--danger': status === 'SUSPENDED',
    'cell-select--muted': status === 'WITHDRAWN',
  }
}

async function updateStatus(member) {
  member.saving = true
  try {
    // TODO: 회원상태 변경 API 호출 (PATCH /admin/members/:id/status)
  } finally {
    member.saving = false
  }
}

async function updateRole(member) {
  member.saving = true
  try {
    // TODO: 권한 변경 API 호출 (PATCH /admin/members/:id/role)
  } finally {
    member.saving = false
  }
}

// 회원 목록
const members = ref([])

const page = ref({
  curpage: 1,
  startpage: 1,
  endpage: 1,
  totalpage: 1,
})

async function loadMembers(curpage = 1) {
  // TODO: 실제 API 호출로 교체
  // const res = await api.getMembers(curpage)
  // members.value = res.list
  // page.value = {
  //   curpage: res.curpage,
  //   startpage: res.startpage,
  //   endpage: res.endpage,
  //   totalpage: res.totalpage,
  // }

  members.value = [
    { id: 1, name: '김레시', username: 'recipe_kim', joinedAt: '2025.03.12', status: 'ACTIVE', role: 'USER', saving: false },
    { id: 2, name: '박요리', username: 'cook_park', joinedAt: '2025.05.28', status: 'ACTIVE', role: 'ADMIN', saving: false },
    { id: 3, name: '이식단', username: 'meal_lee', joinedAt: '2025.07.03', status: 'SUSPENDED', role: 'USER', saving: false },
    { id: 4, name: '최반찬', username: 'banchan_choi', joinedAt: '2025.08.19', status: 'WITHDRAWN', role: 'USER', saving: false },
  ]
  page.value = { curpage, startpage: 1, endpage: 3, totalpage: 3 }
}

// 화면 처음 뜰 때 1페이지 조회
onMounted(() => {
  loadMembers(1)
})
</script>

<style scoped>
.mlist__caption {
  font-weight: var(--weight-medium);
  margin-bottom: var(--space-4);
}

.mlist__table {
  width: 100%;
  border-collapse: collapse;
  border-top: 1px solid var(--border-strong);
}
.mlist__table th {
  padding: var(--space-3) var(--space-4);
  text-align: left;
  font-size: var(--text-sm);
  font-weight: var(--weight-medium);
  color: var(--text-secondary);
  background: var(--surface-sunken);
  border-bottom: 1px solid var(--border);
}
.mlist__table td {
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.mlist__name { font-weight: var(--weight-medium); }
.mlist__col-date { width: 130px; }
.mlist__col-select { width: 120px; }

.cell-select {
  width: 100%;
  height: 34px;
  padding: 0 var(--space-2);
  background: var(--surface-card);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-primary);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: border-color var(--dur-fast) var(--ease);
}
.cell-select:hover { border-color: var(--border-strong); }
.cell-select:focus {
  outline: none;
  border-color: var(--accent);
}
.cell-select:disabled {
  opacity: 0.5;
  cursor: wait;
}

.cell-select--accent { color: var(--accent-text); font-weight: var(--weight-medium); }
.cell-select--danger { color: var(--danger); }
.cell-select--muted { color: var(--text-muted); }

/* 페이지네이션 여백 */
.list__pagination { margin-top: var(--space-6); }

@media (max-width: 768px) {
  .mlist__table { display: block; overflow-x: auto; white-space: nowrap; }
}
</style>