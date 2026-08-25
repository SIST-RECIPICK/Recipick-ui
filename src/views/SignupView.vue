<template>
  <div class="auth container">
    <div class="auth__card">
      <h1 class="auth__title">회원가입</h1>
      <hr class="auth__divider" />

      <form class="auth__form" novalidate @submit.prevent="handleSubmit">
        <!-- 이메일 -->
        <div class="field">
          <label class="field__label" for="email">이메일</label>
          <div class="field__row">
            <input
              id="email"
              v-model.trim="form.email"
              class="input"
              type="email"
              placeholder="이메일을 입력해 주세요. (0~00자)"
              autocomplete="email"
              :aria-invalid="!!errors.email"
              @input="onEmailChange"
            />
            <button
              type="button"
              class="btn btn--outline field__action"
              :disabled="!canSendCode || emailSending"
              @click="handleSendCode"
            >
              {{ emailVerified ? '인증완료' : '이메일 인증' }}
            </button>
          </div>
          <p v-if="errors.email" class="field__msg field__msg--error">
            {{ errors.email }}
          </p>
          <p v-else-if="emailVerified" class="field__msg field__msg--success">
            이메일 인증이 완료되었습니다.
          </p>

          <!-- 인증번호 입력 (전송 후 노출) -->
          <div v-if="codeSent && !emailVerified" class="field__row field__row--code">
            <input
              v-model.trim="form.code"
              class="input"
              type="text"
              inputmode="numeric"
              placeholder="인증번호 6자리"
              maxlength="6"
            />
            <button
              type="button"
              class="btn btn--primary field__action"
              @click="handleVerifyCode"
            >
              확인
            </button>
          </div>
        </div>

        <!-- 비밀번호 -->
        <div class="field">
          <label class="field__label" for="password">비밀번호</label>
          <input
            id="password"
            v-model="form.password"
            class="input"
            type="password"
            placeholder="비밀번호 입력란"
            autocomplete="new-password"
            :aria-invalid="!!errors.password"
            @input="validatePassword"
          />
          <input
            id="passwordConfirm"
            v-model="form.passwordConfirm"
            class="input field__spacer"
            type="password"
            placeholder="비밀번호 확인 입력란"
            autocomplete="new-password"
            :aria-invalid="!!errors.passwordConfirm"
            @input="validatePassword"
          />
          <p v-if="errors.password" class="field__msg field__msg--error">
            {{ errors.password }}
          </p>
          <p v-else-if="errors.passwordConfirm" class="field__msg field__msg--error">
            비밀번호가 일치하지 않습니다.
          </p>
        </div>

        <!-- 닉네임 -->
        <div class="field">
          <label class="field__label" for="nickname">닉네임</label>
          <div class="field__row">
            <input
              id="nickname"
              v-model.trim="form.nickname"
              class="input"
              type="text"
              placeholder="중복되지 않는 닉네임을 입력해 주세요. (00자)"
              :aria-invalid="!!errors.nickname"
              @input="onNicknameChange"
            />
            <button
              type="button"
              class="btn btn--outline field__action"
              :disabled="!form.nickname || nicknameChecked"
              @click="handleCheckNickname"
            >
              {{ nicknameChecked ? '확인완료' : '중복확인' }}
            </button>
          </div>
          <p v-if="errors.nickname" class="field__msg field__msg--error">
            {{ errors.nickname }}
          </p>
          <p v-else-if="nicknameChecked" class="field__msg field__msg--success">
            사용 가능한 닉네임입니다.
          </p>
        </div>

        <!-- 제출 -->
        <button type="submit" class="btn btn--inverse btn--block auth__submit" :disabled="submitting">
          회원가입
        </button>
      </form>

      <p class="auth__foot">
        이미 회원이신가요?
        <RouterLink to="/login" class="auth__foot-link">로그인</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const form = reactive({
  email: '',
  code: '',
  password: '',
  passwordConfirm: '',
  nickname: '',
})

const errors = reactive({
  email: '',
  password: '',
  passwordConfirm: '',
  nickname: '',
})

const emailSending = ref(false)
const codeSent = ref(false)
const emailVerified = ref(false)
const nicknameChecked = ref(false)
const submitting = ref(false)

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const canSendCode = computed(() => emailPattern.test(form.email) && !emailVerified.value)

// --- 이메일 인증 (FR-101 연동 지점) ---
function onEmailChange() {
  emailVerified.value = false
  codeSent.value = false
  errors.email = ''
}

async function handleSendCode() {
  if (!emailPattern.test(form.email)) {
    errors.email = '올바른 이메일 형식이 아닙니다.'
    return
  }
  emailSending.value = true
  try {
    // TODO: 인증번호 발송 API 호출
    codeSent.value = true
  } catch {
    errors.email = '중복된 이메일입니다.'
  } finally {
    emailSending.value = false
  }
}

function handleVerifyCode() {
  // TODO: 인증번호 검증 API 호출
  if (form.code.length === 6) {
    emailVerified.value = true
    errors.email = ''
  } else {
    errors.email = '인증번호가 올바르지 않습니다.'
  }
}

// --- 비밀번호 검증 ---
function validatePassword() {
  errors.password = form.password.length >= 8 ? '' : '비밀번호는 8자 이상이어야 합니다.'
  errors.passwordConfirm =
    form.passwordConfirm && form.password !== form.passwordConfirm ? '불일치' : ''
}

// --- 닉네임 중복확인 (FR-102 연동 지점) ---
function onNicknameChange() {
  nicknameChecked.value = false
  errors.nickname = ''
}

async function handleCheckNickname() {
  try {
    // TODO: 닉네임 중복확인 API 호출
    nicknameChecked.value = true
  } catch {
    errors.nickname = '중복된 닉네임입니다.'
  }
}

// --- 제출 ---
async function handleSubmit() {
  validatePassword()

  if (!emailVerified.value) {
    errors.email = '이메일 인증을 완료해 주세요.'
    return
  }
  if (errors.password || errors.passwordConfirm) return
  if (!nicknameChecked.value) {
    errors.nickname = '닉네임 중복확인을 해주세요.'
    return
  }

  submitting.value = true
  try {
    // TODO: 회원가입 API 호출 (FR-103)
    router.push('/login')
  } finally {
    submitting.value = false
  }
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
  max-width: 420px;
}
.auth__title {
  text-align: center;
  letter-spacing: 0.2em;
}
.auth__divider {
  margin-block: var(--space-4) var(--space-6);
  border: none;
  border-top: 1px solid var(--border-strong);
}

.auth__form {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
}

/* 필드 */
.field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.field__label {
  font-size: var(--text-lg);
  font-weight: var(--weight-bold);
}
.field__row {
  display: flex;
  gap: var(--space-2);
}
.field__row--code {
  margin-top: var(--space-2);
}
.field__row .input {
  flex: 1;
}
.field__action {
  flex-shrink: 0;
  white-space: nowrap;
}
/* 인풋 두 개 세로 배치 시 간격 */
.field__spacer {
  margin-top: var(--space-2);
}

/* 안내 메시지 */
.field__msg {
  font-size: var(--text-sm);
}
.field__msg--error {
  color: var(--danger);
}
.field__msg--success {
  color: var(--success);
}

.auth__submit {
  margin-top: var(--space-2);
  height: 48px;
}

.auth__foot {
  margin-top: var(--space-5);
  text-align: center;
  font-size: var(--text-sm);
  color: var(--text-secondary);
}
.auth__foot-link {
  font-weight: var(--weight-bold);
  color: var(--text-primary);
}
.auth__foot-link:hover {
  color: var(--accent);
}
</style>
