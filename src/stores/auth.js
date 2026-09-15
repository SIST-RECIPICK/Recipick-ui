import { defineStore } from 'pinia'
import axios from 'axios'

const API_BASE = 'http://localhost:8080'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken && !!state.user,
    initial: (state) => state.user?.nickname?.[0] ?? '',
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },
  actions: {
    setUser({ userId, nickname, role, accessToken }) {
      this.user = { userId, nickname, role }
      this.accessToken = accessToken
    },
    setAccessToken(accessToken) {
      this.accessToken = accessToken
    },
    setUserInfo({ userId, nickname, role }) {
      this.user = { userId, nickname, role }
    },
    async fetchMe() {
      try {
        const res = await axios.get(`${API_BASE}/auth/me`, { withCredentials: true })
        this.setUserInfo(res.data)
      } catch {
        this.logout()
      }
    },
    async logout() {
      try {
        await axios.post(`${API_BASE}/auth/logout`, null, { withCredentials: true })
      } catch {
        // 401(이미 로그아웃된 토큰)이어도 결과적으로 로그아웃 상태이므로 별도 처리 없이 무시
      } finally {
        this.user = null
        this.accessToken = null
      }
    },
  },
})
