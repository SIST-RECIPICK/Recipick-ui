<template>
    <h1>저장한 레시피</h1>
    <div class="related">
    <RecipeCard
        v-for="r in myMarkLists"
        :key="r.id"
        :recipe="r"
        class="related__item"
    />
    </div>
    <Pagination
        :startpage="startPage"
        :endpage="endPage"
        :curpage="curpage"
        :totalpage="totalpage"
        @change="pageChange"
    />
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { computed, onMounted } from 'vue';
import RecipeCard from '@/components/recipe/RecipeCard.vue';
import { myListStore } from '@/stores/myListStore';
import Pagination from '@/components/common/Pagination.vue';

const store = myListStore()
const { myMarkList } = storeToRefs(store) // 연관 레시피 리스트
const { endPage,startPage,curpage,totalpage } = storeToRefs(store)

onMounted(() => {
  store.myListData(1,'mark')
})

const pageChange = (page) =>{store.myListData(page,'mark')}

const myMarkLists = computed(() =>
  myMarkList.value.map(item => ({
    nickname:item.nickname,
    like_count:item.count,
    user_id:item.user_id,
    rcp_seq: item.rcp_seq,
    info_eng: item.info_eng,
    rcp_nm: item.rcp_nm,
    att_file_no_main: item.att_file_no_main,
    hit: item.hit,
    rcp_pat2: item.rcp_pat2,
  }))
)

</script>

<style scoped>
.related {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  padding-bottom: var(--space-2);
  scrollbar-width: thin;
  scroll-snap-type: x mandatory;
}
.related__item {
  flex: 0 0 260px;
  scroll-snap-align: start;
}
</style>