import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const LOCALHOST_API_URL = 'http://localhost:8080'
const PROD_API_BASE_PATH = '/api'
const LOCALHOST_WS_CHAT_URL = 'ws://localhost:8080/chat-ws' // 존재 여부 사전 체크용 plain 문자열
const WS_CHAT_LITERAL_REGEX = /(['"`])ws:\/\/localhost:8080\/chat-ws\1/g // 따옴표 종류 무관 매칭
const PROD_WS_CHAT_EXPR =
  "(location.protocol === 'https:' ? 'wss://' : 'ws://') + location.host + '/api/chat-ws'"

// 임시 조치: src/ 전역에 http://localhost:8080 및 ws://localhost:8080/chat-ws 가
// 파일마다 개별 하드코딩되어 있어 운영 빌드에서만 문자열을 치환한다.
// - http(s) 쪽은 고정 경로 /api 로 단순 치환.
// - ws 쪽은 도메인을 빌드에 박지 않기 위해 런타임에 location.protocol/host를
//   읽는 표현식으로 치환한다 (따옴표까지 포함한 리터럴 전체를 표현식으로 대체).
// 정석은 공통 axios 인스턴스 + VITE_API_BASE_URL 환경변수 도입이며,
// 이 플러그인은 그 전까지의 빌드타임 미봉책이다.
function replaceProdApiBaseUrl() {
  let isProdBuild = false
  return {
    name: 'replace-prod-api-base-url',
    enforce: 'pre',
    apply: 'build', // vite dev 서버(serve)에서는 이 플러그인 훅 자체가 호출되지 않음
    configResolved(resolvedConfig) {
      isProdBuild = resolvedConfig.mode === 'production'
    },
    transform(code, id) {
      if (!isProdBuild) return null
      const cleanId = id.split('?')[0].replace(/\\/g, '/')
      if (cleanId.includes('/node_modules/')) return null
      if (!cleanId.includes('/src/')) return null
      if (!/\.(vue|js)$/.test(cleanId)) return null

      const hasApiUrl = code.includes(LOCALHOST_API_URL)
      const hasWsChatUrl = code.includes(LOCALHOST_WS_CHAT_URL)
      if (!hasApiUrl && !hasWsChatUrl) return null

      let next = code
      if (hasApiUrl) next = next.split(LOCALHOST_API_URL).join(PROD_API_BASE_PATH)
      if (hasWsChatUrl) next = next.replace(WS_CHAT_LITERAL_REGEX, PROD_WS_CHAT_EXPR)

      return { code: next, map: null }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    replaceProdApiBaseUrl(),
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
