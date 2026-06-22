import { notFound } from "next/navigation";
import { fetchAptTradeRange, fetchAptRentRange } from "@/lib/molit";
import { buildDeals, buildMonthlyTrend, aptMeta, aptSlug } from "@/lib/apartments";
import { getKaptIndex, matchKapt } from "@/lib/kapt";
import AptDetailClient from "./AptDetailClient";

// 6시간 캐시 (단지 정보는 자주 안 바뀜 — 갱신 부담↓, 빠른 로딩)
export const revalidate = 21600;

// 주요 단지는 빌드 시점에 미리 생성(static) → 방문 시 API 호출 없이 즉시 표시.
// 그 외 단지는 첫 방문 시 생성 후 캐시(ISR).
export function generateStaticParams() {
  return Object.keys(aptMeta).map((name) => ({ slug: aptSlug(name) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);
  return {
    title: `${name} 실거래가 | 알파고 공인중개사사무소`,
    description: `${name}의 매매·전세·월세 실거래 정보와 시세 추이를 확인하세요.`,
  };
}

export default async function AptDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const name = decodeURIComponent(slug);

  // 6개월 (가볍게 — 목록 캐시 재사용, 건수·최근 거래 위주로 충분)
  const [trades, rents, kaptIndex] = await Promise.all([
    fetchAptTradeRange("41630", 6),
    fetchAptRentRange("41630", 6),
    getKaptIndex(),
  ]);

  const aptTrades = trades.filter((t) => t.aptNm === name);
  const aptRents = rents.filter((r) => r.aptNm === name);

  if (aptTrades.length === 0 && aptRents.length === 0) {
    notFound();
  }

  const deals = buildDeals(aptTrades, aptRents);
  const trend = buildMonthlyTrend(deals);
  const jibun = aptTrades[0]?.jibun ?? "";
  const meta = aptMeta[name] ?? {};
  const k = matchKapt(kaptIndex, name, jibun);
  const households = k?.households ?? meta.households;
  const dongs = k?.dongs ?? meta.dongs;
  const buildYear = aptTrades[0]?.buildYear || k?.buildYear || "";

  return (
    <AptDetailClient
      name={name}
      buildYear={buildYear}
      jibun={jibun}
      households={households}
      dongs={dongs}
      deals={deals}
      trend={trend}
    />
  );
}
