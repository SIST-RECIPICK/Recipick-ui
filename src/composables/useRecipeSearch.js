// composables/useRecipeSearch.js
import { ref } from "vue";

const API_BASE = "http://localhost:8080";

export function useRecipeSearch(userId) { // 어디서든 임포트 가능하게 설정
  const keyword = ref("");  // 검색창에 입력 텍스트
  const results = ref([]);  // 검색창 결과 배열
  const loading = ref(false); // 로딩상태
  const errorMsg = ref(""); // 에러메세지

  // 검색 버튼 클릭시 사용 함수
  async function search() {
    loading.value = true; // 바로 로딩
    errorMsg.value = ""; // 에러 초기화
    try {
        const params = new URLSearchParams({ // 서버에 보낼 조건 정리
            keyword: keyword.value, // 검색창 입력 텍스트
            user_id: userId.value ?? userId, // ref면 value 아니면 그냥 userId
        });

        // 서버요청
        const res=await fetch(`${API_BASE}/recipe/search?${params.toString()}`);

        if(!res.ok) throw new Error(`검색 실패: ${res.status}`); // 실패시 catch이동

        results.value = await res.json(); // json 값으로 변환해서 저장
    }catch(e){
        errorMsg.value = e.message;
        results.value = [];
    }finally{
        loading.value = false;
    }
}

  return { keyword, results, loading, errorMsg, search };
}