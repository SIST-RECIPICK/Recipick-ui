// 식단 캘린더 데이터 fetch + 월 이동 + 날짜별 매핑 로직
import { ref, computed } from "vue";

const API_BASE = "http://localhost:8080"; // CORS로 프론트↔백엔드 직접 통신

const MEAL_TYPES = ["아침", "점심", "저녁"];
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function useCalendarItems(userId) {
  const today = new Date();
  const year = ref(today.getFullYear());
  const month = ref(today.getMonth() + 1);

  const items = ref([]);
  const loading = ref(false);
  const errorMsg = ref("");

  const itemMap = computed(() => {
    const map = {};
    for (const it of items.value) {
      const dateOnly = String(it.meal_date).slice(0, 10);
      const key = `${dateOnly}_${it.meal_type}`;
      map[key] = it;
    }
    return map;
  });

  const calendarCells = computed(() => {
    const firstDay = new Date(year.value, month.value - 1, 1);
    const lastDay = new Date(year.value, month.value, 0);
    const startWeekday = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const cells = [];
    for (let i = 0; i < startWeekday; i++) cells.push({ empty: true });

    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${year.value}-${String(month.value).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      cells.push({
        empty: false,
        day: d,
        dateStr,
        meals: MEAL_TYPES.map((type) => ({
          type,
          data: itemMap.value[`${dateStr}_${type}`] || null,
        })),
      });
    }
    return cells;
  });

  async function loadCalendar() {
    loading.value = true;
    errorMsg.value = "";
    try {
      const params = new URLSearchParams({
        user_id: userId.value ?? userId,
        year: year.value,
        month: String(month.value).padStart(2, "0"),
      });
      const res = await fetch(`${API_BASE}/calendar/list?${params.toString()}`);
      if (!res.ok) throw new Error(`캘린더 조회 실패: ${res.status}`);
      items.value = await res.json();
    } catch (e) {
      errorMsg.value = "캘린더를 불러오지 못했습니다.";
      console.error(e);
    } finally {
      loading.value = false;
    }
  }

  function prevMonth() {
    if (month.value === 1) { month.value = 12; year.value -= 1; }
    else month.value -= 1;
    loadCalendar();
  }

  function nextMonth() {
    if (month.value === 12) { month.value = 1; year.value += 1; }
    else month.value += 1;
    loadCalendar();
  }

  return { year, month, items, loading, errorMsg, calendarCells, loadCalendar, prevMonth, nextMonth, WEEKDAYS };
}