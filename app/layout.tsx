import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://korea-apt.vercel.app"),
  title: "알파고 공인중개사사무소 | AI가 추천하는 옥정동부동산",
  description:
    "경기도 양주시 옥정동 전문 공인중개사 2인. 국토부 실거래 데이터로 아파트 시세, 전월세, 단지 정보를 한 곳에서.",
  keywords: "옥정동, 양주시, 아파트, 부동산, 공인중개사, 실거래가, 전세, 월세",
  openGraph: {
    title: "알파고 공인중개사사무소 | AI가 추천하는 옥정동부동산",
    description:
      "옥정신도시 아파트 전문 공인중개사 2인. 국토부 실거래 데이터로 시세·전월세·단지정보를 한 곳에서.",
    siteName: "알파고 공인중개사사무소",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "알파고 공인중개사사무소 | AI가 추천하는 옥정동부동산",
    description:
      "옥정신도시 아파트 전문 공인중개사 2인. 국토부 실거래 데이터로 시세·전월세·단지정보를 한 곳에서.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full">
      <body className="min-h-full flex flex-col bg-cream text-text antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
