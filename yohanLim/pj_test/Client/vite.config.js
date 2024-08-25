import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "localhost", // 로컬에서만 접근 가능하게 설정
    port: 3000, // 프론트엔드 서버 포트
    proxy: {
      "/api": {
        target: "http://localhost:5000", // 백엔드 서버 주소
        changeOrigin: true, // 서버의 origin 변경
        rewrite: (path) => path.replace(/^\/api/, ""), // '/api'를 제거
      },
    },
  },
});
