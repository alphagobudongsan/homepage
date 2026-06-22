// 시세 페이지 로딩 스켈레톤 — 클릭 즉시 표시되어 체감 속도 개선
export default function MarketLoading() {
  return (
    <div className="pt-16 min-h-screen bg-cream animate-pulse">
      {/* Header */}
      <div className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-3 w-40 bg-white/20 rounded mb-3" />
          <div className="h-8 w-56 bg-white/20 rounded mb-3" />
          <div className="h-3 w-72 bg-white/10 rounded" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 필터 카드 */}
        <div className="bg-white rounded-sm border border-border mb-6 p-4 space-y-4">
          <div className="hidden lg:flex gap-3">
            <div className="h-9 w-20 bg-cream-dark rounded-sm" />
            <div className="h-9 w-20 bg-cream-dark rounded-sm" />
            <div className="h-9 w-20 bg-cream-dark rounded-sm" />
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="h-11 flex-1 bg-cream-dark rounded-sm" />
            <div className="h-11 sm:w-56 bg-cream-dark rounded-sm" />
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-7 w-28 bg-cream-dark rounded-full" />
            ))}
          </div>
        </div>

        {/* 전광판 */}
        <div className="mb-6">
          <div className="h-4 w-48 bg-cream-dark rounded mb-3" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-sm border border-border p-5 h-20">
                <div className="h-3 w-20 bg-cream-dark rounded mb-3" />
                <div className="h-5 w-24 bg-cream-dark rounded" />
              </div>
            ))}
          </div>
        </div>

        {/* 리스트 */}
        <div className="bg-white rounded-sm border border-border p-4 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3 border-b border-border-light pb-3">
              <div className="space-y-2">
                <div className="h-3 w-16 bg-cream-dark rounded" />
                <div className="h-5 w-28 bg-cream-dark rounded" />
              </div>
              <div className="h-3 w-20 bg-cream-dark rounded" />
            </div>
          ))}
        </div>

        <p className="mt-6 text-center text-xs text-text-light">
          국토교통부 실거래가 데이터를 불러오는 중입니다…
        </p>
      </div>
    </div>
  );
}
