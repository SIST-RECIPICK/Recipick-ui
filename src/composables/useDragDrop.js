// 레시피 카드 -> 달력 슬롯 드래그.
// 브라우저 네이티브 HTML5 드래그(draggable + dragstart/dragover/drop)는
// 윈도우 크롬에서 드래그 세션이 안 끝나고 마우스가 먹통되는 문제가 있어서 미사용
// 대신 pointerdown/pointermove/pointerup만으로 직접 구현 — 네이티브 드래그 자체를 시작하지 않으니
// 세션이 안 끝나는 상황 자체가 생길 수 없음.
import { ref } from "vue";

// 모듈 스코프 공유 상태: 레시피 카드(소스)와 달력(타겟)이 서로 다른 컴포넌트라
// 같은 드래그 상태를 봐야 함.
const dragging = ref(null); // 현재 드래그 중인 레시피 객체 (없으면 null)
const pointerPos = ref({ x: 0, y: 0 }); //마우스 커서의 현재 좌표
let onDrop = null; // 나중에 드롭될 함수

function handlePointerMove(event) { // 마우스가 움직일때 마다 좌표 갱신
  pointerPos.value = { x: event.clientX, y: event.clientY }; // x,y는 브라우저 기준 마우스 위치
}

function handlePointerUp(event) {  // 마우스 버튼을 놓을시 드래그 종료 및 리스너 제거 => 미실행시 중복 버그
  window.removeEventListener("pointermove", handlePointerMove);
  window.removeEventListener("pointerup", handlePointerUp);
  document.body.classList.remove("is-dragging-recipe"); 

  const recipe = dragging.value; // 드래그 중인 레시피
  dragging.value = null; // 드래그 상태 초기화
  if (!recipe) return; // 만약 드래그 레시피가 없으면 중단

  const el = document.elementFromPoint(event.clientX, event.clientY); // 드래그를 종료한 좌표에 뭐가 있는지
  const zone = el?.closest("[data-meal-slot]"); // data-meal-slot 속성이 있는 달력 슬롯을 찾음
  if (zone && onDrop) {  // 만약 슬롯이 있고 onDrop이 준비되어 있으면
    onDrop({ //onDrop을 실행하고 날짜,끼니,레시피 전달
      dateStr: zone.dataset.dateStr, //날짜
      mealType: zone.dataset.mealType, // 끼니
      recipe, // 이름 변수 명이 같으면 하나만 적어도 됨
    });
  }
}

export function useDragDrop() {
  function startDrag(recipe, event) {  // 드래그 시작
    if (event.button !== 0) return; // 왼쪽 버튼만 우클릭 드래그 방지
    event.preventDefault(); // 텍스트 선택/이미지 네이티브 드래그 방지 브라우저 기본동작 방지
    dragging.value = recipe; // 
    pointerPos.value = { x: event.clientX, y: event.clientY }; // 브라우저 기준 마우스 위치
    document.body.classList.add("is-dragging-recipe"); // 마우스 놓을시 종료
    window.addEventListener("pointermove", handlePointerMove); // 윈도우에 리스너 등록: 마우스가 카드를 벗어나도 좌표 추적
    window.addEventListener("pointerup", handlePointerUp);
  }

  // 달력 쪽에서 드롭됐을 때 호출할 콜백을 등록
  function registerDropHandler(fn) {
    onDrop = fn;
  }

  return { dragging, pointerPos, startDrag, registerDropHandler };
}
