// 국토교통부 실거래가 공개시스템 API
// API 키: https://www.data.go.kr 에서 발급 (아파트매매실거래자료 서비스)
// 경기도 양주시 법정동 코드: 41630, 응답 형식: XML
import { XMLParser } from "fast-xml-parser";

const API_KEY = process.env.MOLIT_API_KEY ?? "";
const BASE_URL = "https://apis.data.go.kr/1613000";
const TARGET_DONG = "옥정동"; // 양주시 41630 중 옥정동만 필터링

const parser = new XMLParser({ ignoreAttributes: true, trimValues: true });

export interface TradeItem {
  aptNm: string;       // 아파트명
  dealAmount: string;  // 거래금액
  dealYear: string;    // 년
  dealMonth: string;   // 월
  dealDay: string;     // 일
  excluUseAr: string;  // 전용면적
  floor: string;       // 층
  buildYear: string;   // 건축년도
  umdNm: string;       // 법정동
  jibun: string;       // 지번
}

export interface RentItem {
  aptNm: string;
  deposit: string;        // 보증금
  monthlyRent: string;    // 월세
  contractTerm: string;   // 계약기간 (예: 24.06~26.06)
  contractType: string;   // 계약구분: 신규 / 갱신
  useRRRight: string;     // 갱신요구권 사용 여부: 사용 / (공백)
  preDeposit: string;     // 종전 보증금 (갱신 시)
  preMonthlyRent: string; // 종전 월세 (갱신 시)
  excluUseAr: string;
  dealYear: string;
  dealMonth: string;
  dealDay: string;
  floor: string;
  umdNm: string;
}

