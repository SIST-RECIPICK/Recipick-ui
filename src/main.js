import { createApp } from 'vue'
import { createPinia } from 'pinia'
import axios from 'axios'

import App from './App.vue'
import router from './router'
import { useAuthStore } from '@/stores/auth'

import './assets/styles/tokens.css'
import './assets/styles/base.css'

const app = createApp(App)

const pinia = createPinia()

app.use(pinia)
app.use(router)

const auth = useAuthStore(pinia)

const EXCLUDE_FROM_INTERCEPTOR = ['/auth/reissue', '/auth/login', '/auth/logout']

// --- 요청 인터셉터: accessToken 자동 첨부 ---
axios.interceptors.request.use((config) => {
  if (auth.accessToken) {
    config.headers.Authorization = `Bearer ${auth.accessToken}`
  }
  return config
})

// --- 응답 인터셉터: 401 감지 시 자동 재발급 (동시 요청은 단일 재발급으로 묶어서 처리) ---
let isReissuing = false
let pendingQueue = []

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    const originalRequest = error.config
    const status = error.response?.status

    if (
      !originalRequest ||
      EXCLUDE_FROM_INTERCEPTOR.some((url) => originalRequest.url?.includes(url))
    ) {
      return Promise.reject(error)
    }

    if (status !== 401) {
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      // 재발급 받은 새 토큰으로도 다시 401 → 더 재시도하지 않고 강제 로그아웃
      auth.logout()
      router.push('/login')
      return Promise.reject(error)
    }
    originalRequest._retry = true

    if (isReissuing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject, originalRequest })
      })
    }

    isReissuing = true

    return auth.reissue()
      .then(() => {
        pendingQueue.forEach(({ resolve, originalRequest: queuedRequest }) =>
          resolve(axios(queuedRequest)),
        )
        pendingQueue = []
        return axios(originalRequest)
      })
      .catch((reissueError) => {
        pendingQueue.forEach(({ reject }) => reject(reissueError))
        pendingQueue = []
        auth.logout()
        router.push('/login')
        return Promise.reject(reissueError)
      })
      .finally(() => {
        isReissuing = false
      })
  },
)

// --- 앱 시작 시 1회 재발급 시도 (새로고침으로 비워진 Pinia 상태 복구) ---
auth.restoreSession().finally(() => {
  app.mount('#app')
})
