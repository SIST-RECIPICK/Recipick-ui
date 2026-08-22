<script setup>
/**
 * 스타일가이드 페이지 (/styleguide)
 * 컴포넌트 미리보기 + 복사용 코드 + npm Vue 기본 사용법.
 */
import SgSection from '@/components/styleguide/SgSection.vue'
import CodeBlock from '@/components/styleguide/CodeBlock.vue'
import RecipeCard from '@/components/RecipeCard.vue'

// 컬러 토큰 목록 (미리보기용)
const colors = [
  { name: '--accent', desc: '포인트(테라코타)', var: 'var(--accent)' },
  { name: '--accent-subtle', desc: '연한 포인트 배경', var: 'var(--accent-subtle)' },
  { name: '--surface-inverse', desc: '검정 CTA', var: 'var(--surface-inverse)' },
  { name: '--surface-page', desc: '페이지 배경', var: 'var(--surface-page)' },
  { name: '--surface-card', desc: '카드 배경', var: 'var(--surface-card)' },
  { name: '--surface-sunken', desc: '인풋/들어간 면', var: 'var(--surface-sunken)' },
  { name: '--text-primary', desc: '기본 글자', var: 'var(--text-primary)' },
  { name: '--text-secondary', desc: '보조 글자', var: 'var(--text-secondary)' },
  { name: '--border', desc: '테두리', var: 'var(--border)' },
  { name: '--success', desc: '성공', var: 'var(--success)' },
  { name: '--danger', desc: '위험/삭제', var: 'var(--danger)' },
  { name: '--warning', desc: '경고', var: 'var(--warning)' },
]

// 데모용 레시피
const demoRecipe = {
  id: 1, title: '김치찌개', chef: '이솜귤',
  image: '', views: '2.3만', cookTime: '20분', category: '국·찌개',
}
</script>

<template>
  <div class="sg container">
    
    <header class="sg__hero">
      <p class="sg__label">개발 참조</p>
      <h1 class="sg__title">Recipick 개발자가이드</h1>
      <p class="sg__lead">
        <b>기본 사용법</b>부터 읽으시면 됩니다.
      </p>
    </header>


    <!-- ========== npm Vue 기본 사용법 ========== -->
    <SgSection
      title="🚀 npm Vue 기본 사용법"
      description="읽어보고 개발 시작합시다!"
    >
      <div class="sg-guide">
        <div class="sg-guide__item">
          <h4>1. 이미지는 어디에 두고 어떻게 부르나</h4>
          <div class="sg-callout">
            <b>UI 이미지(로고·아이콘 등)</b> → <code>src/assets/</code> 에 두기
          </div>
          <CodeBlock code="<img src=&quot;@/assets/recipick-logo.svg&quot; alt=&quot;Recipick&quot; />" />
          <div class="sg-callout" style="margin-top: var(--space-3);">
            <b>파비콘·robots.txt 같은 정적 파일</b> → <code>public/</code> 에 두기
          </div>
          <CodeBlock code="<!-- public/logo.svg 파일을 부를 때. 'public' 글자는 경로에 안 씀! -->
<img src=&quot;/logo.svg&quot; alt=&quot;로고&quot; />" />
          <p class="sg-note">@/ 는 src 폴더를 뜻하는 별칭입니다. public 파일에는 @/ 를 쓰지 않습니다.</p>
        </div>

        <div class="sg-guide__item">
          <h4>2. 다른 컴포넌트 가져다 쓰기 (import)</h4>
          <p class="sg-note">jsp의 include 와 비슷하지만, 파일을 &lt;script&gt; 에서 import 한 뒤 태그처럼 씁니다.</p>
          <CodeBlock code="<script setup>
import RecipeCard from '@/components/RecipeCard.vue'
</&#115;cript>

<template>
  <RecipeCard :recipe=&quot;data&quot; />
</template>" />
        </div>

        <div class="sg-guide__item">
          <h4>3. class 는 그냥 HTML 처럼</h4>
          <p class="sg-note">우리 공통 클래스(btn, card, chip 등)를 class 에 그대로 씁니다. 색은 하드코딩 금지.</p>
          <CodeBlock code="<!-- 좋은 예 -->
