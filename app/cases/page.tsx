import Link from "next/link";
import { cases } from "@/lib/cases";
import { ChevronRight, Calendar, User, Building2 } from "lucide-react";

export const metadata = {
  title: "부동산 사례 | 알파고 공인중개사사무소",
  description: "알파고 공인중개사사무소의 실제 부동산 거래 성공 사례를 확인하세요.",
};

const tagColor: Record<string, string> = {
  매매: "bg-navy text-white",
  전세: "bg-teal text-white",
  월세: "bg-teal-light text-navy",
  투자: "bg-gold text-navy",
  상담: "bg-navy-muted text-white",
};

const TAGS = ["전체", "매매", "전세", "투자", "상담"];

export default function CasesPage({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  return <CasesContent searchParams={searchParams} />;
}

async function CasesContent({
  searchParams,
}: {
  searchParams: Promise<{ tag?: string }>;
}) {
  const params = await searchParams;
  const activeTag = params.tag ?? "전체";
  const filtered =
    activeTag === "전체"
      ? cases
      : cases.filter((c) => c.tag === activeTag);

  return (
    <div className="pt-16 min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-sm font-medium tracking-wider uppercase mb-2">
            실제 거래 성공 사례
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            부동산 사례
          </h1>
          <p className="text-white/60">
            옥정동 전문 공인중개사들의 실제 성공 사례와 노하우를 확인하세요.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Tag Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          {TAGS.map((tag) => (
            <Link
              key={tag}
              href={tag === "전체" ? "/cases" : `/cases?tag=${tag}`}
              className={`px-4 py-2 text-sm font-semibold rounded-sm border transition-colors duration-150 cursor-pointer ${
                activeTag === tag
                  ? "bg-navy text-white border-navy"
                  : "border-border text-text-muted hover:border-navy hover:text-navy bg-white"
              }`}
            >
              {tag}
              <span className="ml-1.5 text-xs opacity-70">
                {tag === "전체"
                  ? cases.length
                  : cases.filter((c) => c.tag === tag).length}
              </span>
            </Link>
          ))}
        </div>

        {/* Cases Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <Link
              key={c.id}
              href={`/cases/${c.id}`}
              className="block bg-white border border-border rounded-sm overflow-hidden hover:shadow-lg hover:border-gold/30 transition-all duration-200 group cursor-pointer"
            >
              {/* Tag bar */}
              <div className={`h-1 w-full ${tagColor[c.tag].split(" ")[0]}`} />

              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-sm ${tagColor[c.tag]}`}
                  >
                    {c.tag}
                  </span>
                  <span className="text-xs text-text-light">{c.date}</span>
                </div>

                <h2 className="font-bold text-navy text-base leading-snug mb-3 group-hover:text-navy-light transition-colors">
                  {c.title}
                </h2>

                <p className="text-sm text-text-muted leading-relaxed mb-5">
                  {c.summary}
                </p>

                <div className="space-y-1.5 mb-5">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="text-xs text-text-muted">{c.complex}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    <span className="text-xs text-text-muted">
                      담당: {c.agent} 공인중개사
                    </span>
                  </div>
                </div>

                <div className="bg-cream rounded-sm px-3 py-2.5 mb-4">
                  <p className="text-xs font-semibold text-navy leading-relaxed">
                    결과: {c.result}
                  </p>
                </div>

                <div className="flex items-center gap-1 text-gold text-sm font-semibold">
                  자세히 보기
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20 text-text-muted">
            해당 유형의 사례가 없습니다.
          </div>
        )}
      </div>
    </div>
  );
}
