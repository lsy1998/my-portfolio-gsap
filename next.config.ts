import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export', // 生成静态文件
  images: {
    unoptimized: true, // Cloudflare Pages 不支持 Next.js 的图片优化
  },
};

export default nextConfig;
