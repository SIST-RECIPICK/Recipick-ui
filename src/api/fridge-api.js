/**
 * 냉장고 파먹기 관련 API 모듈
 *
 * 지금은 서버에서 데이터가 들어왔다고 가정한 목업을 반환한다.
 * 실제 연동 시 각 함수 내부를 fetch/axios 호출로 교체하면 되고,
 * 반환 타입(아래 typedef)은 그대로 유지한다.
 */

// ─────────────────────────────────────────────
// 타입 정의 (백엔드 응답 스펙)
// ─────────────────────────────────────────────

/**
 * 레시피에 쓰이는 재료 한 건.
 * @typedef {Object} MatchedIngredient
 * @property {number} ingredientId - 재료 PK (ingredient.id)
 * @property {string} name         - 재료 표준명 (상위 카테고리로 통합된 이름)
 * @property {boolean} have        - 사용자가 선택한 재료에 포함되는지 (보유 여부)
 */

/**
 * 냉장고 매칭 결과 레시피 한 건.
 * 매칭 계산(보유 개수/전체)은 서버(SQL)에서 수행해 내려준다.
 * @typedef {Object} FridgeMatchRecipe
 * @property {number} id                       - 레시피 PK
 * @property {string} title                    - 레시피 제목
 * @property {string} chef                     - 작성자(쉐프)명
 * @property {string} image                    - 대표 이미지 URL (없으면 빈 문자열)
 * @property {number} totalCount               - 레시피 전체 재료 수
 * @property {number} matchCount               - 그 중 보유 재료 수
 * @property {number} popularity               - 인기순 정렬용 지표 (조회수 등)
 * @property {MatchedIngredient[]} ingredients - 재료 목록 (보유/미보유 포함)
 */

/**
 * 냉장고 매칭 결과 응답 전체.
 * @typedef {Object} FridgeMatchResponse
 * @property {number} totalCount               - 검색 결과 총 개수
 * @property {FridgeMatchRecipe[]} recipes     - 레시피 목록
 */

// ─────────────────────────────────────────────
// API 함수 (현재는 목업)
// ─────────────────────────────────────────────

/**
 * 선택한 재료로 만들 수 있는 레시피를 조회한다.
 * @param {Object} params
 * @param {string[]} params.ingredientNames - 선택한 재료 표준명 목록
 * @param {'match'|'popular'} [params.sort] - 정렬 기준
 * @returns {Promise<FridgeMatchResponse>}
 */
export async function fetchFridgeMatches({ ingredientNames = [], sort = 'match' } = {}) {
  // TODO: 실제 연동 시 아래 목업을 fetch 호출로 교체
  // const res = await fetch('/api/fridge/matches', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify({ ingredientNames, sort }),
  // })
  // return res.json()

  return mockMatchResponse(ingredientNames, sort)
}

/**
 * 재료 한 건 (재료 마스터).
 * @typedef {Object} Ingredient
 * @property {number} id       - 재료 PK
 * @property {string} name     - 재료 표준명
 * @property {string} category - 카테고리 키 (ingredient_category)
 */

/**
 * 등록 화면용 재료 마스터 목록을 조회한다.
 * @returns {Promise<Ingredient[]>}
 */
export async function fetchIngredients() {
  // TODO: const res = await fetch('/api/ingredients'); return res.json()
  return MOCK_INGREDIENTS
}

/**
 * 사용자의 냉장고에 담긴 재료 id 목록을 조회한다.
 * @returns {Promise<number[]>} 재료 id 배열
 */
export async function fetchMyFridge() {
  // TODO: const res = await fetch('/api/fridge'); return res.json()
  // 서버가 담긴 재료 id 목록을 내려준다고 가정
  return MOCK_MY_FRIDGE_IDS
}

/**
 * 냉장고 재료를 저장한다.
 * @param {number[]} ingredientIds - 담을 재료 id 목록
 * @returns {Promise<void>}
 */
export async function saveMyFridge(ingredientIds) {
  // TODO: await fetch('/api/fridge', { method: 'PUT', body: JSON.stringify({ ingredientIds }) })
  // 목업: 저장 성공했다고 가정
  MOCK_MY_FRIDGE_IDS = [...ingredientIds]
}

// ─────────────────────────────────────────────
// 재료 마스터 목업 (ingredient 테이블 가정)
// ─────────────────────────────────────────────

