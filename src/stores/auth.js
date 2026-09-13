import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    accessToken: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.accessToken,
    initial: (state) => state.user?.nickname?.[0] ?? '',
    isAdmin: (state) => state.user?.role === 'ADMIN',
  },
  actions: {
    setUser({ userId, nickname, role, accessToken }) {
      this.user = { userId, nickname, role }
      this.accessToken = accessToken
    },
    logout() {
      // TODO: 서버 로그아웃(POST /auth/logout) 연동은 별도 작업으로 진행 예정
      this.user = null
      this.accessToken = null
    },
  },
})
