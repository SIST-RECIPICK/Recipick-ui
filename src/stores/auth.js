import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 인증 상태 스토어 (골격).
 * 실제 로그인/로그아웃 API 연동은 팀에서 채운다.
 * 헤더는 이 스토어의 isLoggedIn / user / isAdmin 만 참조한다.
 */
export const useAuthStore = defineStore('auth', () => {
  // user: null 이면 비로그인. { nickname, profileImage, role } 형태 가정.
  const user = ref(null)

  const isLoggedIn = computed(() => user.value !== null)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  // 닉네임 첫 글자 (프로필 이미지 없을 때 아바타 대체용)
  const initial = computed(() => user.value?.nickname?.[0] ?? '')

  // --- 아래는 API 연동 지점 (TODO) ---
  function setUser(payload) {
    user.value = payload
  }

  function logout() {
    // TODO: 서버 로그아웃 API 호출 + 토큰 삭제 (FR-104)
    user.value = null
  }

  return { user, isLoggedIn, isAdmin, initial, setUser, logout }
})
