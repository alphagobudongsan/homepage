import { notFound } from "next/navigation";
import Link from "next/link";
import { cases, getCaseById } from "@/lib/cases";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Building2,
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export async function generateStaticParams() {
  return cases.map((c) => ({ id: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getCaseById(id);
  if (!c) return { title: "사례를 찾을 수 없습니다" };
  return {
    title: `${c.title} | 알파고 공인중개사사무소`,
    description: c.summary,
    keywords: `옥정신도시, 옥정동 아파트, ${c.tag}, ${c.complex}, 부동산 사례, 공인중개사`,
    alternates: { canonical: `${SITE_URL}/cases/${c.id}` },
    openGraph: {
      type: "article",
      title: c.title,
      description: c.summary,
      url: `${SITE_URL}/cases/${c.id}`,
      siteName: SITE_NAME,
      locale: "ko_KR",
    },
  };
}

// 사례 날짜("2026년 5월") → ISO(YYYY-MM-01)
function toISODate(d: string): string | undefined {
  const m = d.match(/(\d{4})년\s*(\d{1,2})월/);
  return m ? `${m[1]}-${m[2].padStart(2, "0")}-01` : undefined;
}

const tagColor: Record<string, string> = {
  매매: "bg-navy text-white",
  전세: "bg-teal text-white",
  월세: "bg-teal-light text-navy",
  투자: "bg-gold text-navy",
  상담: "bg-navy-muted text-white",
};

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const c = getCaseById(id);
  if (!c) notFound();

  const otherCases = cases.filter((x) => x.id !== c.id).slice(0, 3);

  // Parse content into paragraphs/sections
  const contentParts = c.content.split("\n\n").filter(Boolean);

  // AI 봇·검색엔진용 구조화 데이터 (사례 = Article)
  const caseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: c.title,
    description: c.summary,
    articleBody: c.content.replace(/\n+/g, " ").trim(),
    inLanguage: "ko",
    datePublished: toISODate(c.date),
    keywords: ["옥정신도시", "옥정동 아파트", c.tag, c.complex, "부동산 사례"].join(", "),
    author: { "@type": "Organization", name: SITE_NAME },
    publisher: {
      "@type": "RealEstateAgent",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}/cases/${c.id}`,
  };

  return (
    <div className="pt-16 min-h-screen bg-cream">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseJsonLd) }}
      />
      {/* Breadcrumb */}
      <div className="bg-white border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-2 text-xs text-text-muted">
            <Link href="/" className="hover:text-navy cursor-pointer">홈</Link>
            <span>/</span>
            <Link href="/cases" className="hover:text-navy cursor-pointer">부동산 사례</Link>
            <span>/</span>
            <span className="text-navy font-medium truncate">{c.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/cases"
          className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-navy transition-colors mb-8 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          사례 목록으로 돌아가기
        </Link>

        {/* Header */}
        <div className="bg-white rounded-sm border border-border p-8 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-sm ${tagColor[c.tag]}`}>
              {c.tag}
            </span>
            <span className="text-xs text-text-muted">{c.date}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-navy leading-snug mb-6">
            {c.title}
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-text-muted">단지</div>
                <div className="text-sm font-semibold text-navy">{c.complex}</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-text-muted">담당 중개사</div>
                <div className="text-sm font-semibold text-navy">{c.agent} 대표</div>
              </div>
            </div>
            <div className="flex items-start gap-2.5">
              <Calendar className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
              <div>
                <div className="text-xs text-text-muted">거래일</div>
                <div className="text-sm font-semibold text-navy">{c.date}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Result highlight */}
        <div className="bg-navy rounded-sm p-6 mb-6">
          <div className="text-gold text-xs font-semibold tracking-wider uppercase mb-2">
            최종 결과
          </div>
          <p className="text-white font-semibold text-lg leading-relaxed">{c.result}</p>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-sm border border-border p-6 mb-6">
          <h2 className="text-base font-bold text-navy mb-3">사례 요약</h2>
          <p className="text-text-muted leading-relaxed">{c.summary}</p>
        </div>

        {/* Main content */}
        <div className="bg-white rounded-sm border border-border p-8 mb-6">
          <h2 className="text-base font-bold text-navy mb-6">상세 내용</h2>
          <div className="prose prose-sm max-w-none">
            {contentParts.map((part, i) => {
              if (part.startsWith("**") && part.includes("**")) {
                // Bold heading-like paragraph
                const lines = part.split("\n");
                return (
                  <div key={i} className="mb-5">
                    {lines.map((line, j) => {
                      if (line.startsWith("**") && line.endsWith("**")) {
                        return (
                          <p key={j} className="font-bold text-navy text-sm mb-2">
                            {line.replace(/\*\*/g, "")}
                          </p>
                        );
                      }
                      if (line.startsWith("- ")) {
                        return (
                          <p key={j} className="text-text-muted text-sm mb-1 pl-4">
                            • {line.slice(2)}
                          </p>
                        );
                      }
                      if (/^\d+\./.test(line)) {
                        return (
                          <p key={j} className="text-text-muted text-sm mb-1 pl-4">
                            {line}
                          </p>
                        );
                      }
                      return line ? (
                        <p key={j} className="text-text-muted text-sm mb-1">
                          {line}
                        </p>
                      ) : null;
                    })}
                  </div>
                );
              }
              return (
                <p key={i} className="text-text-muted text-sm leading-relaxed mb-4">
                  {part}
                </p>
              );
            })}
          </div>
        </div>

        {/* Tips */}
        <div className="bg-cream border border-border rounded-sm p-6 mb-10">
          <h2 className="text-base font-bold text-navy mb-4">전문가 TIP</h2>
          <ul className="space-y-3">
            {c.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-text-muted leading-relaxed">{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-navy rounded-sm p-8 mb-10 text-center">
          <h2 className="text-xl font-bold text-white mb-2">
            비슷한 상황에 있으신가요?
          </h2>
          <p className="text-white/60 text-sm mb-6">
            {c.agent} 공인중개사에게 직접 상담을 받아보세요.
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold text-navy font-semibold rounded-sm hover:bg-gold-light transition-colors duration-200 cursor-pointer"
          >
            무료 상담 신청하기
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Other cases */}
        <div>
          <h2 className="text-lg font-bold text-navy mb-5">다른 사례 보기</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {otherCases.map((oc) => (
              <Link
                key={oc.id}
                href={`/cases/${oc.id}`}
                className="block bg-white border border-border rounded-sm p-5 hover:shadow-md hover:border-gold/30 transition-all duration-200 group cursor-pointer"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-sm ${tagColor[oc.tag]}`}>
                    {oc.tag}
                  </span>
                  <span className="text-xs text-text-light">{oc.date}</span>
                </div>
                <h3 className="text-sm font-bold text-navy leading-snug mb-2 group-hover:text-navy-light transition-colors line-clamp-2">
                  {oc.title}
                </h3>
                <div className="flex items-center gap-1 text-gold text-xs font-medium mt-3">
                  보기
                  <ChevronRight className="w-3 h-3" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
