import type { MetadataRoute } from "next";
import { cases } from "@/lib/cases";
import { SITE_URL as BASE_URL } from "@/lib/site";
import { fetchAptTradeRange, fetchAptRentRange } from "@/lib/molit";
import { aggregateApartments, isExcludedComplex } from "@/lib/apartments";

// 6시간 캐시 (단지 목록은 자주 안 바뀜)
export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/market`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/agents`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/apartments`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/cases`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE_URL}/consultation`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const casePages: MetadataRoute.Sitemap = cases.map((c) => ({
    url: `${BASE_URL}/cases/${c.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  // 개별 단지 페이지 (실거래 데이터에서 자동 생성, 임대·공공 제외)
  let apartmentPages: MetadataRoute.Sitemap = [];
  try {
    const [trades, rents] = await Promise.all([
      fetchAptTradeRange("41630", 12),
      fetchAptRentRange("41630", 12),
    ]);
    apartmentPages = aggregateApartments(trades, rents)
      .filter((a) => !isExcludedComplex(a.name))
      .map((a) => ({
        url: `${BASE_URL}/apartments/${a.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      }));
  } catch {
    // 데이터 조회 실패 시 단지 페이지는 생략 (정적 페이지·사례는 유지)
  }

  return [...staticPages, ...apartmentPages, ...casePages];
}
