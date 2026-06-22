import {
  fetchAptTradeRange,
  fetchAptRentRange,
  fetchLatestAptTrade,
  fetchLatestAptRent,
} from "@/lib/molit";
import MarketClient from "./MarketClient";

export const metadata = {
  title: "아파트 시세 | 알파고 공인중개사사무소",
  description: "경기도 양주시 옥정동 아파트 실거래가, 전세, 월세 현황을 확인하세요.",
};

// 10분 캐시 (손님마다 국토부 API를 호출하지 않고 10분에 한 번만 → 빠른 로딩 + 실시간 느낌)
export const revalidate = 600;

export default async function MarketPage() {
  // 최근 6개월 실거래 (전광판=최신월, 리스트=더보기로 과거까지)
  let [trades, rents] = await Promise.all([
    fetchAptTradeRange("41630", 6),
    fetchAptRentRange("41630", 6),
  ]);
  // 데이터가 전혀 없으면(API 일시 오류) 목업 폴백
  if (trades.length === 0) trades = (await fetchLatestAptTrade("41630")).items;
  if (rents.length === 0) rents = (await fetchLatestAptRent("41630")).items;

  // 데이터가 있는 가장 최근 거래월 (yyyymm)
  const ymOf = (y: string, m: string) => `${y}${m.padStart(2, "0")}`;
  const yms = [
    ...trades.map((t) => ymOf(t.dealYear, t.dealMonth)),
    ...rents.map((r) => ymOf(r.dealYear, r.dealMonth)),
  ].sort();
  const currentYmd = yms[yms.length - 1] ?? "";

  // 현재 접속 날짜 (한국 시간 기준, 매 요청마다 갱신)
  const accessDate = new Date().toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <MarketClient
      trades={trades}
      rents={rents}
      currentYmd={currentYmd}
      accessDate={accessDate}
    />
  );
}