<button class=&quot;btn btn--primary&quot;>저장</button>

<!-- 나쁜 예: 색 하드코딩 -->
<button style=&quot;background:#c2410c&quot;>저장</button>" />
        </div>

        <div class="sg-guide__item">
          <h4>4. 변수 화면에 뿌리기 · 조건 · 반복</h4>
          <p class="sg-note">jsp의 ${} / c:if / c:forEach 에 해당하는 Vue 문법입니다.</p>
          <CodeBlock code="<!-- 값 출력:  ${name}  →  {{ name }} -->
<p>{{ recipe.title }}</p>

<!-- 조건:  c:if  →  v-if -->
<p v-if=&quot;isLoggedIn&quot;>환영합니다</p>

<!-- 반복:  c:forEach  →  v-for -->
<li v-for=&quot;item in list&quot; :key=&quot;item.id&quot;>{{ item.name }}</li>

<!-- 속성에 변수 넣기: 앞에 : 붙임 -->
<img :src=&quot;recipe.image&quot; :alt=&quot;recipe.title&quot; />" />
        </div>

        <div class="sg-guide__item">
          <h4>5. CDN 방식과 뭐가 다른가</h4>
          <p class="sg-note">
            CDN은 &lt;script&gt; 태그로 Vue를 불러와 한 HTML 안에서 쓰던 방식입니다.
            npm 방식은 파일을 .vue 로 나눠 만들고, npm run dev 로 개발 서버를 띄워
            자동 새로고침·컴포넌트 분리·빌드 최적화를 받습니다. import 로 조립하는 게 핵심 차이입니다.
          </p>
        </div>
      </div>
    </SgSection>

    <!-- ========== 컬러 ========== -->
    <SgSection title="컬러 토큰" description="색은 절대 하드코딩하지 말고 이 변수를 쓰세요. 다크모드가 자동으로 따라옵니다.">
      <template #preview>
        <div class="sg-colors">
          <div v-for="c in colors" :key="c.name" class="sg-color">
            <div class="sg-color__swatch" :style="{ background: c.var }"></div>
            <p class="sg-color__name">{{ c.name }}</p>
            <p class="sg-color__desc">{{ c.desc }}</p>
          </div>
        </div>
      </template>
      <template #code>
        <CodeBlock code="/* CSS에서 */
.my-box {
  background: var(--surface-card);
  color: var(--text-primary);
  border: 1px solid var(--border);
}" />
      </template>
    </SgSection>

    <!-- ========== 타이포 ========== -->
    <SgSection title="타이포그래피" description="폰트 크기도 토큰으로. 제목은 h1~h4 태그만 써도 기본 스타일이 적용됩니다.">
      <template #preview>
        <div class="sg-type">
          <p style="font-size: var(--text-3xl); font-weight: var(--weight-bold);">3xl 제목 (36px)</p>
          <p style="font-size: var(--text-2xl); font-weight: var(--weight-bold);">2xl 제목 (28px)</p>
          <p style="font-size: var(--text-xl);">xl 제목 (22px)</p>
          <p style="font-size: var(--text-base);">base 본문 (16px)</p>
          <p style="font-size: var(--text-sm); color: var(--text-secondary);">sm 보조 (14px)</p>
        </div>
      </template>
      <template #code>
        <CodeBlock code="<h1>제목</h1>  <!-- 태그만 써도 됨 -->
<p style=&quot;font-size: var(--text-sm)&quot;>작은 글씨</p>" />
      </template>
    </SgSection>

    <!-- ========== 버튼 ========== -->
    <SgSection title="버튼" description="class에 btn + 종류 하나를 붙입니다. 색·모양은 이미 정해져 있어요.">
      <template #preview>
        <div class="sg-row">
          <button class="btn btn--primary">btn--primary</button>
          <button class="btn btn--inverse">btn--inverse</button>
          <button class="btn btn--outline">btn--outline</button>
          <button class="btn btn--ghost">btn--ghost</button>
        </div>
        <div class="sg-row" style="margin-top: var(--space-3);">
          <button class="btn btn--primary btn--block">btn--block (꽉 참)</button>
        </div>
      </template>
      <template #code>
        <CodeBlock code="<button class=&quot;btn btn--primary&quot;>등록</button>
