"use client";

import { useState, useMemo } from "react";
import { TradeItem, RentItem, formatAmount } from "@/lib/molit";
import { TrendingUp, TrendingDown, BarChart3, List, Building2, Ruler, Flame, ChevronDown, Wallet } from "lucide-react";

interface Props {
  currentTrades: TradeItem[];
  prevTrades: TradeItem[];
  rentData: RentItem[];
  currentYmd: string;
}

const SIZE_RANGES = ["전체", "60㎡ 미만", "60~85㎡", "85~110㎡", "110㎡ 이상"];

// 항상 고정 노출할 인기 단지 (실제 API 단지명과 공백 무시하고 매칭)
const POPULAR_COMPLEXES = [
  "e편한세상옥정어반센트럴",
  "옥정센트럴파크푸르지오",
  "옥정중앙역중흥S-클래스센텀시티(2단지)",
  "옥정중앙역중흥S-클래스센텀시티(1단지)",
  "양주옥정신도시디에트르프레스티지",
];

// 공백 제거 후 비교용 정규화
const normalizeName = (s: string) => s.replace(/\s+/g, "");

function sizeLabel(ar: string): string {
  const n = parseFloat(ar);
  if (n < 60) return "60㎡ 미만";
  if (n < 85) return "60~85㎡";
  if (n < 110) return "85~110㎡";
  return "110㎡ 이상";
}

function sizeInRange(ar: string, range: string): boolean {
  if (range === "전체") return true;
  return sizeLabel(ar) === range;
}

