// composables/useRecipeSearch.js
import { ref } from "vue";

const API_BASE = "http://localhost:8080";

export function useRecipeSearch(userId) {
  const keyword = ref("");
  const results = ref([]);
  const loading = ref(false);
  const errorMsg = ref("");

  async function search() {
    loading.value = true;
    errorMsg.value = "";
    try {
        const params = new URLSearchParams({
            keyword: keyword.value,
            user_id: userId.value ?? userId,
        });

        const res=await fetch(`${API_BASE}/recipe/search?${params.toString()}`);

        if(!res.ok) throw new Error(`검색 실패: ${res.status}`);

        results.value = await res.json();
    }catch(e){
        errorMsg.value = e.message;
        results.value = [];
    }finally{
        loading.value = false;
    }
}

  return { keyword, results, loading, errorMsg, search };
}