// K-apt 공동주택관리정보시스템 OpenAPI (data.go.kr)
// - 단지 목록: AptListService3/getSigunguAptList3  (현재 키로 동작)
// - 기본 정보: AptBasisInfoServiceV4/getAphusBassInfoV4 (별도 활용신청 필요)
// 세대수(kaptdaCnt)·동수(kaptDongCnt)·사용승인일(kaptUsedate)·지번주소(kaptAddr) 제공
import { XMLParser } from "fast-xml-parser";

const API_KEY = process.env.MOLIT_API_KEY ?? "";
const SIGUNGU_CODE = "41630"; // 경기도 양주시
const TARGET_DONG = "옥정동";

const parser = new XMLParser({ ignoreAttributes: true, trimValues: true });

// JSON 우선, 실패 시 XML 파싱
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseBody(text: string): any {
  try {
    return JSON.parse(text)?.response?.body;
  } catch {
    return parser.parse(text)?.response?.body;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function asArray<T>(v: any): T[] {
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function str(v: any): string {
  return v === undefined || v === null ? "" : String(v).trim();
}

interface KaptListItem {
  kaptCode: string;
  kaptName: string;
  bjdCode: string;
  as3: string;
}

export interface KaptBasis {
  kaptCode: string;
  kaptName: string;
  households?: number; // 세대수
  dongs?: number;      // 동수
  buildYear?: string;  // 사용승인일 기준 연도
  jibun?: string;      // 지번 (매칭용)
  addr?: string;       // 지번주소
}

// 옥정동 단지 목록 (kaptCode 확보)
async function fetchOkjeongList(): Promise<KaptListItem[]> {
  if (!API_KEY) return [];
  const p = new URLSearchParams({
    serviceKey: API_KEY,
    sigunguCode: SIGUNGU_CODE,
    numOfRows: "500",
    pageNo: "1",
    _type: "json",
  });
  try {
    const r = await fetch(
      `https://apis.data.go.kr/1613000/AptListService3/getSigunguAptList3?${p}`,
      { next: { revalidate: 86400 } }
    );
    const body = parseBody(await r.text());
    const items = asArray<KaptListItem>(body?.items?.item ?? body?.items);
    return items.filter((it) => str(it.as3) === TARGET_DONG);
  } catch {
    return [];
  }
}

// 단지 기본정보 (세대수·동수·사용승인일·지번)
async function fetchBasis(kaptCode: string): Promise<KaptBasis | null> {
  if (!API_KEY) return null;
  const p = new URLSearchParams({ serviceKey: API_KEY, kaptCode });
  try {
    const r = await fetch(
      `https://apis.data.go.kr/1613000/AptBasisInfoServiceV4/getAphusBassInfoV4?${p}`,
      { next: { revalidate: 86400 } }
    );
    if (!r.ok) return null; // 403 등 → 폴백
    const body = parseBody(await r.text());
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const item: any = asArray(body?.items?.item ?? body?.item ?? body)[0] ?? body;
    if (!item) return null;
    const addr = str(item.kaptAddr);
    // "옥정동" 뒤의 지번 추출 (예: "경기도 양주시 옥정동 904-1 ..." → "904-1")
    const jibunMatch = addr.match(/옥정동\s+(\d+(?:-\d+)?)/);
    const useDate = str(item.kaptUsedate); // YYYYMMDD
    return {
      kaptCode,
      kaptName: str(item.kaptName),
      households: item.kaptdaCnt ? Math.round(Number(item.kaptdaCnt)) : undefined,
      dongs: item.kaptDongCnt ? Number(item.kaptDongCnt) : undefined,
      buildYear: useDate ? useDate.slice(0, 4) : undefined,
      jibun: jibunMatch ? jibunMatch[1] : undefined,
      addr,
    };
  } catch {
    return null;
  }
}

// 옥정동 전체 단지 기본정보 인덱스 (지번·정규화 이름으로 조회)
export interface KaptIndex {
  byJibun: Map<string, KaptBasis>;
  byName: Map<string, KaptBasis>;
  list: KaptBasis[];
}

// 단지명 정규화: 공백·괄호·단지표기 제거
export function normalizeName(name: string): string {
  return name
    .replace(/\([^)]*\)/g, "")
    .replace(/\s+/g, "")
    .replace(/\d+(,\d+)*단지/g, "")
    .replace(/아파트$/, "")
    .toLowerCase();
}

let _cache: KaptIndex | null = null;

export async function getKaptIndex(): Promise<KaptIndex> {
  if (_cache) return _cache;

  const list = await fetchOkjeongList();
  const basisList = (
    await Promise.all(list.map((it) => fetchBasis(it.kaptCode)))
  ).filter((b): b is KaptBasis => b !== null && b.households !== undefined);

  const byJibun = new Map<string, KaptBasis>();
  const byName = new Map<string, KaptBasis>();
  for (const b of basisList) {
    if (b.jibun) {
      byJibun.set(b.jibun, b);
      byJibun.set(b.jibun.split("-")[0], b); // 본번만으로도 조회
    }
    if (b.kaptName) byName.set(normalizeName(b.kaptName), b);
  }

  const index: KaptIndex = { byJibun, byName, list: basisList };
  // 활용신청 전파 전(권한 없음)에는 basisList가 비어 캐시하지 않음 → 다음 요청 재시도
  if (basisList.length > 0) _cache = index;
  return index;
}

// MOLIT 단지(aptNm, jibun)에 매칭되는 K-apt 기본정보 찾기
export function matchKapt(
  index: KaptIndex,
  aptNm: string,
  jibun: string
): KaptBasis | undefined {
  if (jibun) {
    if (index.byJibun.has(jibun)) return index.byJibun.get(jibun);
    const bun = jibun.split("-")[0];
    if (index.byJibun.has(bun)) return index.byJibun.get(bun);
  }
  const norm = normalizeName(aptNm);
  if (index.byName.has(norm)) return index.byName.get(norm);
  // 부분 포함 매칭 (정규화 이름 기준)
  for (const [name, basis] of index.byName) {
    if (name.includes(norm) || norm.includes(name)) return basis;
  }
  return undefined;
}