// XML 응답을 파싱해 item 배열로 변환
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseItems(xml: string): any[] {
  const parsed = parser.parse(xml);
  const body = parsed?.response?.body;
  const items = body?.items;
  if (!items || typeof items !== "object") return [];
  const item = items.item;
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function str(v: any): string {
  return v === undefined || v === null ? "" : String(v).trim();
}

// 아파트 매매 실거래가 조회 (옥정동만, 목업 폴백 없음 — 빈 배열 반환)
async function fetchAptTradeRaw(
  lawdCd: string,
  dealYmd: string
): Promise<TradeItem[]> {
  if (!API_KEY) return [];

  const params = new URLSearchParams({
    serviceKey: API_KEY,
    LAWD_CD: lawdCd,
    DEAL_YMD: dealYmd,
    numOfRows: "1000",
    pageNo: "1",
  });

  const url = `${BASE_URL}/RTMSDataSvcAptTrade/getRTMSDataSvcAptTrade?${params}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const xml = await res.text();
    const items = parseItems(xml);
    return items
      .filter((it) => str(it.umdNm) === TARGET_DONG)
      .map((it) => ({
        aptNm: str(it.aptNm),
        dealAmount: str(it.dealAmount),
        dealYear: str(it.dealYear),
        dealMonth: str(it.dealMonth),
        dealDay: str(it.dealDay),
        excluUseAr: str(it.excluUseAr),
        floor: str(it.floor),
        buildYear: str(it.buildYear),
        umdNm: str(it.umdNm),
        jibun: str(it.jibun),
      }));
  } catch {
    return [];
  }
}

// 아파트 전월세 조회 (옥정동만, 목업 폴백 없음)
async function fetchAptRentRaw(
  lawdCd: string,
  dealYmd: string
): Promise<RentItem[]> {
  if (!API_KEY) return [];

  const params = new URLSearchParams({
    serviceKey: API_KEY,
    LAWD_CD: lawdCd,
    DEAL_YMD: dealYmd,
    numOfRows: "1000",
    pageNo: "1",
  });

  const url = `${BASE_URL}/RTMSDataSvcAptRent/getRTMSDataSvcAptRent?${params}`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    const xml = await res.text();
    const items = parseItems(xml);
    return items
      .filter((it) => str(it.umdNm) === TARGET_DONG)
      .map((it) => ({
        aptNm: str(it.aptNm),
        deposit: str(it.deposit),
        monthlyRent: str(it.monthlyRent),
        contractTerm: str(it.contractTerm),
        contractType: str(it.contractType),
        useRRRight: str(it.useRRRight),
        preDeposit: str(it.preDeposit),
        preMonthlyRent: str(it.preMonthlyRent),
        excluUseAr: str(it.excluUseAr),
        dealYear: str(it.dealYear),
        dealMonth: str(it.dealMonth),
        dealDay: str(it.dealDay),
        floor: str(it.floor),
        umdNm: str(it.umdNm),
      }));
  } catch {
    return [];
  }
}

// 단일 월 조회 (시세 페이지용, 데이터 없으면 목업 폴백)
export async function fetchAptTrade(
  lawdCd: string,
  dealYmd: string
): Promise<TradeItem[]> {
  const data = await fetchAptTradeRaw(lawdCd, dealYmd);
  return data.length > 0 ? data : getMockTradeData();
}

export async function fetchAptRent(
  lawdCd: string,
  dealYmd: string
): Promise<RentItem[]> {
  const data = await fetchAptRentRaw(lawdCd, dealYmd);
  return data.length > 0 ? data : getMockRentData();
}

// 실거래 데이터가 있는 가장 최근 월을 역추적해서 반환 (최대 maxBack개월).
// 국토부 신고 지연으로 당월이 비어도 직전 달들을 자동 탐색.
// 모든 월이 비거나 API 미연동(키 없음)일 때만 목업으로 폴백.
export async function fetchLatestAptTrade(
  lawdCd: string,
  maxBack = 6
): Promise<{ items: TradeItem[]; ymd: string; isMock: boolean }> {
  for (let i = 0; i < maxBack; i++) {
    const ymd = getYearMonth(i);
    const data = await fetchAptTradeRaw(lawdCd, ymd);
    if (data.length > 0) return { items: data, ymd, isMock: false };
  }
  return { items: getMockTradeData(), ymd: getYearMonth(1), isMock: true };
}

export async function fetchLatestAptRent(
  lawdCd: string,
  maxBack = 6
): Promise<{ items: RentItem[]; ymd: string; isMock: boolean }> {
  for (let i = 0; i < maxBack; i++) {
    const ymd = getYearMonth(i);
    const data = await fetchAptRentRaw(lawdCd, ymd);
    if (data.length > 0) return { items: data, ymd, isMock: false };
  }
  return { items: getMockRentData(), ymd: getYearMonth(1), isMock: true };
}

// 최근 N개월 매매 실거래 (옥정동 전체, 단지 목록/상세용)
export async function fetchAptTradeRange(
  lawdCd: string,
  months: number
): Promise<TradeItem[]> {
  const ymds = Array.from({ length: months }, (_, i) => getYearMonth(i));
  const results = await Promise.all(
    ymds.map((ymd) => fetchAptTradeRaw(lawdCd, ymd))
  );
  return results.flat();
}

// 최근 N개월 전월세 (옥정동 전체)
export async function fetchAptRentRange(
  lawdCd: string,
  months: number
): Promise<RentItem[]> {
  const ymds = Array.from({ length: months }, (_, i) => getYearMonth(i));
  const results = await Promise.all(
    ymds.map((ymd) => fetchAptRentRaw(lawdCd, ymd))
  );
  return results.flat();
}

export function formatAmount(amount: string): string {
  const num = parseInt(amount.replace(/,/g, ""), 10);
  if (isNaN(num)) return amount;
  if (num >= 10000) {
    const uk = Math.floor(num / 10000);
    const man = num % 10000;
    return man > 0 ? `${uk}억 ${man.toLocaleString()}만` : `${uk}억`;
  }
  return `${num.toLocaleString()}만`;
}

export function getYearMonth(offsetMonths = 0): string {
  const d = new Date();
  // 월말(29~31일)에 setMonth가 짧은 달(2월 등)을 건너뛰는 문제 방지: 일자를 1일로 고정
  d.setDate(1);
  d.setMonth(d.getMonth() - offsetMonths);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  return `${y}${m}`;
}

// 목업 데이터 (API 키 없을 때 사용)
function getMockTradeData(): TradeItem[] {
  return [
    { aptNm: "옥정 센트럴 푸르지오", dealAmount: "45,000", dealYear: "2025", dealMonth: "11", dealDay: "5", excluUseAr: "84.97", floor: "12", buildYear: "2021", umdNm: "옥정동", jibun: "100" },
    { aptNm: "옥정 센트럴 푸르지오", dealAmount: "43,500", dealYear: "2025", dealMonth: "11", dealDay: "12", excluUseAr: "59.90", floor: "8", buildYear: "2021", umdNm: "옥정동", jibun: "100" },
    { aptNm: "양주 옥정 아이파크", dealAmount: "52,000", dealYear: "2025", dealMonth: "11", dealDay: "3", excluUseAr: "101.32", floor: "15", buildYear: "2022", umdNm: "옥정동", jibun: "200" },
    { aptNm: "양주 옥정 아이파크", dealAmount: "46,500", dealYear: "2025", dealMonth: "11", dealDay: "20", excluUseAr: "84.97", floor: "5", buildYear: "2022", umdNm: "옥정동", jibun: "200" },
    { aptNm: "옥정 힐스테이트", dealAmount: "58,000", dealYear: "2025", dealMonth: "11", dealDay: "8", excluUseAr: "110.52", floor: "18", buildYear: "2020", umdNm: "옥정동", jibun: "300" },
    { aptNm: "옥정 e편한세상", dealAmount: "38,500", dealYear: "2025", dealMonth: "11", dealDay: "15", excluUseAr: "74.22", floor: "10", buildYear: "2019", umdNm: "옥정동", jibun: "400" },
    { aptNm: "옥정 e편한세상", dealAmount: "33,000", dealYear: "2025", dealMonth: "11", dealDay: "22", excluUseAr: "59.90", floor: "3", buildYear: "2019", umdNm: "옥정동", jibun: "400" },
    { aptNm: "옥정 롯데캐슬", dealAmount: "41,000", dealYear: "2025", dealMonth: "10", dealDay: "7", excluUseAr: "84.97", floor: "14", buildYear: "2018", umdNm: "옥정동", jibun: "500" },
    { aptNm: "옥정 롯데캐슬", dealAmount: "35,000", dealYear: "2025", dealMonth: "10", dealDay: "18", excluUseAr: "59.90", floor: "7", buildYear: "2018", umdNm: "옥정동", jibun: "500" },
    { aptNm: "옥정 센트럴 푸르지오", dealAmount: "44,000", dealYear: "2025", dealMonth: "10", dealDay: "25", excluUseAr: "84.97", floor: "20", buildYear: "2021", umdNm: "옥정동", jibun: "100" },
  ];
}

function getMockRentData(): RentItem[] {
  return [
    { aptNm: "옥정 센트럴 푸르지오", deposit: "22,000", monthlyRent: "0", contractTerm: "24.11~26.11", contractType: "신규", useRRRight: "", preDeposit: "", preMonthlyRent: "", excluUseAr: "59.90", dealYear: "2025", dealMonth: "11", dealDay: "4", floor: "6", umdNm: "옥정동" },
    { aptNm: "옥정 센트럴 푸르지오", deposit: "28,500", monthlyRent: "0", contractTerm: "24.11~26.11", contractType: "갱신", useRRRight: "사용", preDeposit: "27,000", preMonthlyRent: "0", excluUseAr: "84.97", dealYear: "2025", dealMonth: "11", dealDay: "10", floor: "11", umdNm: "옥정동" },
    { aptNm: "양주 옥정 아이파크", deposit: "5,000", monthlyRent: "80", contractTerm: "24.11~25.11", contractType: "신규", useRRRight: "", preDeposit: "", preMonthlyRent: "", excluUseAr: "59.90", dealYear: "2025", dealMonth: "11", dealDay: "6", floor: "4", umdNm: "옥정동" },
    { aptNm: "옥정 힐스테이트", deposit: "32,000", monthlyRent: "0", contractTerm: "24.11~26.11", contractType: "갱신", useRRRight: "", preDeposit: "30,000", preMonthlyRent: "0", excluUseAr: "84.97", dealYear: "2025", dealMonth: "11", dealDay: "14", floor: "16", umdNm: "옥정동" },
    { aptNm: "옥정 e편한세상", deposit: "4,000", monthlyRent: "65", contractTerm: "24.11~25.11", contractType: "신규", useRRRight: "", preDeposit: "", preMonthlyRent: "", excluUseAr: "74.22", dealYear: "2025", dealMonth: "11", dealDay: "19", floor: "9", umdNm: "옥정동" },
    { aptNm: "옥정 롯데캐슬", deposit: "19,000", monthlyRent: "0", contractTerm: "23.10~25.10", contractType: "신규", useRRRight: "", preDeposit: "", preMonthlyRent: "", excluUseAr: "59.90", dealYear: "2025", dealMonth: "10", dealDay: "11", floor: "2", umdNm: "옥정동" },
  ];
}
