import type { MetadataRoute } from "next";
import { cases } from "@/lib/cases";

const BASE_URL = "https://korea-apt.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return [...staticPages, ...casePages];
}
