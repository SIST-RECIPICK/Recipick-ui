<template>
  <article class="card my-review-card">
    <div class="card__body">

      <!-- 왼쪽 : 사진 -->
      <div class="my-review-card__image">
        사진
      </div>

      <!-- 오른쪽 -->
      <div class="my-review-card__content">

        <!-- 리뷰 제목 + 삭제 버튼 -->
        <div class="my-review-card__title-row">

          <h3>
            정말 맛있게 먹었습니다
          </h3>

          <button type="button" class="btn btn--primary">
            삭제
          </button>

        </div>

        <!-- 후기 내용 -->
        <p class="my-review-card__text">
          레시피가 간단하고 맛있어서 좋았습니다.
          재료도 쉽게 구할 수 있었고 다음에도 다시 만들어 먹을 것 같습니다.
        </p>

        <!-- 하단 정보 -->
        <div class="my-review-card__bottom">

          <!-- 레시피 정보 -->
          <div class="my-review-card__recipe">

            <h3>
              레시피 제목입니다
            </h3>

            <p class="my-review-card__recipe-author">
              레시피 작성자
            </p>

          </div>

          <!-- 후기 작성일 -->
          <div class="my-review-card__date">

            <span>후기작성일</span>
            <span>2026-09-14</span>

          </div>

        </div>

      </div>

    </div>
  </article>
</template>

<style scoped>
.my-review-card {
  width: 100%;
}

.my-review-card .card__body {
  display: grid;
  grid-template-columns: 3fr 7fr;
  gap: var(--space-5);
}

/* 사진 */
.my-review-card__image {
  min-height: 220px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: var(--surface-sunken);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);

  color: var(--text-secondary);
}

/* 오른쪽 리뷰 영역 */
.my-review-card__content {
  min-width: 0;

  display: flex;
  flex-direction: column;
}

/* 리뷰 제목 + 삭제 버튼 */
.my-review-card__title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

/* 후기 내용 */
.my-review-card__text {
  margin: var(--space-3) 0 0;

  color: var(--text-secondary);

  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 하단 정보 */
.my-review-card__bottom {
  margin-top: auto;
  padding-top: var(--space-3);

  border-top: 1px solid var(--border);

  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: var(--space-4);
}

/* 레시피 작성자 */
.my-review-card__recipe-author {
  margin: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}

/* 후기 작성일 */
.my-review-card__date {
  color: var(--text-secondary);
  font-size: var(--text-sm);
  text-align: right;
}

.my-review-card__date span {
  display: block;
}

.my-review-card__date span:last-child {
  margin-top: var(--space-1);
}
</style>