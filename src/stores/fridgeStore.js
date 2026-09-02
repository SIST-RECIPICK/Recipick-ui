import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  fetchIngredients,
  fetchMyFridge,
  saveMyFridge,
  fetchFridgeMatches,
} from '@/api/fridge-api'

/**
 * 냉장고 상태 스토어.
 *
 * 역할 분담:
 * - store        : 여러 화면이 공유하는 "냉장고 데이터" (재료 마스터, 담긴 재료, 매칭 결과)
 * - 컴포넌트 로컬 : 그 화면에서만 쓰는 UI 상태 (검색어, 정렬 토글, 열린 카테고리 탭 등)
 *
 * API 호출은 이 스토어의 action → @/api/fridge 의 함수로만 나간다.
 * (컴포넌트에서 직접 fetch 하지 않는다)
 */
export const useFridgeStore = defineStore('fridge', () => {
  // ── state ──
  const ingredients = ref([])      // 재료 마스터 [{ id, name, category }]
  const myFridgeIds = ref([])      // 냉장고에 담긴 재료 id 목록
  const recipes = ref([])          // 매칭 결과 레시피
  const totalCount = ref(0)        // 매칭 결과 총 개수
  const loading = ref(false)       // 매칭 조회 로딩

  // ── getters ──
  // 담긴 재료를 마스터에서 찾아 객체로
  const myIngredients = computed(() =>
    ingredients.value.filter((ing) => myFridgeIds.value.includes(ing.id))
  )
  // 매칭 조회에 넘길 재료 표준명 목록
  const myIngredientNames = computed(() => myIngredients.value.map((i) => i.name))

  // ── actions ──

  // 재료 마스터 로드 (등록 화면 진입 시)
  async function loadIngredients() {
    if (ingredients.value.length) return // 이미 로드됐으면 skip
    ingredients.value = await fetchIngredients()
  }

  // 내 냉장고 로드 (앱/화면 진입 시)
  async function loadMyFridge() {
    myFridgeIds.value = await fetchMyFridge()
  }

  // 냉장고 저장 (등록 화면에서 저장)
  async function saveFridge(ids) {
    await saveMyFridge(ids)
    myFridgeIds.value = [...ids]
  }

  // 매칭 레시피 조회 (냉장고 파먹기 화면)
  async function loadMatches(ingredientNames, sort = 'match') {
    loading.value = true
    try {
      const res = await fetchFridgeMatches({ ingredientNames, sort })
      recipes.value = res.recipes
      totalCount.value = res.totalCount
    } finally {
      loading.value = false
    }
  }

  return {
    // state
    ingredients, myFridgeIds, recipes, totalCount, loading,
    // getters
    myIngredients, myIngredientNames,
    // actions
    loadIngredients, loadMyFridge, saveFridge, loadMatches,
  }
})