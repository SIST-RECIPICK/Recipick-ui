# Recipick 프론트엔드 — 팀 온보딩 가이드

---

## 0. 스타일 가이드는 화면을 띄우고 난 후 메인화면의 "스타일가이드" 참고

## 1. 프로젝트 받기 (git clone)

### 1-1. 코드 둘 폴더로 이동
원하는 위치에 폴더를 만들고 터미널을 엽니다.
(VSCode에서 `Ctrl + ~` 를 누르면 터미널이 열립니다.)

```bash
cd C:\workspace          # 원하는 경로 (예시). 없으면 먼저 폴더 생성
```

### 1-2. 클론
```bash
git clone https://github.com/SIST-RECIPICK/Recipick-ui.git
cd Recipick-ui
```
→ `Recipick-ui` 폴더가 생기고 그 안에 코드가 받아집니다.

### 1-3. VSCode로 열기
```bash
code .
```
(또는 VSCode → File → Open Folder → Recipick-ui 선택)

---

## 2. 패키지 설치 & 실행

### 2-1. 패키지 설치 (최초 1회 + package.json 바뀔 때마다)
```bash
npm install
```
→ `package.json`에 적힌 라이브러리(vue, vue-router, pinia 등)를 한 번에 받습니다.
→ `node_modules` 폴더가 생기는데, 이건 git에 안 올라갑니다(각자 설치).

### 2-2. 개발 서버 실행
```bash
npm run dev
```
→ 터미널에 `http://localhost:5173` 같은 주소가 뜹니다.
→ 브라우저에서 그 주소로 접속하면 화면이 보입니다.
→ 코드를 저장하면 **자동으로 새로고침**됩니다 (jsp처럼 수동 새로고침 불필요).
→ 끄려면 터미널에서 `Ctrl + C`.

### 2-3. 먼저 볼 것
접속되면 아래 주소부터 확인하세요:
- `http://localhost:5173/` — 메인 랜딩
- `http://localhost:5173/recipes` — 레시피 목록
- `http://localhost:5173/styleguide` — **개발 참조 페이지 (컴포넌트·문법 예시. 개발 전 필독)**

---

## 3. 폴더 구조 (어디에 뭘 만드나)

```
Recipick-ui/
├─ public/                 # 파비콘 등 정적 파일 (빌드 안 거침)
├─ index.html              # 폰트·파비콘 링크
└─ src/
   ├─ main.js              # 앱 시작점 (건드릴 일 거의 없음)
   ├─ App.vue              # 헤더 + 페이지 틀
   ├─ router/index.js      # ★ 새 페이지 만들면 여기에 경로 등록
   ├─ views/               # ★ 페이지 단위 (화면 하나 = 파일 하나)
   ├─ components/          # ★ 재사용 부품 (버튼, 카드 등)
   │  ├─ layout/           #   헤더 등 공통 레이아웃
   │  ├─ recipe/           #   레시피 관련 부품
   │  └─ ...               #   기능별 폴더로 정리
   ├─ stores/              # 상태 관리 (Pinia) — 로그인 정보 등
   ├─ composables/         # 재사용 로직 (use~ 함수)
   └─ assets/styles/       # 디자인 토큰 (색·폰트) — 수정 신중히
```

규칙:
- **페이지**(화면 전체) → `views/` 에 `XxxView.vue`
- **부품**(여러 곳에서 재사용) → `components/` 에 기능별 폴더로
- 새 페이지는 반드시 `router/index.js` 에 경로를 추가해야 화면에 뜸

---

## 4. API 연동
```js
// 나중 (실제 API) — fetch 또는 axios 사용
async function loadRecipes() {
  const res = await fetch(`/api/recipes?page=${page.value}&sort=${sort.value}`)
  const data = await res.json()
  recipes.value = data.content   // 백엔드 응답 구조에 맞게
}
```

## 5. 자주 겪는 문제

| 증상 | 해결 |
|------|------|
| `npm run dev`가 안 됨 | `npm install` 먼저 했는지 확인 |
| 화면이 하얗게 나옴 | 터미널·브라우저 콘솔(F12) 에러 확인 |
| import 빨간 줄 | 경로 오타 확인. `@/` 는 src 폴더 |
| 이미지 안 나옴 | UI는 `@/assets/`, 정적은 `/파일명`(public) |
| 커밋했는데 안 보임 | `git push` 했는지 확인 |
| 최신 코드 아님 | `git pull origin main` |

---