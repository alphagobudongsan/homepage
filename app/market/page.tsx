import { fetchLatestAptTrade, fetchLatestAptRent } from "@/lib/molit";
import MarketClient from "./MarketClient";

export const metadata = {
  title: "아파트 시세 | 알파고 공인중개사사무소",
  description: "경기도 양주시 옥정동 아파트 실거래가, 전세, 월세 현황을 확인하세요.",
};

export const revalidate = 0;

export default async function MarketPage() {
  // 실거래가 있는 가장 최근 월을 자동 탐색 (당월이 비면 직전 달들로 역추적)
  const [tradeRes, rentRes] = await Promise.all([
    fetchLatestAptTrade("41630"),
    fetchLatestAptRent("41630"),
  ]);

  return (
    <MarketClient
      currentTrades={tradeRes.items}
      prevTrades={[]}
      rentData={rentRes.items}
      currentYmd={tradeRes.ymd}
    />
  );
}
