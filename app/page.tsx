import Link from "next/link";
import {
  Users,
  ChevronRight,
  ArrowRight,
  Star,
  BarChart3,
  ShieldCheck,
  Sparkles,
  FileSearch,
  Quote,
  MapPin,
  Train,
  GraduationCap,
  Trees,
  LineChart,
  ShieldOff,
  HeartHandshake,
} from "lucide-react";
import {
  fetchLatestAptTrade,
  fetchLatestAptRent,
  formatAmount,
  TradeItem,
  RentItem,
} from "@/lib/molit";
import FAQ from "@/components/FAQ";

// 10분 캐시 (빠른 로딩 + 실시간 느낌)
export const revalidate = 600;

const heroFeatures = [
  {
    icon: Users,
    title: "더블 체크 2인 체제",
    desc: "권리 분석부터 현장 확인까지 두 명의 중개사가 교차 검증합니다.",
  },
  {
    icon: LineChart,
    title: "실시간 시세 분석",
    desc: "과거의 감(感)이 아닌, 오늘의 정확한 빅데이터를 읽어냅니다.",
  },
  {
    icon: ShieldOff,
    title: "허위 매물 ZERO",
    desc: "투명하고 정직한 정보 공개로 고객의 소중한 시간을 아낍니다.",
  },
  {
    icon: HeartHandshake,
    title: "안심 사후 관리",
    desc: "잔금을 치르고 입주하는 순간까지 변함없는 파트너가 됩니다.",
  },
];

interface Highlight {
  complex: string;
  type: "매매" | "전세" | "월세";
  size: string;
  price: string;
  dateLabel: string;
}

// 라이브 실거래 데이터에서 최근 거래 하이라이트 추출 (단지 중복 제거)
function buildHighlights(trades: TradeItem[], rents: RentItem[]): Highlight[] {
  const out: Highlight[] = [];
  const seen = new Set<string>();

  const recentTrades = [...trades].sort(
    (a, b) => Number(b.dealDay) - Number(a.dealDay)
  );
  for (const t of recentTrades) {
    if (seen.has(t.aptNm)) continue;
    if (out.filter((o) => o.type === "매매").length >= 2) break;
    seen.add(t.aptNm);
    out.push({
      complex: t.aptNm,
      type: "매매",
      size: `${Math.round(parseFloat(t.excluUseAr))}㎡`,
      price: `${formatAmount(t.dealAmount)}원`,
      dateLabel: `${t.dealMonth}.${t.dealDay} 거래`,
    });
  }

  // 전세만 추출 (월세 제외)
  const recentJeonse = [...rents]
    .filter((r) => !r.monthlyRent || r.monthlyRent === "0")
    .sort((a, b) => Number(b.dealDay) - Number(a.dealDay));
  for (const r of recentJeonse) {
    if (seen.has(r.aptNm)) continue;
    if (out.filter((o) => o.type === "전세").length >= 2) break;
    seen.add(r.aptNm);
    out.push({
      complex: r.aptNm,
      type: "전세",
      size: `${Math.round(parseFloat(r.excluUseAr))}㎡`,
      price: `${formatAmount(r.deposit)}원`,
      dateLabel: `${r.dealMonth}.${r.dealDay} 거래`,
    });
  }

  return out;
}

const testimonials = [
  {
    name: "김O현",
    tag: "아파트 매수",
    text: "다른 데서는 광고 보고 갔더니 그 매물은 없다며 엉뚱한 집만 보여줬는데, 여기는 광고 그대로 실매물을 보여주셨어요. 마음에 드는 집을 직접 골라 기분 좋게 계약했습니다.",
    rating: 5,
  },
  {
    name: "박O수",
    tag: "아파트 매도",
    text: "집을 내놓으니 다른 부동산은 ‘그 금액엔 안 나간다’며 가격부터 깎으려 했어요. 여기는 실거래가 데이터로 적정가를 보여주시고 무리하게 낮추라고 하지 않으셔서 믿음이 갔습니다.",
    rating: 5,
  },
  {
    name: "이O정",
    tag: "편안했던 상담",
    text: "예전엔 집 보고 나면 계속 연락 오고, 지금 계약 안 한다니까 안 된다는 식이라 부담됐어요. 여기는 전혀 재촉하지 않고 제 속도에 맞춰주셔서 마음 편히 결정했습니다.",
    rating: 5,
  },
];

