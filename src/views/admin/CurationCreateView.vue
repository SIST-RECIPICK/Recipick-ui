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
          :key="ing.id"
          class="chip-select__item"
          :class="{ 'is-selected': selected.includes(ing.id) }"
          :disabled="!selected.includes(ing.id) && selected.length >= 3"
          @click="toggle(ing.id)"
        >
          {{ ing.ingredient_name }}
          <IconX v-if="selected.includes(ing.id)" :size="14" />
        </button>
      </div>
      <p class="step__count text-muted">
        {{ selected.length }} / 3 선택됨
      </p>
    </div>

    <!-- 3. 재료별 조회수 상위 3개 자동 조회 (미리보기) -->
    <div v-if="preview.length" class="step">
      <div class="step__label">
        <span class="step__num">3</span> 재료별 조회수 상위 3개 조회
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
      <div class="step__label"><span class="step__num">4</span> 제목</div>
      <input
        v-model.trim="form.title"
        class="input"
        type="text"
        :placeholder="loading ? '제목이 추천되는 중입니다..':'큐레이션 제목을 입력하세요'"
        :disabled="loading"
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
// toRaw 반응형 프록시 객체를 자바스크립트 배열로 변환할 때 사용 하는 것
import { reactive, ref, computed, watch, toRaw} from 'vue'
import { useRouter } from 'vue-router'
import AdminPanel from '@/components/admin/AdminPanel.vue'
import CurationGroup from '@/components/admin/CurationGroup.vue'
import { IconX } from '@tabler/icons-vue'
import axios from 'axios'

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
const loading = ref(false)

const canSave = computed(() => selected.value.length === 3 && form.title && preview.value.length)

// 1. AI 재료 추천
async function handleGenerate() {
  generating.value = true
  selected.value = []
  preview.value = []
  try {
    await axios.get('http://localhost:8080/admin/curation/recommend',{
      params:{
        year:form.year,
        month:form.month
      }
    }).then((response)=>{
      suggested.value = response.data
    }).catch((error)=>{
      console.error('재료 추천 실패', error)
    })
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

// 3. 3개 선택 완료 시 자동으로 레시피 조회
watch(
  selected,
  async (val) => {
    if (val.length === 3) {
      
      const names = val.map((id)=>{
        const found = suggested.value.find((ing) => ing.id === id)
        return found.ingredient_name
      })
      
      const rawArray = toRaw(val);
      
      try {
        const response = await axios.get('http://localhost:8080/admin/curation/recipeTop3',{
          params:{
            ids: rawArray.join(',')
          }
        })
        const data = response.data
        preview.value = Object.keys(data).map((name) => ({
          name,
          recipes: data[name],
        }))

        loading.value = true
        try {
          const title = await axios.get('http://localhost:8080/admin/curation/title/recommend',{
            params:{
              month:form.month,
              ids: names.join(',')
            }
          })
          form.title = title.data
        } catch (error) {
          console.error('제목 조회 실패', error)
        } finally {
          loading.value = false
        }

      } catch (error) {
        console.error('레시피 조회 실패', error)
      } 
      
    } else {
      preview.value = []
    }
  },
  { deep: true },
)

function buildPayload(){
  const details = []
  let order = 1

  preview.value.forEach((group)=>{
    const matched = suggested.value.find((ing) => ing.ingredient_name === group.name )
    const ingredientId = matched ? matched.id : null

    group.recipes.forEach((r)=>{
      details.push({
        ingredient_id:ingredientId,
        rcp_seq: r.rcp_seq,
        sort_order: order++
      })
    })
  })

  return {
    year:form.year,
    month:form.month,
    title:form.title,
    details
  }
}
// 4. 저장
async function handleSave() {
  saving.value = true

  try {
    const payload = buildPayload()
    await axios.post('http://localhost:8080/admin/curation', payload)
    router.push('/admin/curations')
    
  } catch (error){
    console.error('저장에 실패하였습니다. 잠시 후 다시 시도해주세요', error)
  } 
  finally {
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