<template>
  <div class="auth container">
    <div class="auth__card">
      <!-- 로고 -->
      <RouterLink to="/" class="auth__logo">
        <img src="@/assets/recipick-logo.svg" alt="Recipick" class="auth__logo-img" />
      </RouterLink>

      <form class="auth__form" novalidate @submit.prevent="handleSubmit">
        <div class="field">
          <label class="sr-only" for="email">이메일</label>
          <input
            id="email"
            v-model.trim="form.email"
            class="input"
            type="email"
            placeholder="이메일 입력란"
            autocomplete="email"
            :aria-invalid="!!errorMessage"
          />
        </div>

        <div class="field">
          <label class="sr-only" for="password">비밀번호</label>
          <input
            id="password"
            v-model="form.password"
            class="input"
            type="password"
            placeholder="비밀번호 입력란"
            autocomplete="current-password"
            :aria-invalid="!!errorMessage"
            @keyup.enter="handleSubmit"
          />
        </div>

        <p v-if="errorMessage" class="auth__error">
          {{ errorMessage }}
        </p>

        <button type="submit" class="btn btn--inverse btn--block auth__submit" :disabled="submitting">
          로그인
        </button>
      </form>

      <!-- 보조 링크 -->
      <div class="auth__links">
        <RouterLink to="/find-password" class="auth__link">비밀번호 찾기</RouterLink>
        <span class="auth__sep" aria-hidden="true">|</span>
        <RouterLink to="/signup" class="auth__link">회원가입</RouterLink>
      </div>

      <!-- 구분선 -->
      <div class="auth__or" role="separator">
        <span>or</span>
      </div>

      <!-- 소셜 로그인 -->
      <button type="button" class="btn btn--outline btn--block auth__social" @click="handleGoogleLogin">
        <IconBrandGoogleFilled :size="18" />
        구글 로그인
      </button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { IconBrandGoogleFilled } from '@tabler/icons-vue'
import axios from 'axios'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({
  email: '',
  password: '',
})

const errorMessage = ref('')
const submitting = ref(false)
const recoveryToken = ref(null)

async function handleSubmit() {
  errorMessage.value = ''

  if (!form.email || !form.password) {
    errorMessage.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
    return
  }

  submitting.value = true
  try {
    const res = await axios.post(
      'http://localhost:8080/auth/login',
      { email: form.email, password: form.password },
      { withCredentials: true },
    )

    const { accountStatus, accessToken, userId, nickname, role, recoveryToken: token, message } =
      res.data

    if (accountStatus === 'ACTIVE') {
      auth.setUser({ userId, nickname, role, accessToken })
      router.push('/')
      return
    }

    // accountStatus === 'WITHDRAWN' — 토큰 미발급, 복구 절차 안내
    recoveryToken.value = token

    if (confirm(`${message}\n\n5분 이내에 복구할 수 있습니다. 지금 복구하시겠습니까?`)) {
      // TODO: 계정 복구 API 명세 확정 후 recoveryToken.value로 복구 요청 연동
    }
  } catch (err) {
    const errorCode = err.response?.data?.errorCode

    switch (errorCode) {
      case 'INVALID_CREDENTIALS':
        errorMessage.value = '이메일 또는 비밀번호가 올바르지 않습니다.'
        break
      case 'SOCIAL_ACCOUNT_ONLY':
        errorMessage.value = '구글 로그인을 이용해주세요.'
        break
      default:
        alert('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
  } finally {
    submitting.value = false
  }
}

function handleGoogleLogin() {
  // TODO: 구글 OAuth 연동 (FR-105)
}
</script>

<style scoped>
.auth {
  display: flex;
  justify-content: center;
  padding-block: var(--space-8);
}
.auth__card {
  width: 100%;
  max-width: 380px;
}

.auth__logo {
  display: flex;
  justify-content: center;
  margin-bottom: var(--space-8);
}
.auth__logo-img {
  height: 40px;
  width: auto;
}

.auth__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.auth__error {
  font-size: var(--text-sm);
  color: var(--danger);
}

.auth__submit {
  margin-top: var(--space-2);
  height: 48px;
}

/* 보조 링크 */
.auth__links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-3);
  margin-top: var(--space-5);
  font-size: var(--text-sm);
}
.auth__link {
  color: var(--text-primary);
  font-weight: var(--weight-medium);
}
.auth__link:hover {
  color: var(--accent);
}
.auth__sep {
  color: var(--border-strong);
}

/* or 구분선 */
.auth__or {
  display: flex;
  align-items: center;
  margin-block: var(--space-6);
  color: var(--text-muted);
  font-size: var(--text-sm);
}
.auth__or::before,
.auth__or::after {
  content: '';
  flex: 1;
  border-top: 1px solid var(--border);
}
.auth__or span {
  padding-inline: var(--space-4);
}

.auth__social {
  height: 48px;
}
</style>
