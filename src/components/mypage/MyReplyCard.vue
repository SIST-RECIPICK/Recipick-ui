<template>
  <article class="card my-reply-card">
    <div class="card__body">

      <!-- 체크박스 -->
      <div class="my-reply-card__check">
        <input
          type="checkbox"
          id="reply-1"
        />
      </div>

      <!-- 댓글 내용 -->
      <div class="my-reply-card__content">

        <!-- 원본 글 -->
        <p class="my-reply-card__original">
            원본 글
        </p>

        <!-- 댓글 + 날짜 -->
        <div class="my-reply-card__text-row">

          <p>
            이 레시피 정말 맛있게 잘 만들어 먹었습니다.
            다음에도 다시 만들어 보고 싶어요.
          </p>

          <span class="my-reply-card__date">
            2026-09-14
          </span>

        </div>

      </div>

    </div>
  </article>
</template>

<style scoped>
.my-reply-card .card__body {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: var(--space-4);
}

/* 체크박스 */
.my-reply-card__check {
  display: flex;
  align-items: flex-start;
  padding-top: var(--space-1);
}

.my-reply-card__check input {
  width: 18px;
  height: 18px;
  accent-color: var(--accent);
  cursor: pointer;
}

/* 원본 글 제목*/
.my-reply-card__original {
  margin: 0 0 var(--space-3);
  font-size: var(--text-sm);
  color: var(--text-secondary);
}

/* 댓글 내용 */
.my-reply-card__content {
  min-width: 0;
}

/* 댓글 + 날짜 */
.my-reply-card__text-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--space-4);
}

/* 날짜 */
.my-reply-card__date {
  flex-shrink: 0;
  color: var(--text-secondary);
  font-size: var(--text-sm);
}
</style>