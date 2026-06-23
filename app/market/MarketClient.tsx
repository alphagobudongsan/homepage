"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { TradeItem, RentItem, formatAmount } from "@/lib/molit";
import { TrendingUp, TrendingDown, BarChart3, List, Building2, Ruler, Flame, Wallet, ArrowLeftRight, Pointer, ChevronDown } from "lucide-react";
import HoverFillButton from "@/components/ui/hover-fill-button";
import SelectMenu from "@/components/ui/select-menu";
import AreaText from "@/components/AreaText";

interface Props {
  trades: TradeItem[]; // 최근 6개월 매매
  rents: RentItem[];   // 최근 6개월 전월세
  currentYmd: string;  // 데이터가 있는 최신 거래월 (yyyymm)
  accessDate: string;
}

// 거래 정렬용 키 (yyyymmdd 숫자)
const dateKey = (y: string, m: string, d: string) =>
  Number(`${y}${m.padStart(2, "0")}${d.padStart(2, "0")}`);

const SIZE_RANGES = ["전체", "60㎡ 미만", "60~85㎡", "85~110㎡", "110㎡ 이상"];

// 면적 선택 드롭다운 표시 라벨 (평 병기 — 60㎡≈24평, 85㎡≈34평, 110㎡≈44평)
const SIZE_RANGE_LABEL: Record<string, string> = {
  "전체": "전체 면적",
  "60㎡ 미만": "60㎡ 미만 (24평 이하)",
  "60~85㎡": "60~85㎡ (24~35평)",
  "85~110㎡": "85~110㎡ (36~41평)",
  "110㎡ 이상": "110㎡ 이상 (42평 이상)",
};

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

type DealKind = "매매" | "전세" | "월세";
type TabKind = "전체" | DealKind;

// 유형별 색상 (범례·배지 공통)
const KIND_COLOR: Record<TabKind, string> = {
  전체: "bg-navy",
  매매: "bg-gold",
  전세: "bg-blue-600",
  월세: "bg-green-600",
};

// 유형별 요약 (매매=거래가 / 전세·월세=보증금). 전세·월세는 신규/갱신 건수도 집계
function computeSummary(kind: DealKind, trades: TradeItem[], rents: RentItem[]) {
  let amounts: number[] = [];
  let unit = "거래가";
  let newCount = 0;
  let renewCount = 0;
  if (kind === "매매") {
    amounts = trades.map((t) => parseInt(t.dealAmount.replace(/,/g, ""), 10));
    unit = "거래가";
  } else {
    const arr = rents.filter((r) => {
      const isJeonse = !r.monthlyRent || r.monthlyRent === "0";
      return kind === "전세" ? isJeonse : !isJeonse;
    });
    amounts = arr.map((r) => parseInt(r.deposit.replace(/,/g, ""), 10));
    unit = kind === "전세" ? "전세보증금" : "월세보증금";
    renewCount = arr.filter((r) => r.contractType === "갱신").length;
    newCount = arr.length - renewCount;
  }
  if (amounts.length === 0)
    return { kind, unit, count: 0, avg: 0, max: 0, min: 0, newCount: 0, renewCount: 0 };
  const avg = Math.round(amounts.reduce((a, b) => a + b, 0) / amounts.length);
  return {
    kind,
    unit,
    count: amounts.length,
    avg,
    max: Math.max(...amounts),
    min: Math.min(...amounts),
    newCount,
    renewCount,
  };
}