const areaFeatures = [
  { icon: Train, label: "교통", desc: "GTX-C(예정)·7호선 연장 호재, 서울 접근성 개선" },
  { icon: GraduationCap, label: "학군", desc: "옥정초·중 도보권, 신도시 학원가 형성" },
  { icon: Trees, label: "환경", desc: "옥정중앙공원·천보산 자연 인접, 신도시 인프라" },
];

const agents = [
  {
    name: "강은주",
    title: "공인중개사",
    specialty: "아파트 매매·전세·월세 입지 분석",
    image: "/agent-kang.jpg",
    imgPos: "center top",
    rating: 4.9,
    reviews: 184,
  },
  {
    name: "권정욱",
    title: "공인중개사",
    specialty: "상가·공장·창고·아파트 매매·전세·월세 권리 분석",
    image: "/agent-kwon.png",
    imgPos: "center 30%",
    rating: 4.9,
    reviews: 142,
  },
];

const cases = [
  {
    id: "case-001",
    title: "허위매물에 지친 고객, 정직한 매물로 기분 좋게 계약",
    summary: "광고 그대로의 실매물만 안내 — 미끼매물 없이 마음에 드는 집을 직접 골라 계약.",
    date: "2026년 5월",
    tag: "매매",
  },
  {
    id: "case-007",
    title: "양도세 비과세 놓칠 뻔한 매도, ‘취득시기’ 다시 짚다",
    summary: "등기일이 아닌 잔금일 기준 취득시기를 미리 확인해 1세대 1주택 비과세 요건을 지킨 사례.",
    date: "2025년 11월",
    tag: "상담",
  },
  {
    id: "case-008",
    title: "세입자 갑작스런 퇴거, 보증금 금융 해법까지 안내",
    summary: "새 임차인 일정 조율과 자금 해법으로 보증금 반환 분쟁 없이 마무리.",
    date: "2025년 10월",
    tag: "상담",
  },
];

