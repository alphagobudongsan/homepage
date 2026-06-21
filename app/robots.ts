import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// 검색엔진 + AI 봇(GPTBot, ClaudeBot, PerplexityBot, Google-Extended 등) 모두 허용
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
