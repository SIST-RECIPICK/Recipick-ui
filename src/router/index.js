import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

// 관리자 가드 복구 시 아래 import도 함께 해제할 것
// import { useAuthStore } from '@/stores/auth'


const routes = [
  { path: '/', name: 'home', component: HomeView },
  {
    path: '/recipes',
    name: 'recipes',
    component: () => import('@/views/recipe/RecipeListView.vue')
  },
  {
    path: '/recipes/:id',
    name: 'recipe-detail',
    component: () => import('@/views/recipe/RecipeDetailView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/views/SignupView.vue'),
  },
  { 
    path: '/fridge',
    name: 'fridge', 
    component: () => import('@/views/fridge/FridgeView.vue') 
  },
  { 
    path: '/fridge/register', 
    name: 'fridge-register', 
    component: () => import('@/views/fridge/FridgeRegisterView.vue') 
  },
  {
    path: '/admin',
    component: () => import('@/components/layout/AdminLayout.vue'),
    meta: { requiresAdmin: true }, // 해당 페이지에 들고가는 정보가 필요할 때 to.meta.requiresAdmin 처럼 쓸 수 있음
    redirect: '/admin/curations',
    children: [
      {
        path: 'members',
        name: 'admin-member-list',
        component: () => import('@/views/admin/MemberListView.vue'),
        meta: { breadcrumb: [{ label: '관리자' }, { label: '회원관리' }] },
      },
      {
        path: 'curations',
        name: 'admin-curation-list',
        component: () => import('@/views/admin/CurationListView.vue'),
        meta: { breadcrumb: [{ label: '관리자' }, { label: '큐레이션 관리' }] },
      },
      {
        path: 'curations/new',
        name: 'admin-curation-create',
        component: () => import('@/views/admin/CurationCreateView.vue'),
        meta: {
          breadcrumb: [
            { label: '관리자' },
            { label: '큐레이션 관리', to: '/admin/curations' },
            { label: '등록' },
          ],
        },
      },
      {
        path: 'curations/:id/edit',
        name: 'admin-curation-edit',
        component: () => import('@/views/admin/CurationCreateView.vue'),
        meta: {
          breadcrumb: [
            { label: '관리자' },
            { label: '큐레이션 관리', to: '/admin/curations' },
            { label: '수정' },
          ],
        },
      },
      {
        path: 'curations/:id',
        name: 'admin-curation-detail',
        component: () => import('@/views/admin/CurationDetailView.vue'),
        meta: {
          breadcrumb: [
            { label: '관리자' },
            { label: '큐레이션 관리', to: '/admin/curations' },
            { label: '상세조회' },
          ],
        },
      },
    ],
  },
  {
    path: '/community',
    redirect: '/community/reviews',
  },
  {
    path: '/community/reviews',
    name: 'community-reviews',
    component: () => import('@/views/community/ReviewBoardView.vue'),
  },
  {
    path: '/community/curations',
    name: 'community-curations',
    component: () => import('@/views/community/CurationBoardView.vue'),
  },
  {
    // 개발 참조용 스타일가이드
    path: '/styleguide', 
    name: 'styleguide',
    component: () => import('@/views/StyleGuideView.vue'),
  },
  {
    // 식단표
    path: '/meal-plan',
    name: "MealPlan",
    component: () => import('@/views/MealPlanView.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

// 관리자 라우트 가드
// TODO: 권한 기능 구현 후 아래 주석을 해제해 활성화할 것 (개발 중에는 /admin 접근 허용)
router.beforeEach(() => {
  // if (to.meta.requiresAdmin) {
  //   const auth = useAuthStore()
  //   if (!auth.isAdmin) {
  //     return { name: 'home' }
  //   }
  // }
})

export default router