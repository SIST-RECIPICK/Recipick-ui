import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

const LOCALHOST_API_URL = 'http://localhost:8080'
const PROD_API_BASE_PATH = '/api'

// 임시 조치: src/ 전역에 http://localhost:8080 이 파일마다 개별 하드코딩되어 있어
// 운영 빌드에서만 이 문자열을 /api 로 치환한다. 정석은 공통 axios 인스턴스 +
// VITE_API_BASE_URL 환경변수 도입이며, 이 플러그인은 그 전까지의 빌드타임 미봉책이다.
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
      if (!code.includes(LOCALHOST_API_URL)) return null
      return { code: code.split(LOCALHOST_API_URL).join(PROD_API_BASE_PATH), map: null }
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
