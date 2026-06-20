import { TradeItem, RentItem } from "./molit";

// 옥정동 주요 단지 보강 메타데이터 (세대수·동수는 국토부 실거래 API에 없어 별도 관리)
// 키: 국토부 API의 실제 aptNm과 정확히 일치해야 함
export const aptMeta: Record<string, { households?: number; dongs?: number }> = {
  "e편한세상옥정더퍼스트": { households: 1566, dongs: 17 },
  "e편한세상옥정리더스가든": { households: 938, dongs: 14 },
  "e편한세상옥정메트로포레": { households: 2038, dongs: 24 },
  "e편한세상 옥정어반센트럴": { households: 761, dongs: 8 },
  "e편한세상옥정에듀써밋": { households: 1160, dongs: 13 },
  "금호건설제이드웰엔에이치에프": { households: 526, dongs: 14 },
  "옥정센트럴파크푸르지오": { households: 1331, dongs: 14 },
  "양주옥정유림노르웨이숲": { households: 1086, dongs: 12 },
};

// 단지명 → URL slug (한글 인코딩, Next 라우트 파라미터는 자동 디코딩됨)
export function aptSlug(name: string): string {
  return encodeURIComponent(name);
}

// 전용면적 → 평형 근사 (공급면적 기준)
export function toPyeong(areaM2: number): number {
  if (!areaM2) return 0;
  return Math.round((areaM2 / 0.74) * 0.3025);
}

// 전용면적 → 타입 (84, 59 등 정수 표기)
export function areaType(areaM2: number): number {
  return Math.round(areaM2);
}

export interface AptSummary {
  name: string;
  slug: string;
  buildYear: string;
  jibun: string;
  households?: number;
  dongs?: number;
  dealCount: number;      // 최근 기간 거래 건수 (매매+전월세)
  tradeCount: number;     // 매매 건수
  rentCount: number;      // 전월세 건수
  latestPrice?: number;   // 최근 매매가 (만원)
}

// 매매/전월세 데이터를 단지별로 집계
export function aggregateApartments(
  trades: TradeItem[],
  rents: RentItem[]
): AptSummary[] {
  const map = new Map<string, AptSummary>();

  const ensure = (name: string, buildYear: string, jibun: string) => {
    if (!map.has(name)) {
      const meta = aptMeta[name] ?? {};
      map.set(name, {
        name,
        slug: aptSlug(name),
        buildYear,
        jibun,
        households: meta.households,
        dongs: meta.dongs,
        dealCount: 0,
        tradeCount: 0,
        rentCount: 0,
      });
    }
    return map.get(name)!;
  };

  // 매매: 최신 거래일/가격 추적
  const latestDate = new Map<string, number>();
  for (const t of trades) {
    if (!t.aptNm) continue;
    const a = ensure(t.aptNm, t.buildYear, t.jibun);
    a.tradeCount += 1;
    a.dealCount += 1;
    if (!a.buildYear && t.buildYear) a.buildYear = t.buildYear;
    const ts =
      parseInt(t.dealYear, 10) * 10000 +
      parseInt(t.dealMonth, 10) * 100 +
      parseInt(t.dealDay, 10);
    if (ts >= (latestDate.get(t.aptNm) ?? 0)) {
      latestDate.set(t.aptNm, ts);
      a.latestPrice = parseInt(t.dealAmount.replace(/,/g, ""), 10);
    }
  }

  for (const r of rents) {
    if (!r.aptNm) continue;
    const a = ensure(r.aptNm, "", "");
    a.rentCount += 1;
    a.dealCount += 1;
  }

  return Array.from(map.values());
}

export type SortKey = "name" | "deal" | "year" | "households";

export function sortApartments(list: AptSummary[], key: SortKey): AptSummary[] {
  const arr = [...list];
  switch (key) {
    case "deal":
      return arr.sort((a, b) => b.dealCount - a.dealCount);
    case "year":
      return arr.sort(
        (a, b) => (parseInt(b.buildYear, 10) || 0) - (parseInt(a.buildYear, 10) || 0)
      );
    case "households":
      return arr.sort((a, b) => (b.households ?? 0) - (a.households ?? 0));
    case "name":
    default:
      return arr.sort((a, b) => a.name.localeCompare(b.name, "ko"));
  }
}

