import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    server: {
        proxy: {
            "/api": { target: "http://localhost:8000", changeOrigin: true },
        },
    },
    plugins: [reactRouter(), tsconfigPaths()],
});
