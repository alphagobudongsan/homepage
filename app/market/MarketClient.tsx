"use client";

import { useState, useMemo } from "react";
import { TradeItem, RentItem, formatAmount } from "@/lib/molit";
import { TrendingUp, TrendingDown, BarChart3, List, Building2, Ruler, Flame, Wallet, ArrowLeftRight, Pointer } from "lucide-react";
import HoverFillButton from "@/components/ui/hover-fill-button";
import SelectMenu from "@/components/ui/select-menu";

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
  // 모바일 통합 리스트 종류 필터 (범례 클릭)
  const [mobileKind, setMobileKind] = useState<"전체" | "매매" | "전세" | "월세">("전체");
  // 단지 드롭다운 '탭하세요' 손가락 힌트 (한 번 누르면 사라짐)
  const [tapHintDone, setTapHintDone] = useState(false);
  // 첫 화면 기본 단지: 옥정센트럴파크푸르지오 (매매·전월세 어느 쪽에든 있으면 그 이름, 없으면 전체)
  const [complex, setComplex] = useState(() => {
    const match = [...currentTrades, ...rentData].find(
      (d) => normalizeName(d.aptNm) === normalizeName("옥정센트럴파크푸르지오")
    );
    return match ? match.aptNm : "전체";
  });
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

  // 특정 단지를 선택하면 아파트명이 모두 같으므로 칼럼 숨김 (모바일 가독성)
  const showAptName = complex === "전체";

  // 모바일 통합 리스트: 매매 + 전세 + 월세를 시간순으로 한 리스트에 (색상 구분)
  const mobileDeals = useMemo(() => {
    type Deal = {
      kind: "매매" | "전세" | "월세";
      aptNm: string;
      price: string;
      area: string;
      floor: string;
      date: string;
      sortKey: number;
      isRenew: boolean;
    };
    const key = (y: string, m: string, d: string) =>
      Number(`${y}${m.padStart(2, "0")}${d.padStart(2, "0")}`);
    const out: Deal[] = [];
    filteredTrades.forEach((t) =>
      out.push({
        kind: "매매",
        aptNm: t.aptNm,
        price: `${formatAmount(t.dealAmount)}원`,
        area: `${parseFloat(t.excluUseAr).toFixed(1)}㎡`,
        floor: `${t.floor}층`,
        date: `${t.dealYear}.${t.dealMonth}.${t.dealDay}`,
        sortKey: key(t.dealYear, t.dealMonth, t.dealDay),
        isRenew: false,
      })
    );
    filteredRents.forEach((r) => {
      const isJeonse = !r.monthlyRent || r.monthlyRent === "0";
      out.push({
        kind: isJeonse ? "전세" : "월세",
        aptNm: r.aptNm,
        price: isJeonse
          ? `${formatAmount(r.deposit)}원`
          : `${formatAmount(r.deposit)} / 월 ${r.monthlyRent}만`,
        area: `${parseFloat(r.excluUseAr).toFixed(1)}㎡`,
        floor: `${r.floor}층`,
        date: `${r.dealYear}.${r.dealMonth}.${r.dealDay}`,
        sortKey: key(r.dealYear, r.dealMonth, r.dealDay),
        isRenew: r.contractType === "갱신",
      });
    });
    return out.sort((a, b) => b.sortKey - a.sortKey);
  }, [filteredTrades, filteredRents]);

  const kindColor: Record<string, string> = {
    매매: "bg-gold",
    전세: "bg-blue-600",
    월세: "bg-green-600",
  };

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
            경기도 양주시 옥정동 아파트 실거래가 및 전월세 현황
            <span className="block sm:inline sm:ml-1">({displayYmd} 기준)</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs + Filters */}
        <div className="bg-white rounded-sm border border-border mb-6">
          {/* 탭: PC 전용 (모바일은 통합 리스트로 대체) */}
          <div className="hidden lg:flex items-center gap-3 p-4 border-b border-border">
            {[
              { key: "trade", label: "매매 실거래가" },
              { key: "rent", label: "전월세" },
            ].map((t) => (
              <HoverFillButton
                key={t.key}
                active={tab === t.key}
                onClick={() => setTab(t.key as "trade" | "rent")}
                textClassName="px-5 py-2.5 text-sm"
              >
                {t.label}
              </HoverFillButton>
            ))}
          </div>

          <div className="p-4 space-y-4 border-b border-border-light">
            {/* Dropdown selectors */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* 아파트 단지 선택 */}
              <div className="flex-1">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-navy mb-1.5">
                  <Building2 className="w-3.5 h-3.5 text-gold" />
                  아파트 단지 선택
                </label>
                <div
                  className="relative"
                  onClick={() => setTapHintDone(true)}
                >
                  <SelectMenu
                    ariaLabel="아파트 단지 선택"
                    value={complex}
                    onChange={(v) => {
                      setComplex(v);
                      setTapHintDone(true);
                    }}
                    options={complexOptions.map((c) => ({
                      value: c,
                      label: c === "전체" ? "전체 단지" : c,
                    }))}
                  />
                  {/* 탭하세요 손가락 힌트 */}
                  {!tapHintDone && (
                    <div className="absolute -right-1 -bottom-5 z-20 pointer-events-none flex flex-col items-center">
                      <Pointer className="w-6 h-6 text-gold fill-white drop-shadow animate-tap-hint" />
                      <span className="mt-0.5 text-[10px] font-bold text-gold bg-white/90 px-1.5 py-0.5 rounded-sm shadow-sm whitespace-nowrap">
                        탭하여 단지 선택
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* 면적 선택 */}
              <div className="sm:w-56">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-navy mb-1.5">
                  <Ruler className="w-3.5 h-3.5 text-gold" />
                  면적 선택
                </label>
                <SelectMenu
                  ariaLabel="면적 선택"
                  value={sizeRange}
                  onChange={setSizeRange}
                  options={SIZE_RANGES.map((s) => ({
                    value: s,
                    label: s === "전체" ? "전체 면적" : s,
                  }))}
                />
              </div>
            </div>

            {/* 인기 단지 (고정) */}
            {popularOptions.length > 0 && (
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5 pt-1">
                <span className="flex items-center gap-1 text-xs font-bold text-gold whitespace-nowrap">
                  <Flame className="w-3.5 h-3.5" />
                  인기 단지
                </span>
                <HoverFillButton
                  active={complex === "전체"}
                  onClick={() => setComplex("전체")}
                  textClassName="px-3 py-1.5 text-xs"
                >
                  전체
                </HoverFillButton>
                {popularOptions.map((c) => (
                  <HoverFillButton
                    key={c}
                    active={complex === c}
                    onClick={() => setComplex(c)}
                    textClassName="px-3 py-1.5 text-xs"
                  >
                    {c}
                  </HoverFillButton>
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

        {/* 모바일 가로 스크롤 힌트 (전체 단지일 때만 칼럼이 많음) */}
        {showAptName && (
          <p className="hidden lg:flex items-center justify-end gap-1 text-[11px] text-text-light mb-1.5">
            <span>좌우로 밀어서 더 보기</span>
            <ArrowLeftRight className="w-3 h-3" />
          </p>
        )}

        {/* Table (PC 전용) */}
        <div className="hidden lg:block bg-white rounded-sm border border-border mb-6">
          {tab === "trade" ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/50">
                    {(showAptName
                      ? ["유형", "아파트명", "전용면적", "층", "거래일", "거래금액"]
                      : ["유형", "전용면적", "층", "거래일", "거래금액"]
                    ).map((h) => (
                      <th
                        key={h}
                        className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {filteredTrades.length === 0 ? (
                    <tr>
                      <td colSpan={showAptName ? 6 : 5} className="px-4 py-10 text-center text-text-muted text-sm">
                        해당 조건의 거래 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredTrades.map((t, i) => (
                      <tr key={i} className="hover:bg-cream/40 transition-colors">
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-sm text-white bg-gold">
                            매매
                          </span>
                        </td>
                        {showAptName && (
                          <td className="px-3 sm:px-4 py-3 text-sm font-medium text-navy whitespace-nowrap">
                            {t.aptNm}
                          </td>
                        )}
                        <td className="px-3 sm:px-4 py-3 text-sm text-text whitespace-nowrap">
                          {parseFloat(t.excluUseAr).toFixed(1)}㎡
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-sm text-text whitespace-nowrap">
                          {t.floor}층
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-sm text-text-muted whitespace-nowrap">
                          {t.dealYear}.{t.dealMonth}.{t.dealDay}
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-sm font-bold text-navy whitespace-nowrap">
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
                    {(showAptName
                      ? ["아파트명", "전용면적", "층", "거래일", "유형", "보증금", "월세", "계약구분"]
                      : ["전용면적", "층", "거래일", "유형", "보증금", "월세", "계약구분"]
                    ).map((h) => (
                      <th
                        key={h}
                        className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-text-muted uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light">
                  {filteredRents.length === 0 ? (
                    <tr>
                      <td colSpan={showAptName ? 8 : 7} className="px-4 py-10 text-center text-text-muted text-sm">
                        해당 조건의 전월세 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    filteredRents.map((r, i) => {
                      const isJeonse = !r.monthlyRent || r.monthlyRent === "0";
                      return (
                        <tr key={i} className="hover:bg-cream/40 transition-colors">
                          {showAptName && (
                            <td className="px-3 sm:px-4 py-3 text-sm font-medium text-navy whitespace-nowrap">
                              {r.aptNm}
                            </td>
                          )}
                          <td className="px-3 sm:px-4 py-3 text-sm text-text whitespace-nowrap">
                            {parseFloat(r.excluUseAr).toFixed(1)}㎡
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-sm text-text whitespace-nowrap">
                            {r.floor}층
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-sm text-text-muted whitespace-nowrap">
                            {r.dealYear}.{r.dealMonth}.{r.dealDay}
                          </td>
                          <td className="px-3 sm:px-4 py-3">
                            <span
                              className={`text-xs font-bold px-2 py-0.5 rounded-sm text-white ${
                                isJeonse ? "bg-blue-600" : "bg-green-600"
                              }`}
                            >
                              {isJeonse ? "전세" : "월세"}
                            </span>
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-sm font-bold text-navy whitespace-nowrap">
                            {formatAmount(r.deposit)}원
                          </td>
                          <td className="px-3 sm:px-4 py-3 text-sm text-text whitespace-nowrap">
                            {isJeonse ? "-" : `${r.monthlyRent}만원`}
                          </td>
                          <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
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

        {/* 모바일 통합 실거래 리스트 (매매/전세/월세 색상 구분 + 클릭 필터) */}
        <div className="lg:hidden bg-white rounded-sm border border-border mb-6 overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-3 border-b border-border-light">
            {([
              { key: "전체", dot: "bg-navy", active: "bg-navy" },
              { key: "매매", dot: "bg-gold", active: "bg-gold" },
              { key: "전세", dot: "bg-blue-600", active: "bg-blue-600" },
              { key: "월세", dot: "bg-green-600", active: "bg-green-600" },
            ] as const).map((f) => {
              const isOn = mobileKind === f.key;
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => setMobileKind(f.key)}
                  className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                    isOn
                      ? `${f.active} text-white border-transparent`
                      : "bg-white text-navy border-border"
                  }`}
                >
                  {f.key !== "전체" && (
                    <span
                      className={`w-2 h-2 rounded-full ${isOn ? "bg-white" : f.dot}`}
                    />
                  )}
                  {f.key}
                </button>
              );
            })}
          </div>
          {mobileDeals.filter((d) => mobileKind === "전체" || d.kind === mobileKind).length === 0 ? (
            <div className="px-4 py-10 text-center text-text-muted text-sm">
              해당 조건의 거래 내역이 없습니다.
            </div>
          ) : (
            <div className="divide-y divide-border-light">
              {mobileDeals
                .filter((d) => mobileKind === "전체" || d.kind === mobileKind)
                .map((d, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-sm text-white ${kindColor[d.kind]}`}
                      >
                        {d.kind}
                      </span>
                      {d.isRenew && (
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-navy/5 text-navy">
                          갱신
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-text-muted">{d.date}</span>
                  </div>
                  {showAptName && (
                    <p className="text-sm font-medium text-navy mb-0.5 truncate">
                      {d.aptNm}
                    </p>
                  )}
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-base font-bold text-navy">{d.price}</span>
                    <span className="text-xs text-text-muted whitespace-nowrap">
                      {d.area} · {d.floor}
                    </span>
                  </div>
                </div>
              ))}
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
