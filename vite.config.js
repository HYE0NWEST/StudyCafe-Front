import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],

  // 👇 여기가 수정된 핵심 부분!
  // 로컬 개발(development)일 땐 루트('/') 사용
  // 배포(production)일 땐 '/StudyCafe-Front/' (저장소 이름) 사용
 base: '/',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버 주소
        changeOrigin: true,
      }
    }
  }
})