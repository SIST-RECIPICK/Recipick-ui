import {ref} from "vue";

const API_BASE = "http://localhost:8080";

export function useCalendarInfo(userId,year,month){
    const info = ref(null);
    // calendar/info 담는 자리
    const loading = ref(false);

    const errorMsg = ref("");

    async function loadSummary() {
    loading.value = true; // 로딩 시작
    errorMsg.value = ""; //에러 초기화
    try {
      const params = new URLSearchParams({
        user_id: userId.value ?? userId, //서버에 보낼 조건을 정리
        year: year.value, // 백앤드에서 YYYY로 비교하니까 그대로
        month: String(month.value).padStart(2, "0"),
        // 백엔드가 MM 2자리로 비교하니까 9월이면 09로 맞춰줘야 함
      });

      const res = await fetch(`${API_BASE}/calendar/info?${params.toString()}`); // res에 서버 응답 담기
      if (!res.ok) throw new Error(`요약 정보 조회 실패: ${res.status}`); // 실패 메세지

      info.value = await res.json();// 서버가 보내준 정보를 info에 json으로 저장
    } catch (e) {
      errorMsg.value = "요약 정보를 불러오지 못했습니다.";
      console.error(e);
    } finally {
      loading.value = false;
    }
  }
    return {info,loading,errorMsg , loadSummary}
}