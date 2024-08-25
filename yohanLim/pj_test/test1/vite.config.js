import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
    plugins: [react()],
    server: {
        host: "localhost", //현재 로컬호스트에서만 접근가능하게수정
        port: 3000, // 프론트단 3000번할당
    },
});
