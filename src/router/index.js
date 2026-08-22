import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

const routes = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/recipes',
    name: 'recipes',
    component: () => import('@/views/RecipeListView.vue')
  },
  {
    // 개발 참조용 스타일가이드
    path: '/styleguide', 
    name: 'styleguide',
    component: () => import('@/views/StyleGuideView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

export default router
