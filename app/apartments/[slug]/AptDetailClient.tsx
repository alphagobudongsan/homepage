"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { UnifiedDeal, MonthlyPoint, toPyeong } from "@/lib/apartments";
import { formatAmount } from "@/lib/molit";
import { AptComposedChart } from "@/components/PriceChart";
import { ChevronLeft, MapPin, Calendar, Building2, Phone } from "lucide-react";

interface Props {
  name: string;
  buildYear: string;
  jibun: string;
  households?: number;
  dongs?: number;
  deals: UnifiedDeal[];
  trend: MonthlyPoint[];
}

const typeColor: Record<string, string> = {
  매매: "text-navy",
  전세: "text-teal",
  월세: "text-gold-dark",
};

const typeBg: Record<string, string> = {
  매매: "bg-navy/5 text-navy",
  전세: "bg-teal/10 text-teal",
  월세: "bg-gold/10 text-gold-dark",
};

export default function AptDetailClient({
  name,
  buildYear,
  jibun,
  households,
  dongs,
  deals,
  trend,
}: Props) {
  // 타입(전용면적) 필터 옵션
  const typeOptions = useMemo(() => {
    const types = Array.from(new Set(deals.map((d) => d.type84))).sort(
      (a, b) => a - b
    );
    return ["전체", ...types.map(String)];
  }, [deals]);

  const [typeFilter, setTypeFilter] = useState("전체");
  const [dealKind, setDealKind] = useState<"전체" | "매매" | "전세" | "월세">(
    "전체"
  );

  const filteredDeals = useMemo(
    () =>
      deals.filter(
        (d) =>
          (typeFilter === "전체" || String(d.type84) === typeFilter) &&
          (dealKind === "전체" || d.type === dealKind)
      ),
    [deals, typeFilter, dealKind]
  );

  // 최근월 요약
  const summary = useMemo(() => {
    const latestYm = deals[0]?.ym;
    const latest = deals.filter((d) => d.ym === latestYm);
    const trades = latest.filter((d) => d.type === "매매");
    const jeonse = latest.filter((d) => d.type === "전세");
    const wolse = latest.filter((d) => d.type === "월세");
    const avg = (arr: UnifiedDeal[]) =>
      arr.length
        ? Math.round(arr.reduce((s, d) => s + d.amount, 0) / arr.length)
        : 0;
    return {
      latestYm,
      trade: { count: trades.length, avg: avg(trades) },
      jeonse: { count: jeonse.length, avg: avg(jeonse) },
      wolse: { count: wolse.length },
    };
  }, [deals]);

  const ymLabel = summary.latestYm
    ? `${summary.latestYm.slice(2, 4)}년 ${parseInt(summary.latestYm.slice(4), 10)}월`
    : "";

  return (
    <div className="pt-16 min-h-screen bg-cream">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Link href="/" className="hover:text-navy cursor-pointer">홈</Link>
            <span>/</span>
            <Link href="/apartments" className="hover:text-navy cursor-pointer">
              아파트 단지 정보
            </Link>
            <span>/</span>
            <span className="text-navy font-medium truncate">{name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/apartments"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-navy transition-colors mb-6 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          단지 목록으로
        </Link>

        {/* Header */}
        <div className="bg-white rounded-sm border border-border p-6 mb-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-navy rounded-sm flex items-center justify-center flex-shrink-0">
              <Building2 className="w-6 h-6 text-gold" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-navy mb-1.5">{name}</h1>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-text-muted">
                {buildYear && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    {buildYear}년 준공
                  </span>
                )}
                {households && (
                  <>
                    <span className="text-border">|</span>
                    <span>{households.toLocaleString()}세대</span>
                  </>
                )}
                {dongs && (
                  <>
                    <span className="text-border">|</span>
                    <span>{dongs}개동</span>
                  </>
                )}
              </div>
              <div className="flex items-center gap-1 mt-1.5 text-xs text-text-light">
                <MapPin className="w-3 h-3" />
                경기 양주시 옥정동 {jibun}
              </div>
            </div>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-sm border border-border p-4">
            <div className="text-xs text-text-muted mb-1">{ymLabel} 매매</div>
            <div className="text-lg font-bold text-navy">
              {summary.trade.count > 0
                ? `${formatAmount(String(summary.trade.avg))}`
                : "-"}
            </div>
            <div className="text-xs text-text-light mt-0.5">
              {summary.trade.count}건 거래
            </div>
          </div>
          <div className="bg-white rounded-sm border border-border p-4">
            <div className="text-xs text-text-muted mb-1">{ymLabel} 전세</div>
            <div className="text-lg font-bold text-teal">
              {summary.jeonse.count > 0
                ? `${formatAmount(String(summary.jeonse.avg))}`
                : "-"}
            </div>
            <div className="text-xs text-text-light mt-0.5">
              {summary.jeonse.count}건 거래
            </div>
          </div>
          <div className="bg-white rounded-sm border border-border p-4">
            <div className="text-xs text-text-muted mb-1">{ymLabel} 월세</div>
            <div className="text-lg font-bold text-gold-dark">
              {summary.wolse.count}건
            </div>
            <div className="text-xs text-text-light mt-0.5">최근 거래</div>
          </div>
        </div>

        {/* Chart */}
        <div className="bg-white rounded-sm border border-border p-6 mb-5">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold text-navy">시세 추이 (VS 가격비교)</h2>
            <span className="text-xs text-text-light">최근 24개월</span>
          </div>
          <p className="text-xs text-text-muted mb-5">
            월별 매매·전세 평균가와 거래량 (국토교통부 실거래 기준)
          </p>
          {trend.length > 0 ? (
            <AptComposedChart data={trend} />
          ) : (
            <div className="py-16 text-center text-text-muted text-sm">
              차트를 표시할 거래 데이터가 부족합니다.
            </div>
          )}
        </div>

        {/* Transaction list */}
        <div className="bg-white rounded-sm border border-border overflow-hidden mb-6">
          <div className="p-5 border-b border-border">
            <h2 className="text-base font-bold text-navy mb-3">실거래 내역</h2>

            {/* Deal kind filter */}
            <div className="flex flex-wrap gap-2 mb-3">
              {(["전체", "매매", "전세", "월세"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => setDealKind(k)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-sm border transition-colors duration-150 cursor-pointer ${
                    dealKind === k
                      ? "bg-navy text-white border-navy"
                      : "border-border text-text-muted hover:border-navy hover:text-navy"
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>

            {/* Type filter */}
            <div className="flex flex-wrap gap-2">
              {typeOptions.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 text-xs rounded-sm border transition-colors duration-150 cursor-pointer ${
                    typeFilter === t
                      ? "bg-gold text-navy border-gold"
                      : "border-border text-text-muted hover:border-gold hover:text-navy"
                  }`}
                >
                  {t === "전체" ? "전체 타입" : `${t}㎡ (${toPyeong(Number(t))}평)`}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-cream/50">
                  {["계약일", "구분", "거래가격", "타입", "층"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light">
                {filteredDeals.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-10 text-center text-text-muted text-sm"
                    >
                      해당 조건의 거래 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredDeals.slice(0, 100).map((d, i) => (
                    <tr key={i} className="hover:bg-cream/40 transition-colors">
                      <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">
                        {d.dateLabel}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-sm ${typeBg[d.type]}`}
                          >
                            {d.type}
                          </span>
                          {d.contractType && (
                            <span
                              className={`text-[10px] font-medium px-1.5 py-0.5 rounded-sm ${
                                d.contractType === "갱신"
                                  ? "bg-gold/10 text-gold-dark"
                                  : "bg-navy/5 text-navy"
                              }`}
                            >
                              {d.contractType}
                              {d.useRRRight ? "·갱신권" : ""}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`text-sm font-bold ${typeColor[d.type]}`}>
                          {formatAmount(String(d.amount))}
                          {d.type === "월세" && d.monthly > 0 && (
                            <span className="text-gold-dark">
                              {" "}/ {d.monthly}만
                            </span>
                          )}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text whitespace-nowrap">
                        {d.type84}㎡
                        <span className="text-text-light">
                          {" "}({toPyeong(d.area)}평)
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-text whitespace-nowrap">
                        {d.floor}층
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {filteredDeals.length > 100 && (
            <div className="p-3 text-center text-xs text-text-light border-t border-border-light">
              최근 100건만 표시됩니다 (전체 {filteredDeals.length}건)
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="bg-navy rounded-sm p-6 text-center">
          <h2 className="text-lg font-bold text-white mb-2">
            {name} 매물이 궁금하신가요?
          </h2>
          <p className="text-white/60 text-sm mb-5">
            옥정동 전문 공인중개사가 이 단지의 현재 매물과 시세를 안내해
            드립니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gold text-navy font-semibold rounded-sm hover:bg-gold-light transition-colors duration-200 cursor-pointer"
            >
              <Phone className="w-4 h-4" />이 단지 상담 신청
            </Link>
            <Link
              href="/agents"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-white/20 text-white font-medium rounded-sm hover:bg-white/5 transition-colors duration-200 cursor-pointer"
            >
              담당 중개사 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
