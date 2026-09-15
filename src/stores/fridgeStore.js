import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useFridgeStore = defineStore('fridge', () => {
  // ── state ──
  const ingredients = ref([])   // 재료 검색 결과 
  const myFridgeIds = ref([])   // 냉장고에 담긴 재료 id 목록
  const myFridgeData = ref([])
  const recipes = ref([])
  const totalCount = ref(0)
  const loading = ref(false)

  // ── getters ──
  const myIngredients = computed(() => myFridgeData.value)
const myIngredientNames = computed(() =>
  myIngredients.value.map((r) => r.ingredient?.ingredient_name).filter(Boolean)
)
  // ── actions ──

  // 재료 검색
  async function searchIngredients(keyword) {
    const res = await axios.get('http://localhost:8080/ingredients/list', {
      params: {
        keyword: keyword
      }
    })
    console.log(res.data)
    ingredients.value = res.data
  }

  // 내 냉장고 로드 (아직 백엔드 API 없음)
  async function loadMyFridge(user_id) {
  const res = await axios.get('http://localhost:8080/refrige/fridgedata', {
    params: { user_id: user_id }
  })
  console.log('내 냉장고 데이터:', res.data)
  myFridgeData.value = res.data                  // 통째로 저장 (추가)
  myFridgeIds.value = res.data.map((r) => r.ingredient_id)
}
  // 냉장고 저장 (아직 백엔드 API 없음)
  async function saveFridge(volist) {
    await axios.post('http://localhost:8080/refrige/register',volist)
  }
  
  // 매칭 레시피 조회 (아직 백엔드 API 없음)
  async function loadMatches(ingredientNames, sort = 'match') {
  loading.value = true
  try {
    const response = await axios.post('http://localhost:8080/refrige/recommand', {
      ingredients: ingredientNames
    })

    if (response.data.success) {
      recipes.value = response.data.recipes.map((r) => {
    const haveList = r.haveIngredients || []
    const missList = r.missingIngredients || []
    const total = haveList.length + missList.length

    return {
      id: r.id, // 실제 레시피 ID 사용
      title: r.recipeName,
      chef: r.foodType || '',
      image: r.recipeImage,
      matchCount: haveList.length,
      totalCount: total,
      ingredients: [
        ...haveList.map((name) => ({ name, have: true })),
        ...missList.map((name) => ({ name, have: false }))
      ]
    }
  })
      totalCount.value = recipes.value.length
    } else {
      recipes.value = []
      totalCount.value = 0
    }
  } catch (error) {
    console.error('레시피 매칭 실패:', error)
    recipes.value = []
    totalCount.value = 0
  } finally {
    loading.value = false
  }
}

  return {
    ingredients, myFridgeIds, recipes, totalCount, loading,
    myIngredients, myIngredientNames,myFridgeData,
    searchIngredients, loadMyFridge, saveFridge, loadMatches,
  }
})