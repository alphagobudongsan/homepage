import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "알파고 공인중개사사무소 | AI가 추천하는 옥정신도시부동산",
  description:
    "옥정신도시(경기 양주시 옥정동) 아파트 매매·전세·월세 실거래가와 단지별 시세를 국토교통부 실거래가로 한눈에. 옥정 전문 공인중개사 2인이 안내합니다.",
  keywords:
    "옥정신도시, 옥정신도시 부동산, 옥정신도시 아파트, 옥정동 부동산, 옥정동 아파트 시세, 옥정 매매, 옥정 전세, 옥정신도시 부동산 추천, 옥정동 부동산 추천, 단지별 시세, 양주 옥정동, 실거래가, 공인중개사",
  openGraph: {
    title: "알파고 공인중개사사무소 | AI가 추천하는 옥정신도시부동산",
    description:
      "옥정신도시 아파트 전문 공인중개사 2인. 국토부 실거래 데이터로 시세·전월세·단지정보를 한 곳에서.",
    siteName: "알파고 공인중개사사무소",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "알파고 공인중개사사무소 | AI가 추천하는 옥정신도시부동산",
    description:
      "옥정신도시 아파트 전문 공인중개사 2인. 국토부 실거래 데이터로 시세·전월세·단지정보를 한 곳에서.",
  },
  verification: {
    google: "7aud4Phb6IAST1m2KV0BJu5-HuFlB5iFS7RIeXcJflw",
    other: {
      "naver-site-verification": "925f130c6b14964e1baec6222670592e581950bc",
    },
  },
};

// AI 봇·검색엔진이 사무소 정보를 정확히 이해하도록 하는 구조화 데이터 (Schema.org)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: "알파고 공인중개사사무소",
  alternateName: "AI가 추천하는 옥정신도시부동산",
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image.png`,
  description:
    "경기도 양주시 옥정신도시 아파트 전문 공인중개사사무소. 국토교통부 실거래가 데이터를 기반으로 아파트 매매·전세·월세 시세와 단지 정보를 제공합니다.",
  telephone: "+82-31-864-4222",
  email: "ipt_korea@naver.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "옥정로5길 35, 상가101호",
    addressLocality: "양주시",
    addressRegion: "경기도",
    addressCountry: "KR",
  },
  areaServed: [
    { "@type": "Place", name: "경기도 양주시 옥정동" },
    { "@type": "Place", name: "옥정신도시" },
  ],
  knowsAbout: [
    "아파트 매매",
    "아파트 전세",
    "아파트 월세",
    "국토교통부 실거래가 분석",
    "옥정신도시 아파트 단지 정보",
    "상가·공장·창고 중개",
    "부동산 권리분석",
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "19:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Saturday", "Sunday"],
      opens: "10:00",
      closes: "17:00",
    },
  ],
  employee: [
    { "@type": "Person", name: "강은주", jobTitle: "공인중개사" },
    { "@type": "Person", name: "권정욱", jobTitle: "공인중개사" },
  ],
  sameAs: [
    "https://blog.naver.com/ipt_korea",
    "https://www.youtube.com/@%EC%96%91%EC%A3%BC%EC%98%A5%EC%A0%95%EC%95%8C%ED%8C%8C%EA%B3%A0%EB%B6%80%EB%8F%99%EC%82%B0",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-cream text-text antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
