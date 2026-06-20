import { fetchAptTrade, fetchAptRent, formatAmount, getYearMonth } from "@/lib/molit";
import MarketClient from "./MarketClient";

export const metadata = {
  title: "아파트 시세 | 알파고 공인중개사사무소",
  description: "경기도 양주시 옥정동 아파트 실거래가, 전세, 월세 현황을 확인하세요.",
};

export const revalidate = 0;

export default async function MarketPage() {
  // 당월 데이터 우선, 없으면 전월로 폴백
  const thisYmd = getYearMonth(0);
  const prevYmd = getYearMonth(1);

  const [thisTrades, prevTrades, thisRents, prevRents] = await Promise.all([
    fetchAptTrade("41630", thisYmd),
    fetchAptTrade("41630", prevYmd),
    fetchAptRent("41630", thisYmd),
    fetchAptRent("41630", prevYmd),
  ]);

  const currentTrades = thisTrades.length > 0 ? thisTrades : prevTrades;
  const rentData = thisRents.length > 0 ? thisRents : prevRents;
  const currentYmd = thisTrades.length > 0 ? thisYmd : prevYmd;

  return (
    <MarketClient
      currentTrades={currentTrades}
      prevTrades={prevTrades}
      rentData={rentData}
      currentYmd={currentYmd}
    />
  );
}