<button class=&quot;btn btn--outline&quot;>취소</button>
<button class=&quot;btn btn--primary btn--block&quot;>전체 너비</button>" />
      </template>
    </SgSection>

    <!-- ========== 칩/배지 ========== -->
    <SgSection title="칩 · 배지" description="태그, 카테고리, 상태 표시에 사용.">
      <template #preview>
        <div class="sg-row">
          <span class="chip">기본 칩</span>
          <span class="chip chip--accent">포인트 칩</span>
          <span class="chip chip--success">완료</span>
          <span class="chip chip--danger">삭제</span>
        </div>
      </template>
      <template #code>
        <CodeBlock code="<span class=&quot;chip&quot;>20분</span>
<span class=&quot;chip chip--accent&quot;>국·찌개</span>
<span class=&quot;chip chip--success&quot;>완료</span>" />
      </template>
    </SgSection>

    <!-- ========== 인풋 ========== -->
    <SgSection title="입력창" description="class=&quot;input&quot; 하나면 기본 스타일 완성.">
      <template #preview>
        <input class="input" placeholder="레시피명을 입력하세요" style="max-width: 360px;" />
      </template>
      <template #code>
        <CodeBlock code="<input class=&quot;input&quot; placeholder=&quot;검색&quot; />" />
      </template>
    </SgSection>

    <!-- ========== 카드 컴포넌트 ========== -->
    <SgSection title="레시피 카드 (컴포넌트)" description="공통 컴포넌트는 import해서 props만 넘기면 됩니다.">
      <template #preview>
        <div style="max-width: 240px;">
          <RecipeCard :recipe="demoRecipe" />
        </div>
      </template>
      <template #code>
        <CodeBlock code="<script setup>
import RecipeCard from '@/components/RecipeCard.vue'
const recipe = { title: '김치찌개', chef: '이솜귤', /* ... */ }
</&#115;cript>

<template>
  <RecipeCard :recipe=&quot;recipe&quot; />
</template>" />
      </template>
    </SgSection>

  </div>
</template>

<style scoped>
.sg { padding-block: var(--space-6); max-width: 900px; }

.sg__hero { margin-bottom: var(--space-6); }
.sg__label { font-size: var(--text-xs); color: var(--text-muted); font-weight: var(--weight-medium); margin-bottom: var(--space-1); }
.sg__title { font-size: var(--text-3xl); font-weight: var(--weight-bold); margin-bottom: var(--space-2); }
.sg__lead { font-size: var(--text-sm); color: var(--text-secondary); line-height: var(--leading-normal); }

/* 컬러 */
.sg-colors {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: var(--space-3);
}
.sg-color__swatch {
  height: 56px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border);
  margin-bottom: var(--space-2);
}
.sg-color__name { font-size: var(--text-xs); font-family: monospace; color: var(--text-primary); }
.sg-color__desc { font-size: var(--text-xs); color: var(--text-muted); }

/* 타이포 */
.sg-type > * { margin-bottom: var(--space-2); }

/* 공통 가로 정렬 */
.sg-row { display: flex; gap: var(--space-2); flex-wrap: wrap; align-items: center; }

/* npm Vue 가이드 */
.sg-guide__item { margin-bottom: var(--space-5); }
.sg-guide__item:last-child { margin-bottom: 0; }
.sg-guide__item h4 {
  font-size: var(--text-base);
  font-weight: var(--weight-medium);
  margin-bottom: var(--space-2);
}
.sg-callout {
  background: var(--accent-subtle);
  color: var(--accent-text);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-sm);
  font-size: var(--text-sm);
  margin-bottom: var(--space-2);
}
.sg-callout code { font-family: monospace; font-weight: var(--weight-bold); }
.sg-note {
  font-size: var(--text-sm);
  color: var(--text-secondary);
  margin-bottom: var(--space-2);
  line-height: var(--leading-normal);
}
</style>
