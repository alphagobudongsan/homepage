import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "알파고 공인중개사사무소 | AI가 추천하는 옥정동부동산",
  description:
    "경기도 양주시 옥정동 전문 공인중개사 2인. AI 실거래 데이터로 아파트 시세, 전월세, 단지 정보를 한 곳에서.",
  keywords: "옥정동, 양주시, 아파트, 부동산, 공인중개사, 실거래가, 전세, 월세",
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
