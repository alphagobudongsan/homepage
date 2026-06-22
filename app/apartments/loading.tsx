// 단지 정보 로딩 스켈레톤 — 클릭 즉시 표시되어 체감 속도 개선
export default function ApartmentsLoading() {
  return (
    <div className="pt-16 min-h-screen bg-cream animate-pulse">
      {/* Header */}
      <div className="bg-navy py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-3 w-28 bg-white/20 rounded mb-3" />
          <div className="h-8 w-52 bg-white/20 rounded mb-3" />
          <div className="h-3 w-80 max-w-full bg-white/10 rounded" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="bg-white border border-border rounded-sm px-5 py-3 mb-4 h-11" />

        {/* Sort bar */}
        <div className="bg-white border border-border rounded-sm px-4 py-2.5 mb-3 flex items-center gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-5 w-16 bg-cream-dark rounded-sm" />
          ))}
        </div>

        {/* List */}
        <div className="bg-white border border-border rounded-sm divide-y divide-border-light">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="px-5 py-4 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <div className="w-10 h-10 bg-cream-dark rounded-sm flex-shrink-0" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-40 max-w-full bg-cream-dark rounded" />
                  <div className="h-3 w-56 max-w-full bg-cream-dark rounded" />
                  <div className="h-3 w-48 max-w-full bg-cream-dark rounded" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <div className="h-3 w-12 bg-cream-dark rounded" />
                <div className="h-4 w-20 bg-cream-dark rounded" />
              </div>
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