export default async function HomePage() {
  // 실거래가 있는 가장 최근 월을 자동 탐색 (당월이 비면 직전 달들로 역추적)
  const [tradeRes, rentRes] = await Promise.all([
    fetchLatestAptTrade("41630"),
    fetchLatestAptRent("41630"),
  ]);
  const trades = tradeRes.items;
  const rents = rentRes.items;
  const marketHighlights = buildHighlights(trades, rents);

  // 홈페이지 실시간 접속 년월일 (한국 시간 기준)
  const now = new Date();
  const accessDate = now.toLocaleDateString("ko-KR", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative bg-navy overflow-hidden pt-16">
        {/* 모바일 전용 배경 영상 */}
        <video
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="lg:hidden absolute inset-0 w-full h-full object-contain object-center"
        />
        {/* 모바일 영상 위 오버레이 (가독성) */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy/65" />

        {/* Oversized background type — 사무소 슬로건 핵심 '고객을 먼저' (좌측 영역에 노출) */}
        <div className="absolute inset-0 flex flex-col justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display-kr text-white/[0.06] text-[16vw] lg:text-[13vw] leading-[0.85] whitespace-nowrap -ml-2">
            고객을
          </span>
          <span className="font-display-kr text-gold/[0.12] text-[16vw] lg:text-[13vw] leading-[0.85] whitespace-nowrap -ml-2">
            먼저
          </span>
        </div>

        {/* Red angled accent (데스크탑 전용) */}
        <div
          className="hidden lg:block absolute top-0 right-0 w-[55%] h-full bg-gold"
          style={{ clipPath: "polygon(28% 0, 100% 0, 100% 100%, 8% 100%)" }}
        />

        {/* Hero video — same clip shape, layered on top of red (데스크탑 전용) */}
        <video
          src="/hero-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hidden lg:block absolute top-0 right-0 w-[55%] h-full object-contain object-bottom"
          style={{ clipPath: "polygon(28% 0, 100% 0, 100% 100%, 8% 100%)" }}
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[70vh] lg:min-h-[90vh] flex items-center py-16 sm:py-20 lg:py-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-sm mb-7 backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold-light" />
              <span className="text-white text-xs font-bold tracking-wider">
                AI가 추천하는 옥정동부동산
              </span>
            </div>

            <h1 className="font-display-kr text-white leading-[1.12] mb-6 text-4xl sm:text-5xl lg:text-6xl">
              실패 없는 옥정 입성,
              <br />
              숨은 단지 가치까지
              <br />
              <span className="text-gold">&lsquo;완벽하게&rsquo;</span> 찾아내다.
            </h1>

            <p className="text-white/70 text-base sm:text-lg leading-relaxed mb-6 max-w-xl">
              &ldquo;옥정동 아파트 전문 부동산 추천&rdquo;에 대한 가장 정확한 해답.
              <br className="hidden sm:block" />
              실거래가 데이터와 현장 분석을 통해, 매수·임차인에게는 안전한
              선택을, 소유주님께는 객관적인 자산 가치 증명을 브리핑해 드립니다.
            </p>

            <p className="flex items-center gap-2.5 mb-9 text-white/90 text-sm sm:text-base font-semibold">
              <span className="w-7 h-0.5 bg-gold flex-shrink-0" />
              <span>
                알파고부동산은 늘{" "}
                <span className="text-gold font-black">고객을 먼저</span>{" "}
                생각합니다.
              </span>
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/market"
                className="flex items-center justify-center gap-2 px-7 py-4 bg-white text-navy font-bold rounded-sm hover:bg-gold hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 flex-shrink-0" />
                <span className="text-center leading-tight">
                  옥정동아파트<br />실거래가 확인하기
                </span>
              </Link>
              <Link
                href="/consultation"
                className="flex items-center justify-center gap-2 px-7 py-4 border-2 border-white/30 text-white font-bold rounded-sm hover:bg-white/10 transition-colors duration-200 cursor-pointer"
              >
                무료 상담 신청
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Feature cards */}
        <div className="relative bg-black/40 border-t border-white/10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {heroFeatures.map((feature) => (
                <div
                  key={feature.title}
                  className="group flex items-center gap-3.5 bg-white/[0.04] border border-white/10 rounded-lg px-4 py-4 hover:bg-white/[0.07] hover:border-gold/40 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center transition-transform duration-300 ease-out group-hover:scale-110">
                    <feature.icon className="w-7 h-7 text-gold" strokeWidth={2} />
                  </div>
                  <div className="transition-transform duration-300 ease-out group-hover:scale-105 origin-left">
                    <h3 className="text-white font-bold text-[15px] mb-0.5">
                      {feature.title}
                    </h3>
                    <p className="text-white/55 text-xs leading-snug">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== MARKET HIGHLIGHTS ===== */}
      <section className="py-14 sm:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <SectionLabel>실거래가 현황</SectionLabel>
              <p className="text-sm font-semibold text-gold mb-1">
                {accessDate} 기준
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                옥정신도시APT 실거래가 시세
              </h2>
            </div>
            <Link
              href="/market"
              className="hidden sm:flex items-center gap-1.5 text-navy text-sm font-bold hover:text-gold transition-colors duration-200 cursor-pointer"
            >
              전체 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {marketHighlights.map((item) => (
              <div
                key={item.complex}
                className="bg-white rounded-sm border border-border p-5 hover:border-gold hover:shadow-[4px_4px_0_0_#161616] transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-sm text-white ${
                      item.type === "매매"
                        ? "bg-gold"
                        : item.type === "전세"
                        ? "bg-blue-600"
                        : "bg-navy"
                    }`}
                  >
                    {item.type}
                  </span>
                  <span className="text-xs text-text-muted">{item.size}</span>
                </div>
                <p className="text-sm font-bold text-text mb-3 truncate group-hover:text-gold transition-colors">
                  {item.complex}
                </p>
                <div className="text-xl font-black text-navy">{item.price}</div>
                <div className="text-xs font-medium mt-1 text-text-muted">
                  {item.dateLabel}
                </div>
              </div>
            ))}
            {marketHighlights.length === 0 && (
              <div className="col-span-full py-10 text-center text-text-muted text-sm">
                이번 달 실거래 데이터를 불러오는 중입니다.
              </div>
            )}
          </div>
          <p className="mt-4 text-xs text-text-light">
            * 국토교통부 실거래가 공개시스템 기준 최근 옥정동 실거래 내역입니다.
          </p>
        </div>
      </section>

      {/* ===== WHY US ===== */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionLabel center>왜? 옥정신도시 부동산 추천하는 부동산인가?</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
              데이터로 증명하는 전문성
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: FileSearch,
                title: "국토부 실거래 데이터",
                desc: "국토교통부 실거래가 API를 직접 연동해 매매·전세·월세·갱신 정보까지 정확하게 제공합니다.",
              },
              {
                icon: ShieldCheck,
                title: "알파고부동산의 전문적인 2인 교차 검증 시스템",
                desc: "권리 분석부터 현장 확인까지, 옥정신도시를 가장 잘 아는 2인의 중개사가 교차 검증하여 안전을 책임집니다.",
              },
              {
                icon: Sparkles,
                title: "1:1 맞춤형 브리핑 시스템",
                desc: "고객님의 예산과 목적에 맞춰 단지별 시세 추이를 꼼꼼하게 비교 분석하고, 가장 합리적인 선택지를 직접 설계해 드립니다.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border-2 border-navy p-7 group hover:bg-navy transition-colors duration-200"
              >
                <div className="w-12 h-12 bg-gold flex items-center justify-center mb-5">
                  <item.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-black text-navy mb-3 group-hover:text-white transition-colors">
                  {item.title}
                </h3>
                <p className="text-text-muted text-sm leading-relaxed group-hover:text-white/70 transition-colors">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== AGENTS ===== */}
      <section className="py-14 sm:py-20 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <SectionLabel>알파고 공인중개사사무소</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                전문 공인중개사 2인
              </h2>
            </div>
            <Link
              href="/agents"
              className="hidden sm:flex items-center gap-1.5 text-navy text-sm font-bold hover:text-gold transition-colors duration-200 cursor-pointer"
            >
              자세히 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {agents.map((agent) => (
              <div
                key={agent.name}
                className="bg-white border border-border p-7 hover:border-gold hover:shadow-[6px_6px_0_0_#161616] transition-all duration-200 group"
              >
                <div className="flex items-start gap-5">
                  <div className="w-20 h-20 flex-shrink-0 overflow-hidden">
                    <img
                      src={agent.image}
                      alt={agent.name}
                      style={{ objectPosition: agent.imgPos }}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <h3 className="font-black text-navy text-xl">
                        {agent.name}
                      </h3>
                      <span className="text-xs text-text-muted font-medium">
                        {agent.title}
                      </span>
                    </div>
                    <p className="text-sm text-gold font-bold mb-3">
                      {agent.specialty}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-gold text-gold" />
                        <b className="text-navy">{agent.rating}</b>
                        <span className="text-text-muted text-xs">
                          ({agent.reviews})
                        </span>
                      </span>
                    </div>
                  </div>
                  <Link
                    href="/agents"
                    className="self-center w-10 h-10 flex items-center justify-center border-2 border-navy group-hover:bg-gold group-hover:border-gold transition-colors duration-200 cursor-pointer flex-shrink-0"
                    aria-label={`${agent.name} 중개사 보기`}
                  >
                    <ChevronRight className="w-5 h-5 text-navy group-hover:text-white transition-colors" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CASES ===== */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <SectionLabel>성공 사례</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
                부동산 사례
              </h2>
            </div>
            <Link
              href="/cases"
              className="hidden sm:flex items-center gap-1.5 text-navy text-sm font-bold hover:text-gold transition-colors duration-200 cursor-pointer"
            >
              전체 보기
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cases.map((c) => (
              <Link
                key={c.id}
                href={`/cases/${c.id}`}
                className="block bg-cream border border-border p-6 hover:border-gold hover:shadow-[5px_5px_0_0_#161616] transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-4">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-sm ${
                      c.tag === "매매"
                        ? "bg-gold text-white"
                        : c.tag === "전세"
                        ? "bg-navy text-white"
                        : "bg-teal text-white"
                    }`}
                  >
                    {c.tag}
                  </span>
                  <span className="text-xs text-text-light">{c.date}</span>
                </div>
                <h3 className="font-black text-navy text-base mb-2 leading-snug group-hover:text-gold transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {c.summary}
                </p>
                <div className="mt-4 flex items-center gap-1 text-gold text-sm font-bold">
                  자세히 보기
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="py-14 sm:py-20 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display text-white/[0.04] text-[18vw] leading-none whitespace-nowrap">
            REVIEW
          </span>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <SectionLabel center>고객 후기</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              데이터로 신뢰를 만듭니다
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white/5 border border-white/10 p-7 backdrop-blur-sm"
              >
                <Quote className="w-8 h-8 text-gold mb-4" />
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                  ))}
                </div>
                <p className="text-white/80 text-sm leading-relaxed mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-2 pt-4 border-t border-white/10">
                  <div className="w-9 h-9 bg-gold flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-white font-bold text-sm">{t.name}</div>
                    <div className="text-white/50 text-xs">{t.tag}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== LOCATION ===== */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <SectionLabel>옥정동 입지</SectionLabel>
              <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight mb-5">
                왜 지금 옥정동인가
              </h2>
              <p className="text-text-muted leading-relaxed mb-8">
                경기도 양주시 옥정신도시는 교통·학군·자연환경을 두루 갖춘
                수도권 북부의 대표 신도시입니다. 알파고 공인중개사사무소가
                현장에서 직접 확인한 입지 가치를 안내합니다.
              </p>
              <div className="space-y-4 mb-8">
                {areaFeatures.map((f) => (
                  <div key={f.label} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-navy flex items-center justify-center flex-shrink-0">
                      <f.icon className="w-5 h-5 text-gold" />
                    </div>
                    <div>
                      <div className="font-black text-navy text-sm mb-0.5">
                        {f.label}
                      </div>
                      <div className="text-text-muted text-sm">{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-sm text-navy font-bold">
                <MapPin className="w-4 h-4 text-gold" />
                경기도 양주시 옥정로5길 35, 상가101호 · 알파고 공인중개사사무소
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2 mb-3">
                <h3 className="text-lg font-black text-navy">오시는 길</h3>
                <span className="text-sm font-semibold text-gold">
                  &lsquo;옥정중학교&rsquo; 검색하고 오시면 편하세요
                </span>
              </div>
              <div className="border-2 border-navy overflow-hidden">
                <iframe
                  title="알파고 공인중개사사무소 위치 (경기도 양주시 옥정로5길 35)"
                  src="https://maps.google.com/maps?q=%EA%B2%BD%EA%B8%B0%EB%8F%84%20%EC%96%91%EC%A3%BC%EC%8B%9C%20%EC%98%A5%EC%A0%95%EB%A1%9C5%EA%B8%B8%2035&t=&z=16&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-[420px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="py-14 sm:py-20 bg-cream">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <SectionLabel center>자주 묻는 질문</SectionLabel>
            <h2 className="text-3xl sm:text-4xl font-black text-navy tracking-tight">
              궁금한 점이 있으신가요
            </h2>
          </div>
          <div className="bg-white border border-border px-6 sm:px-8">
            <FAQ />
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative py-16 sm:py-24 bg-gold overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
          <span className="font-display text-white/10 text-[20vw] leading-none whitespace-nowrap">
            ENTRY
          </span>
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display-kr text-white text-4xl sm:text-5xl mb-5 leading-tight">
            매수 · 임차 계획이 있으신가요?
          </h2>
          <p className="text-white/90 text-lg mb-10 font-medium">
            옥정동 전문 공인중개사가 무료로 상담해 드립니다.
            <br className="hidden sm:block" />
            시세 분석부터 계약까지 데이터로 함께합니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/consultation"
              className="px-8 py-4 bg-navy text-white font-bold rounded-sm hover:bg-black transition-colors duration-200 cursor-pointer"
            >
              무료 상담 신청하기
            </Link>
            <Link
              href="/agents"
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-navy font-bold rounded-sm hover:bg-cream transition-colors duration-200 cursor-pointer"
            >
              <Users className="w-4 h-4" />
              중개사 만나보기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionLabel({
  children,
  center,
}: {
  children: React.ReactNode;
  center?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-2 mb-2 ${center ? "justify-center" : ""}`}
    >
      <span className="w-6 h-0.5 bg-gold" />
      <span className="text-gold text-sm font-bold tracking-wider uppercase">
        {children}
      </span>
    </div>
  );
}
