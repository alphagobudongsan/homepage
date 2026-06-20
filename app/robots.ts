import type { MetadataRoute } from "next";

const BASE_URL = "https://korea-apt.vercel.app";

// 검색엔진 + AI 봇(GPTBot, ClaudeBot, PerplexityBot, Google-Extended 등) 모두 허용
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