export default function MarketClient({ currentTrades, prevTrades, rentData, currentYmd }: Props) {
  const [tab, setTab] = useState<"trade" | "rent">("trade");
  const [complex, setComplex] = useState("전체");
  const [sizeRange, setSizeRange] = useState("전체");

  // 실제 데이터에서 단지명 목록을 동적으로 추출
  const complexOptions = useMemo(() => {
    const source = tab === "trade" ? currentTrades : rentData;
    const names = Array.from(new Set(source.map((d) => d.aptNm))).sort();
    return ["전체", ...names];
  }, [tab, currentTrades, rentData]);

  // 인기 단지 칩: 실제 데이터에 존재하는 단지명으로 매핑 (공백 무시)
  const popularOptions = useMemo(() => {
    return POPULAR_COMPLEXES.map((p) =>
      complexOptions.find((c) => normalizeName(c) === normalizeName(p))
    ).filter((c): c is string => Boolean(c));
  }, [complexOptions]);

  const filteredTrades = useMemo(() =>
    currentTrades.filter(
      (t) =>
        (complex === "전체" || t.aptNm === complex) &&
        sizeInRange(t.excluUseAr, sizeRange)
    ),
    [currentTrades, complex, sizeRange]
  );

  const filteredRents = useMemo(() =>
    rentData.filter(
      (r) =>
        (complex === "전체" || r.aptNm === complex) &&
        sizeInRange(r.excluUseAr, sizeRange)
    ),
    [rentData, complex, sizeRange]
  );

  const summary = useMemo(() => {
    if (filteredTrades.length === 0) return null;
    const amounts = filteredTrades.map((t) =>
      parseInt(t.dealAmount.replace(/,/g, ""), 10)
    );
    const avg = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);
    const max = Math.max(...amounts);
    const min = Math.min(...amounts);
    return { avg, max, min, count: filteredTrades.length };
  }, [filteredTrades]);

  // 전월세 전광판: 전세 보증금만 기준으로 집계 (월세 제외)
  const rentSummary = useMemo(() => {
    const jeonse = filteredRents.filter(
      (r) => !r.monthlyRent || r.monthlyRent === "0"
    );
    if (jeonse.length === 0) return null;
    const deposits = jeonse.map((r) =>
      parseInt(r.deposit.replace(/,/g, ""), 10)
    );
    const avg = Math.round(deposits.reduce((a, b) => a + b, 0) / deposits.length);
    const max = Math.max(...deposits);
    const min = Math.min(...deposits);
    return { avg, max, min, count: jeonse.length };
  }, [filteredRents]);

  const displayYmd = `${currentYmd.slice(0, 4)}년 ${parseInt(currentYmd.slice(4), 10)}월`;

  return (
    <div className="pt-16 min-h-screen bg-cream">
      {/* Page Header */}
      <div className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-sm font-medium tracking-wider uppercase mb-2">
            국토교통부 실거래가 공개 데이터
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            옥정동 아파트 시세
          </h1>
          <p className="text-white/60">
            경기도 양주시 옥정동 아파트 실거래가 및 전월세 현황 ({displayYmd} 기준)
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs + Filters */}
        <div className="bg-white rounded-sm border border-border mb-6">
          <div className="flex items-center border-b border-border">
            {[
              { key: "trade", label: "매매 실거래가" },
              { key: "rent", label: "전월세" },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key as "trade" | "rent");
                  setComplex("전체");
                }}
                className={`px-6 py-4 text-sm font-semibold transition-colors duration-150 cursor-pointer border-b-2 ${
                  tab === t.key
                    ? "text-navy border-gold"
                    : "text-text-muted border-transparent hover:text-navy"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="p-4 space-y-4 border-b border-border-light">
            {/* Dropdown selectors */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* 아파트 단지 선택 */}
              <div className="flex-1">
                <label
                  htmlFor="complex-select"
                  className="flex items-center gap-1.5 text-xs font-semibold text-navy mb-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-gold" />
                  아파트 단지 선택
                </label>
                <div className="relative">
                  <select
                    id="complex-select"
                    value={complex}
                    onChange={(e) => setComplex(e.target.value)}
                    className="w-full appearance-none bg-white border border-border rounded-sm pl-3 pr-9 py-2.5 text-sm text-navy font-medium cursor-pointer hover:border-navy focus:border-gold focus:outline-none transition-colors"
                  >
                    {complexOptions.map((c) => (
                      <option key={c} value={c}>
                        {c === "전체" ? "전체 단지" : c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* 면적 선택 */}
              <div className="sm:w-56">
                <label
                  htmlFor="size-select"
                  className="flex items-center gap-1.5 text-xs font-semibold text-navy mb-1.5"
                >
                  <Ruler className="w-3.5 h-3.5 text-gold" />
                  면적 선택
                </label>
                <div className="relative">
                  <select
                    id="size-select"
                    value={sizeRange}
                    onChange={(e) => setSizeRange(e.target.value)}
                    className="w-full appearance-none bg-white border border-border rounded-sm pl-3 pr-9 py-2.5 text-sm text-navy font-medium cursor-pointer hover:border-gold focus:border-gold focus:outline-none transition-colors"
                  >
                    {SIZE_RANGES.map((s) => (
                      <option key={s} value={s}>
                        {s === "전체" ? "전체 면적" : s}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-text-muted absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* 인기 단지 (고정) */}
            {popularOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="flex items-center gap-1 text-xs font-bold text-gold whitespace-nowrap">
                  <Flame className="w-3.5 h-3.5" />
                  인기 단지
                </span>
                <button
                  onClick={() => setComplex("전체")}
                  className={`px-3 py-1.5 text-xs rounded-sm border transition-colors duration-150 cursor-pointer ${
                    complex === "전체"
                      ? "bg-navy text-white border-navy"
                      : "border-border text-text-muted hover:border-navy hover:text-navy"
                  }`}
                >
                  전체
                </button>
                {popularOptions.map((c) => (
                  <button
                    key={c}
                    onClick={() => setComplex(c)}
                    className={`px-3 py-1.5 text-xs rounded-sm border transition-colors duration-150 cursor-pointer ${
                      complex === c
                        ? "bg-navy text-white border-navy"
                        : "border-border text-text-muted hover:border-navy hover:text-navy"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 전광판 (선택 단지·면적 기준 요약) */}
        <div className="mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-gold" />
            <h2 className="text-base font-bold text-navy">
              {complex === "전체" ? "옥정동 전체 단지" : complex}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-sm bg-cream border border-border text-text-muted font-medium">
              {sizeRange === "전체" ? "전체 면적" : sizeRange}
            </span>
            <span className="text-xs text-text-light">
              · {tab === "trade" ? "매매" : "전월세"} 기준 ({displayYmd})
            </span>
          </div>

          {tab === "trade" ? (
            summary ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "조회 거래 건수", value: `${summary.count}건`, icon: List },
                  { label: "평균 거래가", value: `${formatAmount(String(summary.avg))}원`, icon: BarChart3 },
                  { label: "최고 거래가", value: `${formatAmount(String(summary.max))}원`, icon: TrendingUp },
                  { label: "최저 거래가", value: `${formatAmount(String(summary.min))}원`, icon: TrendingDown },
                ].map((s) => (
                  <div key={s.label} className="bg-white rounded-sm border border-border p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <s.icon className="w-4 h-4 text-gold" />
                      <span className="text-xs text-text-muted">{s.label}</span>
                    </div>
                    <div className="text-xl font-bold text-navy">{s.value}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-sm border border-border p-6 text-center text-sm text-text-muted">
                해당 조건의 매매 거래 내역이 없습니다.
              </div>
            )
          ) : rentSummary ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "전세 거래 건수", value: `${rentSummary.count}건`, icon: List },
                { label: "평균 전세보증금", value: `${formatAmount(String(rentSummary.avg))}원`, icon: Wallet },
                { label: "최고 전세보증금", value: `${formatAmount(String(rentSummary.max))}원`, icon: TrendingUp },
                { label: "최저 전세보증금", value: `${formatAmount(String(rentSummary.min))}원`, icon: TrendingDown },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-sm border border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="w-4 h-4 text-gold" />
                    <span className="text-xs text-text-muted">{s.label}</span>
                  </div>
                  <div className="text-xl font-bold text-navy">{s.value}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-sm border border-border p-6 text-center text-sm text-text-muted">
              해당 조건의 전세 내역이 없습니다.
            </div>
          )}
        </div>

        {/* Table */}
        <div className="bg-white rounded-sm border border-border mb-6">
          {tab === "trade" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/50">
                    {["아파트명", "전용면적", "층", "거래일", "거래금액"].map((h) => (
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
                  {filteredTrades.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-text-muted text-sm">
                        해당 조건의 거래 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredTrades.map((t, i) => (
                      <tr key={i} className="hover:bg-cream/40 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-navy whitespace-nowrap">
                          {t.aptNm}
                        </td>
                        <td className="px-4 py-3 text-sm text-text whitespace-nowrap">
                          {parseFloat(t.excluUseAr).toFixed(1)}㎡
                        </td>
                        <td className="px-4 py-3 text-sm text-text whitespace-nowrap">
                          {t.floor}층
                        </td>
                        <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">
                          {t.dealYear}.{t.dealMonth}.{t.dealDay}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-navy whitespace-nowrap">
                          {formatAmount(t.dealAmount)}원
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/50">
                    {["아파트명", "전용면적", "층", "거래일", "유형", "보증금", "월세", "계약구분"].map((h) => (
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
                  {filteredRents.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-10 text-center text-text-muted text-sm">
                        해당 조건의 전월세 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredRents.map((r, i) => {
                      const isJeonse = !r.monthlyRent || r.monthlyRent === "0";
                      return (
                        <tr key={i} className="hover:bg-cream/40 transition-colors">
                          <td className="px-4 py-3 text-sm font-medium text-navy whitespace-nowrap">
                            {r.aptNm}
                          </td>
                          <td className="px-4 py-3 text-sm text-text whitespace-nowrap">
                            {parseFloat(r.excluUseAr).toFixed(1)}㎡
                          </td>
                          <td className="px-4 py-3 text-sm text-text whitespace-nowrap">
                            {r.floor}층
                          </td>
                          <td className="px-4 py-3 text-sm text-text-muted whitespace-nowrap">
                            {r.dealYear}.{r.dealMonth}.{r.dealDay}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-semibold px-2 py-0.5 rounded-sm ${
                                isJeonse
                                  ? "bg-teal/10 text-teal"
                                  : "bg-gold/10 text-gold-dark"
                              }`}
                            >
                              {isJeonse ? "전세" : "월세"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-navy whitespace-nowrap">
                            {formatAmount(r.deposit)}원
                          </td>
                          <td className="px-4 py-3 text-sm text-text whitespace-nowrap">
                            {isJeonse ? "-" : `${r.monthlyRent}만원`}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {r.contractType ? (
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`text-xs font-semibold px-2 py-0.5 rounded-sm ${
                                    r.contractType === "갱신"
                                      ? "bg-gold/10 text-gold-dark"
                                      : "bg-navy/5 text-navy"
                                  }`}
                                >
                                  {r.contractType}
                                </span>
                                {r.useRRRight === "사용" && (
                                  <span
                                    className="text-[10px] font-medium px-1.5 py-0.5 rounded-sm bg-teal/10 text-teal"
                                    title="계약갱신청구권 사용"
                                  >
                                    갱신권
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-xs text-text-light">-</span>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-xs text-text-light text-center">
          * 본 자료는 국토교통부 실거래가 공개시스템 데이터를 기반으로 합니다.
          실제 거래와 차이가 있을 수 있으므로 참고용으로만 활용하세요.
        </p>
      </div>
    </div>
  );
}
