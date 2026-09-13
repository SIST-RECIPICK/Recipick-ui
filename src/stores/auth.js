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
    logout() {
      // TODO: 서버 로그아웃(POST /auth/logout) 연동은 별도 작업으로 진행 예정
      this.user = null
      this.accessToken = null
    },
  },
})
