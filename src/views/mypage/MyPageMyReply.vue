<template>
    <h4>< 마이페이지 메인으로</h4>
    <h1>나의 댓글 (164)</h1>
    
    <article class="card">
        <div class="card__body">

            <h6>원본 글</h6>
            <p>홍길동 · 2026-09-14</p>
        </div>
    </article>

    <article class="card">
        <div class="card__body">

            <h6>원본 글</h6>
            <p>홍길동 · 2026-09-14</p>
        </div>
    </article>

    <article class="card">
        <div class="card__body">

            <h6>원본 글</h6>
            <p>홍길동 · 2026-09-14</p>
        </div>
    </article>
    
    <div class="container">
        <Pagination></Pagination>
    </div>
</template>

<script setup lang="ts">
import Pagination from '@/components/common/Pagination.vue';
</script>