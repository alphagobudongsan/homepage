import { fetchAptTradeRange, fetchAptRentRange } from "@/lib/molit";
import { aggregateApartments } from "@/lib/apartments";
import { getKaptIndex, matchKapt } from "@/lib/kapt";
import ApartmentsClient from "./ApartmentsClient";

export const metadata = {
  title: "아파트 단지 정보 | 알파고 공인중개사사무소",
  description: "경기도 양주시 옥정동 아파트 단지별 실거래 정보를 확인하세요.",
};

export const revalidate = 3600;

export default async function ApartmentsPage() {
  const [trades, rents, kaptIndex] = await Promise.all([
    fetchAptTradeRange("41630", 12),
    fetchAptRentRange("41630", 12),
    getKaptIndex(),
  ]);

  // K-apt 기본정보(세대수·동수)로 보강, 매칭 실패 시 큐레이션 값 유지
  const apartments = aggregateApartments(trades, rents).map((a) => {
    const k = matchKapt(kaptIndex, a.name, a.jibun);
    if (!k) return a;
    return {
      ...a,
      households: k.households ?? a.households,
      dongs: k.dongs ?? a.dongs,
      buildYear: a.buildYear || k.buildYear || "",
    };
  });

  return <ApartmentsClient apartments={apartments} />;
}