// 단지 상세: 통합 거래 내역
export interface UnifiedDeal {
  type: "매매" | "전세" | "월세";
  ym: string;          // YYYYMM
  dateLabel: string;   // YY.MM.DD
  day: number;
  sortTs: number;
  amount: number;      // 매매가 또는 보증금 (만원)
  monthly: number;     // 월세 (만원)
  area: number;        // 전용면적
  type84: number;      // 타입
  floor: string;
  contractType?: string; // 전월세 계약구분: 신규 / 갱신
  useRRRight?: boolean;  // 갱신요구권 사용
  preAmount?: number;    // 종전 보증금 (갱신)
}

export function buildDeals(
  trades: TradeItem[],
  rents: RentItem[]
): UnifiedDeal[] {
  const deals: UnifiedDeal[] = [];

  for (const t of trades) {
    const y = parseInt(t.dealYear, 10);
    const m = parseInt(t.dealMonth, 10);
    const d = parseInt(t.dealDay, 10);
    deals.push({
      type: "매매",
      ym: `${t.dealYear}${String(m).padStart(2, "0")}`,
      dateLabel: `${String(y).slice(2)}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`,
      day: d,
      sortTs: y * 10000 + m * 100 + d,
      amount: parseInt(t.dealAmount.replace(/,/g, ""), 10),
      monthly: 0,
      area: parseFloat(t.excluUseAr),
      type84: areaType(parseFloat(t.excluUseAr)),
      floor: t.floor,
    });
  }

  for (const r of rents) {
    const y = parseInt(r.dealYear, 10);
    const m = parseInt(r.dealMonth, 10);
    const d = parseInt(r.dealDay, 10);
    const monthly = parseInt(r.monthlyRent.replace(/,/g, ""), 10) || 0;
    const pre = parseInt((r.preDeposit || "").replace(/,/g, ""), 10);
    deals.push({
      type: monthly > 0 ? "월세" : "전세",
      ym: `${r.dealYear}${String(m).padStart(2, "0")}`,
      dateLabel: `${String(y).slice(2)}.${String(m).padStart(2, "0")}.${String(d).padStart(2, "0")}`,
      day: d,
      sortTs: y * 10000 + m * 100 + d,
      amount: parseInt(r.deposit.replace(/,/g, ""), 10),
      monthly,
      area: parseFloat(r.excluUseAr),
      type84: areaType(parseFloat(r.excluUseAr)),
      floor: r.floor,
      contractType: r.contractType || undefined,
      useRRRight: r.useRRRight === "사용",
      preAmount: !isNaN(pre) && pre > 0 ? pre : undefined,
    });
  }

  return deals.sort((a, b) => b.sortTs - a.sortTs);
}

// 월별 평균 시세 추이 (매매/전세)
export interface MonthlyPoint {
  ym: string;
  label: string;
  매매?: number;
  전세?: number;
  거래량: number;
}

export function buildMonthlyTrend(deals: UnifiedDeal[]): MonthlyPoint[] {
  const byYm = new Map<string, { tradeSum: number; tradeN: number; jeonseSum: number; jeonseN: number; count: number }>();

  for (const d of deals) {
    if (!byYm.has(d.ym)) {
      byYm.set(d.ym, { tradeSum: 0, tradeN: 0, jeonseSum: 0, jeonseN: 0, count: 0 });
    }
    const b = byYm.get(d.ym)!;
    b.count += 1;
    if (d.type === "매매") {
      b.tradeSum += d.amount;
      b.tradeN += 1;
    } else if (d.type === "전세") {
      b.jeonseSum += d.amount;
      b.jeonseN += 1;
    }
  }

  return Array.from(byYm.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([ym, b]) => ({
      ym,
      label: `${ym.slice(2, 4)}.${ym.slice(4)}`,
      매매: b.tradeN > 0 ? Math.round(b.tradeSum / b.tradeN) : undefined,
      전세: b.jeonseN > 0 ? Math.round(b.jeonseSum / b.jeonseN) : undefined,
      거래량: b.count,
    }));
}
