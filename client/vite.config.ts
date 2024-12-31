import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    // server: {
    //     proxy: {
    //         "/api": {
    //             target: process.env?.PROXY_API || "http://localhost:8000",
    //             changeOrigin: true,
    //         },
    //         "/ws": {
    //             // target: "ws://localhost:8000",
    //             target: process.env?.PROXY_API_WS || "ws://localhost:8000",
    //             rewriteWsOrigin: true,
    //             secure: false,
    //             ws: true,
    //             rewrite: (path) => path.replace(/^\/ws/, ""),
    //         },
    //     },
    // },
    plugins: [reactRouter(), tsconfigPaths()],
});