// 전광판 거래월 선택기 — 년/월 각각 드롭다운. 불러온 데이터 안에서 즉시 전환
function YmPicker({
  ym,
  options,
  onChange,
}: {
  ym: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  if (!ym || options.length === 0) return null;
  const year = ym.slice(0, 4);
  const month = parseInt(ym.slice(4), 10);
  const years = Array.from(new Set(options.map((o) => o.slice(0, 4)))).sort().reverse();
  const monthsInYear = options
    .filter((o) => o.slice(0, 4) === year)
    .map((o) => parseInt(o.slice(4), 10))
    .sort((a, b) => b - a);
  const selectCls =
    "appearance-none bg-white border border-border rounded-sm pl-2 pr-5 py-0.5 text-xs font-bold text-navy cursor-pointer focus:outline-none focus:border-gold hover:border-gold transition-colors";

  return (
    <span className="inline-flex items-center gap-1">
      <span className="relative inline-flex items-center">
        <select
          aria-label="거래 년도 선택"
          value={year}
          onChange={(e) => {
            const ny = e.target.value;
            const ms = options
              .filter((o) => o.slice(0, 4) === ny)
              .map((o) => o.slice(4))
              .sort()
              .reverse();
            onChange(`${ny}${ms[0]}`);
          }}
          className={selectCls}
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}년
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-text-muted absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
      </span>
      <span className="relative inline-flex items-center">
        <select
          aria-label="거래 월 선택"
          value={month}
          onChange={(e) => onChange(`${year}${String(e.target.value).padStart(2, "0")}`)}
          className={selectCls}
        >
          {monthsInYear.map((m) => (
            <option key={m} value={m}>
              {m}월
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-text-muted absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none" />
      </span>
    </span>
  );
}

export default function MarketClient({ trades, rents, currentYmd, accessDate }: Props) {
  const [tab, setTab] = useState<TabKind>("전체");
  // 모바일 통합 리스트 종류 필터 (범례 클릭)
  const [mobileKind, setMobileKind] = useState<"전체" | "매매" | "전세" | "월세">("전체");
  // 단지 드롭다운 '탭하세요' 손가락 힌트 (한 번 누르면 사라짐)
  const [tapHintDone, setTapHintDone] = useState(false);
  // 과거 거래 더보기 (리스트만 과거 월까지 펼침. 전광판은 최신월 고정)
  const [showMore, setShowMore] = useState(false);
  // 홈에서 카드 클릭 시 ?complex=단지명 으로 들어오면 그 단지 선택
  const searchParams = useSearchParams();
  const [complex, setComplex] = useState(() => {
    const all = [...trades, ...rents];
    const fromUrl = searchParams.get("complex");
    if (fromUrl) {
      const m = all.find(
        (d) => d.aptNm === fromUrl || normalizeName(d.aptNm) === normalizeName(fromUrl)
      );
      if (m) return m.aptNm;
    }
    // 기본 단지: 옥정센트럴파크푸르지오 (있으면 그 이름, 없으면 전체)
    const match = all.find(
      (d) => normalizeName(d.aptNm) === normalizeName("옥정센트럴파크푸르지오")
    );
    return match ? match.aptNm : "전체";
  });
  const [sizeRange, setSizeRange] = useState("전체");
  // 전광판 기준 거래월 (드롭다운 선택, 기본=최신월). 불러온 데이터 안에서 즉시 전환(지연 없음)
  const [selectedYm, setSelectedYm] = useState(currentYmd);

  const ymOf = (y: string, m: string) => `${y}${m.padStart(2, "0")}`;

  // 데이터에 존재하는 거래월 목록 (최신순)
  const availableYms = useMemo(() => {
    const set = new Set<string>();
    trades.forEach((t) => set.add(ymOf(t.dealYear, t.dealMonth)));
    rents.forEach((r) => set.add(ymOf(r.dealYear, r.dealMonth)));
    return Array.from(set).filter(Boolean).sort().reverse();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trades, rents]);

  // 선택한 거래월 데이터 (전광판용)
  const latestTrades = useMemo(
    () => trades.filter((t) => ymOf(t.dealYear, t.dealMonth) === selectedYm),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trades, selectedYm]
  );
  const latestRents = useMemo(
    () => rents.filter((r) => ymOf(r.dealYear, r.dealMonth) === selectedYm),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rents, selectedYm]
  );

  // 단지 드롭다운 목록: 6개월 전체 데이터 기준
  const complexOptions = useMemo(() => {
    const source =
      tab === "매매" ? trades : tab === "전체" ? [...trades, ...rents] : rents;
    const names = Array.from(new Set(source.map((d) => d.aptNm))).sort();
    return ["전체", ...names];
  }, [tab, trades, rents]);

  // 인기 단지 칩: 실제 데이터에 존재하는 단지명으로 매핑 (공백 무시)
  const popularOptions = useMemo(() => {
    return POPULAR_COMPLEXES.map((p) =>
      complexOptions.find((c) => normalizeName(c) === normalizeName(p))
    ).filter((c): c is string => Boolean(c));
  }, [complexOptions]);

  const matchFilter = (aptNm: string, ar: string) =>
    (complex === "전체" || aptNm === complex) && sizeInRange(ar, sizeRange);

  // 전광판/요약용: 최신 거래월만
  const filteredTrades = useMemo(
    () => latestTrades.filter((t) => matchFilter(t.aptNm, t.excluUseAr)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [latestTrades, complex, sizeRange]
  );
  const filteredRents = useMemo(
    () => latestRents.filter((r) => matchFilter(r.aptNm, r.excluUseAr)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [latestRents, complex, sizeRange]
  );

  // 리스트용: 6개월 전체(더보기) — 최신순 정렬
  const allFilteredTrades = useMemo(
    () =>
      trades
        .filter((t) => matchFilter(t.aptNm, t.excluUseAr))
        .sort((a, b) => dateKey(b.dealYear, b.dealMonth, b.dealDay) - dateKey(a.dealYear, a.dealMonth, a.dealDay)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trades, complex, sizeRange]
  );
  const allFilteredRents = useMemo(
    () =>
      rents
        .filter((r) => matchFilter(r.aptNm, r.excluUseAr))
        .sort((a, b) => dateKey(b.dealYear, b.dealMonth, b.dealDay) - dateKey(a.dealYear, a.dealMonth, a.dealDay)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rents, complex, sizeRange]
  );

  // 실제 표시(리스트): 더보기 전엔 최신월만, 누르면 6개월 전체
  const sortLatestFirst = <T extends { dealYear: string; dealMonth: string; dealDay: string }>(arr: T[]) =>
    [...arr].sort((a, b) => dateKey(b.dealYear, b.dealMonth, b.dealDay) - dateKey(a.dealYear, a.dealMonth, a.dealDay));
  const displayedTrades = showMore ? allFilteredTrades : sortLatestFirst(filteredTrades);
  const displayedRents = showMore ? allFilteredRents : sortLatestFirst(filteredRents);
  // PC 전세/월세 탭: 해당 유형만
  const displayedRentsForTab = displayedRents.filter((r) => {
    const isJeonse = !r.monthlyRent || r.monthlyRent === "0";
    return tab === "월세" ? !isJeonse : isJeonse;
  });
  const hasMore =
    allFilteredTrades.length > filteredTrades.length ||
    allFilteredRents.length > filteredRents.length;

  // 유형별 요약 (매매=거래가 / 전세·월세=보증금). 전체는 건수만 따로 사용
  const pcSummary = useMemo(
    () => computeSummary(tab === "전체" ? "매매" : tab, filteredTrades, filteredRents),
    [tab, filteredTrades, filteredRents]
  );

  // 모바일 전광판: 범례 선택(전체는 매매 기준)
  const mobileSummary = useMemo(
    () => computeSummary(mobileKind === "전체" ? "매매" : mobileKind, filteredTrades, filteredRents),
    [mobileKind, filteredTrades, filteredRents]
  );

  // '전체' 전광판용 유형별 건수 (최신 거래월) — PC·모바일 공용
  const counts = useMemo(() => {
    const maemae = filteredTrades.length;
    const jeonse = filteredRents.filter((r) => !r.monthlyRent || r.monthlyRent === "0").length;
    const wolse = filteredRents.length - jeonse;
    return { total: maemae + jeonse + wolse, maemae, jeonse, wolse };
  }, [filteredTrades, filteredRents]);

  const displayYmd = selectedYm
    ? `${selectedYm.slice(0, 4)}년 ${parseInt(selectedYm.slice(4), 10)}월`
    : "";

  // 특정 단지를 선택하면 아파트명이 모두 같으므로 칼럼 숨김 (모바일 가독성)
  const showAptName = complex === "전체";

  // 모바일 통합 리스트: 매매 + 전세 + 월세를 시간순으로 한 리스트에 (색상 구분)
  const mobileDeals = useMemo(() => {
    type Deal = {
      kind: "매매" | "전세" | "월세";
      aptNm: string;
      price: string;
      area: number;
      floor: string;
      date: string;
      sortKey: number;
      isRenew: boolean;
    };
    const key = (y: string, m: string, d: string) =>
      Number(`${y}${m.padStart(2, "0")}${d.padStart(2, "0")}`);
    const out: Deal[] = [];
    displayedTrades.forEach((t) =>
      out.push({
        kind: "매매",
        aptNm: t.aptNm,
        price: `${formatAmount(t.dealAmount)}원`,
        area: parseFloat(t.excluUseAr),
        floor: `${t.floor}층`,
        date: `${t.dealYear}.${t.dealMonth}.${t.dealDay}`,
        sortKey: key(t.dealYear, t.dealMonth, t.dealDay),
        isRenew: false,
      })
    );
    displayedRents.forEach((r) => {
      const isJeonse = !r.monthlyRent || r.monthlyRent === "0";
      out.push({
        kind: isJeonse ? "전세" : "월세",
        aptNm: r.aptNm,
        price: isJeonse
          ? `${formatAmount(r.deposit)}원`
          : `${formatAmount(r.deposit)} / 월 ${r.monthlyRent}만`,
        area: parseFloat(r.excluUseAr),
        floor: `${r.floor}층`,
        date: `${r.dealYear}.${r.dealMonth}.${r.dealDay}`,
        sortKey: key(r.dealYear, r.dealMonth, r.dealDay),
        isRenew: r.contractType === "갱신",
      });
    });
    return out.sort((a, b) => b.sortKey - a.sortKey);
  }, [displayedTrades, displayedRents]);

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
            <span className="block sm:inline sm:ml-1">
              (<span className="text-gold font-semibold">{accessDate}</span> 기준)
            </span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tabs + Filters */}
        <div className="bg-white rounded-sm border border-border mb-6">
          {/* 탭: PC 전용 (전체/매매/전세/월세). 모바일은 통합 리스트로 대체 */}
          <div className="hidden lg:flex items-center gap-3 p-4 border-b border-border">
            {(["전체", "매매", "전세", "월세"] as TabKind[]).map((k) => (
              <HoverFillButton
                key={k}
                active={tab === k}
                onClick={() => setTab(k)}
                textClassName="px-5 py-2.5 text-sm"
              >
                {k}
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
                    label: SIZE_RANGE_LABEL[s] ?? s,
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

        {/* 전광판 — PC 전용 (탭 기준) */}
        <div className="hidden lg:block mb-6">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Building2 className="w-4 h-4 text-gold" />
            <h2 className="text-base font-bold text-navy">
              {complex === "전체" ? "옥정동 전체 단지" : complex}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-sm bg-cream border border-border text-text-muted font-medium">
              {sizeRange === "전체" ? "전체 면적" : sizeRange}
            </span>
            <span className="text-xs font-bold text-navy">· {tab} 기준</span>
            <YmPicker ym={selectedYm} options={availableYms} onChange={setSelectedYm} />

            {/* 색상 범례 (클릭 = 탭과 연동) */}
            <div className="flex items-center gap-1.5 ml-auto">
              {(["전체", "매매", "전세", "월세"] as TabKind[]).map((k) => {
                const on = tab === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setTab(k)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border transition-colors cursor-pointer ${
                      on ? `${KIND_COLOR[k]} text-white border-transparent` : "bg-white text-navy border-border hover:border-navy"
                    }`}
                  >
                    <span className={`w-2 h-2 rounded-full ${on ? "bg-white" : KIND_COLOR[k]}`} />
                    {k}
                  </button>
                );
              })}
            </div>
          </div>

          {tab === "전체" ? (
            // 전체: 전체 건수 + 유형별 건수
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: "전체 거래 건수", value: `${counts.total}건`, dot: "", icon: List },
                { label: "매매", value: `${counts.maemae}건`, dot: KIND_COLOR.매매, icon: null },
                { label: "전세", value: `${counts.jeonse}건`, dot: KIND_COLOR.전세, icon: null },
                { label: "월세", value: `${counts.wolse}건`, dot: KIND_COLOR.월세, icon: null },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-sm border border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    {s.icon ? (
                      <s.icon className="w-4 h-4 text-gold" />
                    ) : (
                      <span className={`w-3 h-3 rounded-full ${s.dot}`} />
                    )}
                    <span className="text-xs text-text-muted">{s.label}</span>
                  </div>
                  <div className="text-xl font-bold text-navy">{s.value}</div>
                </div>
              ))}
            </div>
          ) : pcSummary.count === 0 ? (
            <div className="bg-white rounded-sm border border-border p-6 text-center text-sm text-text-muted">
              해당 조건의 {tab} 내역이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  label: `${tab} 거래 건수`,
                  value: `${pcSummary.count}건`,
                  newRenew: tab !== "매매",
                  icon: List,
                },
                { label: `평균 ${pcSummary.unit}`, value: `${formatAmount(String(pcSummary.avg))}원`, newRenew: false, icon: tab === "매매" ? BarChart3 : Wallet },
                { label: `최고 ${pcSummary.unit}`, value: `${formatAmount(String(pcSummary.max))}원`, newRenew: false, icon: TrendingUp },
                { label: `최저 ${pcSummary.unit}`, value: `${formatAmount(String(pcSummary.min))}원`, newRenew: false, icon: TrendingDown },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-sm border border-border p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <s.icon className="w-4 h-4 text-gold" />
                    <span className="text-xs text-text-muted">{s.label}</span>
                  </div>
                  <div className="text-xl font-bold text-navy">{s.value}</div>
                  {s.newRenew && (
                    <div className="text-xs font-bold mt-1">
                      <span className="text-blue-600">신규 {pcSummary.newCount}</span>
                      <span className="text-text-light mx-1">·</span>
                      <span className="text-gold-dark">갱신 {pcSummary.renewCount}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 전광판 — 모바일 전용 (범례 종류에 반응) */}
        <div className="lg:hidden mb-6">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-3">
            <Building2 className="w-4 h-4 text-gold flex-shrink-0" />
            <h2 className="text-base font-bold text-navy">
              {complex === "전체" ? "옥정동 전체 단지" : complex}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-sm bg-cream border border-border text-text-muted font-medium">
              {sizeRange === "전체" ? "전체 면적" : sizeRange}
            </span>
            <span className="text-xs font-bold text-navy">· {mobileKind} 기준</span>
            <YmPicker ym={selectedYm} options={availableYms} onChange={setSelectedYm} />
          </div>

          {mobileKind === "전체" ? (
            // 전체: 전체 건수 + 유형별 건수
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "전체 거래 건수", value: `${counts.total}건`, dot: "", icon: List },
                { label: "매매", value: `${counts.maemae}건`, dot: KIND_COLOR.매매, icon: null },
                { label: "전세", value: `${counts.jeonse}건`, dot: KIND_COLOR.전세, icon: null },
                { label: "월세", value: `${counts.wolse}건`, dot: KIND_COLOR.월세, icon: null },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-sm border border-border p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {s.icon ? (
                      <s.icon className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    ) : (
                      <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${s.dot}`} />
                    )}
                    <span className="text-[11px] text-text-muted">{s.label}</span>
                  </div>
                  <div className="text-lg font-bold text-navy">{s.value}</div>
                </div>
              ))}
            </div>
          ) : mobileSummary.count === 0 ? (
            <div className="bg-white rounded-sm border border-border p-6 text-center text-sm text-text-muted">
              해당 조건의 {mobileKind} 내역이 없습니다.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: `${mobileSummary.kind} 거래 건수`,
                  value: `${mobileSummary.count}건`,
                  newRenew: mobileSummary.kind !== "매매",
                  icon: List,
                },
                { label: `평균 ${mobileSummary.unit}`, value: `${formatAmount(String(mobileSummary.avg))}원`, newRenew: false, icon: mobileSummary.kind === "매매" ? BarChart3 : Wallet },
                { label: `최고 ${mobileSummary.unit}`, value: `${formatAmount(String(mobileSummary.max))}원`, newRenew: false, icon: TrendingUp },
                { label: `최저 ${mobileSummary.unit}`, value: `${formatAmount(String(mobileSummary.min))}원`, newRenew: false, icon: TrendingDown },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-sm border border-border p-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <s.icon className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="text-[11px] text-text-muted">{s.label}</span>
                  </div>
                  <div className="text-lg font-bold text-navy">{s.value}</div>
                  {s.newRenew && (
                    <div className="text-xs font-bold mt-1">
                      <span className="text-blue-600">신규 {mobileSummary.newCount}</span>
                      <span className="text-text-light mx-1">·</span>
                      <span className="text-gold-dark">갱신 {mobileSummary.renewCount}</span>
                    </div>
                  )}
                </div>
              ))}
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
          {tab === "전체" ? (
            // 전체: 매매+전세+월세 통합 표 (최신순)
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-cream/50">
                    {(showAptName
                      ? ["유형", "아파트명", "전용면적", "층", "거래일", "금액"]
                      : ["유형", "전용면적", "층", "거래일", "금액"]
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
                  {mobileDeals.length === 0 ? (
                    <tr>
                      <td colSpan={showAptName ? 6 : 5} className="px-4 py-10 text-center text-text-muted text-sm">
                        해당 조건의 거래 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    mobileDeals.map((d, i) => (
                      <tr key={i} className="hover:bg-cream/40 transition-colors">
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-sm text-white ${KIND_COLOR[d.kind]}`}>
                            {d.kind}
                          </span>
                        </td>
                        {showAptName && (
                          <td className="px-3 sm:px-4 py-3 text-sm font-medium text-navy whitespace-nowrap">
                            {d.aptNm}
                          </td>
                        )}
                        <td className="px-3 sm:px-4 py-3 text-sm text-text whitespace-nowrap">
                          <AreaText complex={d.aptNm} area={d.area} decimals={1} />
                        </td>
                        <td className="px-3 sm:px-4 py-3 text-sm text-text whitespace-nowrap">{d.floor}</td>
                        <td className="px-3 sm:px-4 py-3 text-sm text-text-muted whitespace-nowrap">{d.date}</td>
                        <td className="px-3 sm:px-4 py-3 text-sm font-bold text-navy whitespace-nowrap">
                          {d.price}
                          {d.isRenew && (
                            <span className="ml-1.5 align-middle text-[10px] font-semibold px-1.5 py-0.5 rounded-sm bg-gold/10 text-gold-dark">
                              갱신
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          ) : tab === "매매" ? (
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
                  {displayedTrades.length === 0 ? (
                    <tr>
                      <td colSpan={showAptName ? 6 : 5} className="px-4 py-10 text-center text-text-muted text-sm">
                        해당 조건의 거래 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    displayedTrades.map((t, i) => (
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
                          <AreaText complex={t.aptNm} area={t.excluUseAr} decimals={1} />
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
                  {displayedRentsForTab.length === 0 ? (
                    <tr>
                      <td colSpan={showAptName ? 8 : 7} className="px-4 py-10 text-center text-text-muted text-sm">
                        해당 조건의 {tab} 내역이 없습니다.
                      </td>
                    </tr>
                  ) : (
                    displayedRentsForTab.map((r, i) => {
                      const isJeonse = !r.monthlyRent || r.monthlyRent === "0";
                      return (
                        <tr key={i} className="hover:bg-cream/40 transition-colors">
                          {showAptName && (
                            <td className="px-3 sm:px-4 py-3 text-sm font-medium text-navy whitespace-nowrap">
                              {r.aptNm}
                            </td>
                          )}
                          <td className="px-3 sm:px-4 py-3 text-sm text-text whitespace-nowrap">
                            <AreaText complex={r.aptNm} area={r.excluUseAr} decimals={1} />
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
                      <AreaText complex={d.aptNm} area={d.area} decimals={1} /> · {d.floor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 과거 거래 더보기 (리스트만 6개월 전체로 펼침) */}
        {hasMore && (
          <div className="flex justify-center mb-8">
            <button
              type="button"
              onClick={() => setShowMore((v) => !v)}
              className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-navy text-navy text-sm font-bold rounded-sm hover:bg-navy hover:text-white transition-colors duration-200 cursor-pointer"
            >
              {showMore ? "최근 거래만 보기" : "과거 거래 더보기 (최근 1년)"}
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${showMore ? "rotate-180" : ""}`}
              />
            </button>
          </div>
        )}

        <p className="text-xs text-text-light text-center">
          * 본 자료는 국토교통부 실거래가 공개시스템 데이터를 기반으로 합니다.
          실제 거래와 차이가 있을 수 있으므로 참고용으로만 활용하세요.
        </p>
      </div>
    </div>
  );
}