/** @type {Ingredient[]} */
const MOCK_INGREDIENTS = [
  { id: 1, name: '양파', category: 'vegetable' },
  { id: 2, name: '감자', category: 'vegetable' },
  { id: 3, name: '당근', category: 'vegetable' },
  { id: 4, name: '대파', category: 'vegetable' },
  { id: 5, name: '마늘', category: 'vegetable' },
  { id: 6, name: '애호박', category: 'vegetable' },
  { id: 7, name: '파프리카', category: 'vegetable' },
  { id: 8, name: '돼지고기', category: 'meat' },
  { id: 9, name: '소고기', category: 'meat' },
  { id: 10, name: '닭고기', category: 'meat' },
  { id: 11, name: '새우', category: 'meat' },
  { id: 12, name: '달걀', category: 'dairy' },
  { id: 13, name: '우유', category: 'dairy' },
  { id: 14, name: '치즈', category: 'dairy' },
  { id: 15, name: '두부', category: 'dairy' },
  { id: 16, name: '쌀', category: 'grain' },
  { id: 17, name: '소면', category: 'grain' },
  { id: 18, name: '스파게티', category: 'grain' },
  { id: 19, name: '간장', category: 'sauce' },
  { id: 20, name: '고추장', category: 'sauce' },
  { id: 21, name: '된장', category: 'sauce' },
  { id: 22, name: '설탕', category: 'sauce' },
  { id: 23, name: '참기름', category: 'sauce' },
  { id: 24, name: '고춧가루', category: 'sauce' },
]

// 사용자가 이미 담아둔 냉장고 재료 id (서버 저장 상태 가정)
let MOCK_MY_FRIDGE_IDS = [1, 2, 3]

// ─────────────────────────────────────────────
// 목업 (서버가 내려줬다고 가정하는 데이터)
// ─────────────────────────────────────────────

/** @type {Omit<FridgeMatchRecipe, 'matchCount' | 'ingredients'> & { ings: string[] }[]} */
const MOCK_RECIPES = [
  { id: 1, title: '감자조림', chef: '한식당', image: '', popularity: 320, ings: ['감자', '간장', '설탕', '대파'] },
  { id: 2, title: '돼지고기 김치찌개', chef: '백선생', image: '', popularity: 980, ings: ['돼지고기', '고추장', '양파', '대파', '두부'] },
  { id: 3, title: '당근 감자볶음', chef: '집밥연구소', image: '', popularity: 210, ings: ['당근', '감자', '양파', '참기름'] },
  { id: 4, title: '달걀말이', chef: '요리하는남자', image: '', popularity: 1500, ings: ['달걀', '대파', '당근'] },
  { id: 5, title: '두부조림', chef: '한식당', image: '', popularity: 640, ings: ['두부', '간장', '고춧가루', '대파', '마늘'] },
  { id: 6, title: '제육볶음', chef: '백선생', image: '', popularity: 2100, ings: ['돼지고기', '고추장', '양파', '설탕', '마늘', '고춧가루', '대파'] },
]

/**
 * 선택 재료를 반영해 서버 응답 형태(FridgeMatchResponse)로 가공한 목업을 만든다.
 * @returns {FridgeMatchResponse}
 */
function mockMatchResponse(ingredientNames, sort) {
  const selected = new Set(ingredientNames)

  let recipes = MOCK_RECIPES.map((r) => {
    const ingredients = r.ings.map((name, i) => ({
      ingredientId: r.id * 100 + i,
      name,
      have: selected.has(name),
    }))
    const matchCount = ingredients.filter((i) => i.have).length
    return {
      id: r.id,
      title: r.title,
      chef: r.chef,
      image: r.image,
      totalCount: ingredients.length,
      matchCount,
      popularity: r.popularity,
      ingredients,
    }
  })

  // 최소 1개 이상 매칭되는 레시피만
  recipes = recipes.filter((r) => r.matchCount > 0)

  // 정렬
  if (sort === 'popular') {
    recipes.sort((a, b) => b.popularity - a.popularity)
  } else {
    recipes.sort((a, b) => {
      const ra = a.matchCount / a.totalCount
      const rb = b.matchCount / b.totalCount
      return rb - ra || b.matchCount - a.matchCount
    })
  }

  return { totalCount: recipes.length, recipes }
}
