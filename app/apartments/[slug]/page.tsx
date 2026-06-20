import { notFound } from "next/navigation";
import { fetchAptTradeRange, fetchAptRentRange } from "@/lib/molit";
import { buildDeals, buildMonthlyTrend, aptMeta } from "@/lib/apartments";
import { getKaptIndex, matchKapt } from "@/lib/kapt";
import AptDetailClient from "./AptDetailClient";

export const revalidate = 3600;

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

  const [trades, rents, kaptIndex] = await Promise.all([
    fetchAptTradeRange("41630", 24),
    fetchAptRentRange("41630", 24),
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
