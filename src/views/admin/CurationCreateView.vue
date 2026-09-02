<template>
  <AdminPanel>
    <!-- 1. 연/월 선택 + AI 추천 -->
    <div class="step">
      <div class="step__label"><span class="step__num">1</span> 년 / 월 선택 후 재료 추천</div>
      <div class="step__row">
        <select v-model="form.year" class="input step__select">
          <option v-for="y in years" :key="y" :value="y">{{ y }}년</option>
        </select>
        <select v-model="form.month" class="input step__select">
          <option v-for="m in 12" :key="m" :value="m">{{ m }}월</option>
        </select>
        <button class="btn btn--outline step__ai" :disabled="generating" @click="handleGenerate">
          {{ generating ? '추천 중…' : 'AI로 제철 재료 받기' }}
        </button>
      </div>
    </div>

    <!-- 2. 추천 재료 중 3개 선택 -->
    <div v-if="suggested.length" class="step">
      <div class="step__label"><span class="step__num">2</span> 추천 재료 중 3개 선택</div>
      <div class="chip-select">
        <button
          v-for="ing in suggested"
          :key="ing"
          class="chip-select__item"
          :class="{ 'is-selected': selected.includes(ing) }"
          :disabled="!selected.includes(ing) && selected.length >= 3"
          @click="toggle(ing)"
        >
          {{ ing }}
          <IconX v-if="selected.includes(ing)" :size="14" />
        </button>
      </div>
      <p class="step__count text-muted">
        {{ selected.length }} / 3 선택됨 · 선택 완료 시 자동으로 레시피 조회
      </p>
    </div>

    <!-- 3. 재료별 조회수 상위 3개 자동 조회 (미리보기) -->
    <div v-if="preview.length" class="step">
      <div class="step__label">
        <span class="step__num">3</span> 재료별 조회수 상위 3개 자동 조회 (미리보기)
      </div>
      <div class="step__groups">
        <CurationGroup
          v-for="group in preview"
          :key="group.name"
          :ingredient="group.name"
          :recipes="group.recipes"
        />
      </div>
    </div>

    <!-- 4. 제목 입력 + 저장 -->
    <div v-if="preview.length" class="step">
      <div class="step__label"><span class="step__num">4</span> 제목 입력 후 저장</div>
      <input
        v-model.trim="form.title"
        class="input"
        type="text"
        placeholder="큐레이션 제목을 입력하세요"
      />
    </div>

    <!-- 하단 버튼 -->
    <div class="ccreate__foot">
      <RouterLink to="/admin/curations" class="btn btn--outline">취소</RouterLink>
      <button class="btn btn--primary" :disabled="!canSave || saving" @click="handleSave">
        저장
      </button>
    </div>
  </AdminPanel>
</template>

<script setup>
import { reactive, ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import AdminPanel from '@/components/admin/AdminPanel.vue'
import CurationGroup from '@/components/admin/CurationGroup.vue'
import { IconX } from '@tabler/icons-vue'

const router = useRouter()

const now = new Date()
const years = Array.from({ length: 5 }, (_, i) => now.getFullYear() - i)

const form = reactive({
  year: now.getFullYear(),
  month: now.getMonth() + 1,
  title: '',
})

const generating = ref(false)
const saving = ref(false)
const suggested = ref([])
const selected = ref([])
const preview = ref([])

const canSave = computed(() => selected.value.length === 3 && form.title && preview.value.length)

// 1. AI 재료 추천 (FR-221 연동 지점)
async function handleGenerate() {
  generating.value = true
  selected.value = []
  preview.value = []
  try {
    // TODO: AI 제철 재료 추천 API 호출
    suggested.value = ['무', '배추', '대파', '당근', '시금치', '굴', '고구마']
  } finally {
    generating.value = false
  }
}

// 2. 재료 3개 선택
function toggle(ing) {
  const i = selected.value.indexOf(ing)
  if (i >= 0) selected.value.splice(i, 1)
  else if (selected.value.length < 3) selected.value.push(ing)
}

// 3. 3개 선택 완료 시 자동으로 레시피 조회 (미리보기)
watch(
  selected,
  async (val) => {
    if (val.length === 3) {
      // TODO: 재료별 조회수 상위 3개 레시피 조회 API
      preview.value = val.map((name) => ({
        name,
        recipes: mockRecipes(name),
      }))
    } else {
      preview.value = []
    }
  },
  { deep: true },
)

function mockRecipes(name) {
  const table = {
    무: [
      { id: 1, title: '무나물', views: 1204 },
      { id: 2, title: '뭇국', views: 980 },
      { id: 3, title: '무조림', views: 742 },
    ],
  }
  return (
    table[name] || [
      { id: 0, title: `${name} 레시피 1`, views: 900 },
      { id: 0, title: `${name} 레시피 2`, views: 600 },
      { id: 0, title: `${name} 레시피 3`, views: 300 },
    ]
  ).map((r) => ({ ...r, image: '' }))
}

// 4. 저장 (FR-221)
async function handleSave() {
  saving.value = true
  try {
    // TODO: 큐레이션 저장 API (스냅샷 방식으로 레시피 함께 저장)
    router.push('/admin/curations')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
/* 단계 */
.step {
  margin-bottom: var(--space-6);
}
.step__label {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: var(--weight-bold);
  margin-bottom: var(--space-3);
}
.step__num {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: var(--text-on-accent);
  font-size: var(--text-xs);
}
.step__row {
  display: flex;
  gap: var(--space-3);
}
.step__select {
  flex: 1;
}
.step__ai {
  flex-shrink: 0;
  white-space: nowrap;
}
.step__count {
  font-size: var(--text-sm);
  margin-top: var(--space-2);
}
.step__groups {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* 재료 선택 칩 */
.chip-select {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding: var(--space-4);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
}
.chip-select__item {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-sm);
  background: var(--surface-card);
  color: var(--text-secondary);
  font-size: var(--text-sm);
  transition:
    border-color var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}
.chip-select__item:hover:not(:disabled) {
  border-color: var(--accent);
  color: var(--accent);
}
.chip-select__item.is-selected {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-subtle);
}
.chip-select__item:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 하단 버튼 */
.ccreate__foot {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
  padding-top: var(--space-5);
  border-top: 1px solid var(--border);
}
</style>