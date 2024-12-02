import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination: "http://localhost:8000/api/:path*", // Proxy to Backend
            },
        ];
    },
    /* config options here */
};

export default nextConfig;
