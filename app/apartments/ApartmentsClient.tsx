"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { AptSummary, SortKey, sortApartments } from "@/lib/apartments";
import { formatAmount } from "@/lib/molit";
import { ChevronRight, Building2, MapPin } from "lucide-react";

const SORTS: { key: SortKey; label: string }[] = [
  { key: "name", label: "이름순" },
  { key: "deal", label: "거래량순" },
  { key: "year", label: "입주년도순" },
  { key: "households", label: "세대수순" },
];

export default function ApartmentsClient({
  apartments,
}: {
  apartments: AptSummary[];
}) {
  const [sort, setSort] = useState<SortKey>("deal");

  const sorted = useMemo(
    () => sortApartments(apartments, sort),
    [apartments, sort]
  );

  return (
    <div className="pt-16 min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-sm font-medium tracking-wider uppercase mb-2">
            옥정동 아파트
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            아파트 단지 정보
          </h1>
          <p className="text-white/60">
            국토교통부 실거래가 기준 옥정동 아파트 단지 목록입니다. 단지를
            선택하면 상세 실거래 정보를 확인할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb location */}
        <div className="bg-white border border-border rounded-sm px-5 py-3 mb-4 flex items-center gap-2 text-sm">
          <span className="font-semibold text-navy">경기</span>
          <ChevronRight className="w-3.5 h-3.5 text-text-light" />
          <span className="font-semibold text-navy">양주시</span>
          <ChevronRight className="w-3.5 h-3.5 text-text-light" />
          <span className="font-semibold text-gold">옥정동</span>
          <span className="ml-auto text-xs text-text-muted">
            총 {apartments.length}개 단지
          </span>
        </div>

        {/* Sort bar */}
        <div className="bg-white border border-border rounded-sm px-4 py-2.5 mb-3 flex items-center gap-1 overflow-x-auto">
          {SORTS.map((s, i) => (
            <div key={s.key} className="flex items-center">
              {i > 0 && <span className="text-border mx-1">|</span>}
              <button
                onClick={() => setSort(s.key)}
                className={`px-2 py-1 text-sm rounded-sm transition-colors duration-150 cursor-pointer whitespace-nowrap ${
                  sort === s.key
                    ? "text-navy font-bold"
                    : "text-text-muted hover:text-navy"
                }`}
              >
                {s.label}
              </button>
            </div>
          ))}
        </div>

        {/* Filter note (apartment only) */}
        <div className="flex items-center gap-4 mb-5 px-1 text-xs text-text-muted">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-navy inline-block" />
            아파트
          </span>
          <span className="text-text-light">
            * 오피스텔 · 연립다세대 제외, 국토교통부 아파트 실거래 자료 기준
          </span>
        </div>

        {/* List */}
        <div className="bg-white border border-border rounded-sm divide-y divide-border-light">
          {sorted.length === 0 && (
            <div className="py-16 text-center text-text-muted text-sm">
              표시할 단지 정보가 없습니다.
            </div>
          )}
          {sorted.map((apt) => (
            <Link
              key={apt.name}
              href={`/apartments/${apt.slug}`}
              className="block px-5 py-4 hover:bg-cream/50 transition-colors duration-150 cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-10 h-10 bg-cream rounded-sm flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 className="w-5 h-5 text-navy" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="font-bold text-navy text-base group-hover:text-navy-light transition-colors truncate">
                      {apt.name}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-text-muted">
                      {apt.buildYear && <span>{apt.buildYear}년</span>}
                      {apt.households && (
                        <>
                          <span className="text-border">|</span>
                          <span>{apt.households.toLocaleString()}세대</span>
                        </>
                      )}
                      {apt.dongs && (
                        <>
                          <span className="text-border">|</span>
                          <span>{apt.dongs}개동</span>
                        </>
                      )}
                    </div>
                    {/* 최근 1년 거래: 전체/매매/전세/월세 분리 */}
                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 mt-1.5 text-xs">
                      <span className="font-bold text-navy">
                        최근 거래 {apt.dealCount}건
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-gold/10 text-gold-dark font-semibold">
                        매매 {apt.tradeCount}
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-blue-600/10 text-blue-700 font-semibold">
                        전세 {apt.jeonseCount}
                      </span>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-green-600/10 text-green-700 font-semibold">
                        월세 {apt.wolseCount}
                      </span>
                      <span className="text-text-light">(최근 1년 거래)</span>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-xs text-text-light">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      경기 양주시 옥정동 {apt.jibun}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0">
                  {apt.latestPrice ? (
                    <>
                      <span className="text-[10px] text-text-light">최근 매매</span>
                      <span className="font-bold text-navy text-sm">
                        {formatAmount(String(apt.latestPrice))}원
                      </span>
                    </>
                  ) : (
                    <span className="text-xs text-text-light">전월세 위주</span>
                  )}
                  <ChevronRight className="w-4 h-4 text-text-light mt-1 group-hover:text-gold group-hover:translate-x-1 transition-all duration-200" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-xs text-text-light text-center mt-6">
          * 세대수·동수는 주요 단지에 한해 제공되며, 거래 건수는 최근 12개월
          국토교통부 실거래 신고 기준입니다.
        </p>
      </div>
    </div>
  );
}
