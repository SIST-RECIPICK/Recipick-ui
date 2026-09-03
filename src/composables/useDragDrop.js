// 레시피 카드 -> 달력 슬롯 드래그.
// 브라우저 네이티브 HTML5 드래그(draggable + dragstart/dragover/drop)는
// 윈도우 크롬에서 드래그 세션이 안 끝나고 마우스가 먹통되는 문제가 있어서 안 씀.
// 대신 pointerdown/pointermove/pointerup만으로 직접 구현 — 네이티브 드래그 자체를 시작하지 않으니
// 세션이 "안 끝나는" 상황 자체가 생길 수 없음.
import { ref } from "vue";

// 모듈 스코프 공유 상태: 레시피 카드(소스)와 달력(타겟)이 서로 다른 컴포넌트라
// 같은 드래그 상태를 봐야 함.
const dragging = ref(null); // 현재 드래그 중인 레시피 객체 (없으면 null)
const pointerPos = ref({ x: 0, y: 0 });
let onDrop = null;

function handlePointerMove(event) {
  pointerPos.value = { x: event.clientX, y: event.clientY };
}

function handlePointerUp(event) {
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerup", handlePointerUp);
  document.body.classList.remove("is-dragging-recipe");

  const recipe = dragging.value;
  dragging.value = null;
  if (!recipe) return;

  const el = document.elementFromPoint(event.clientX, event.clientY);
  const zone = el?.closest("[data-meal-slot]");
  if (zone && onDrop) {
    onDrop({
      dateStr: zone.dataset.dateStr,
      mealType: zone.dataset.mealType,
      recipe,
    });
  }
}

export function useDragDrop() {
  function startDrag(recipe, event) {
    if (event.button !== 0) return; // 왼쪽 버튼만
    event.preventDefault(); // 텍스트 선택/이미지 네이티브 드래그 방지
    dragging.value = recipe;
    pointerPos.value = { x: event.clientX, y: event.clientY };
    document.body.classList.add("is-dragging-recipe");
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  }

  // 달력 쪽에서 드롭됐을 때 호출할 콜백을 등록
  function registerDropHandler(fn) {
    onDrop = fn;
  }

  return { dragging, pointerPos, startDrag, registerDropHandler };
}
