// 단지 상세 로딩 스켈레톤 — 클릭 즉시 표시되어 체감 속도 개선
export default function AptDetailLoading() {
  return (
    <div className="pt-16 min-h-screen bg-cream animate-pulse">
      {/* Header */}
      <div className="bg-navy py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-3 w-24 bg-white/20 rounded mb-4" />
          <div className="h-8 w-64 max-w-full bg-white/20 rounded mb-3" />
          <div className="h-3 w-72 max-w-full bg-white/10 rounded" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* 요약 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-sm border border-border p-5 h-24">
              <div className="h-3 w-16 bg-cream-dark rounded mb-3" />
              <div className="h-5 w-24 bg-cream-dark rounded" />
            </div>
          ))}
        </div>

        {/* 시세 추이 차트 */}
        <div className="bg-white rounded-sm border border-border p-5">
          <div className="h-4 w-40 bg-cream-dark rounded mb-5" />
          <div className="h-56 w-full bg-cream-dark rounded" />
        </div>

        {/* 거래 내역 리스트 */}
        <div className="bg-white rounded-sm border border-border p-5 space-y-4">
          <div className="h-4 w-32 bg-cream-dark rounded mb-2" />
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3 border-b border-border-light pb-3">
              <div className="space-y-2">
                <div className="h-3 w-14 bg-cream-dark rounded" />
                <div className="h-5 w-28 bg-cream-dark rounded" />
              </div>
              <div className="h-3 w-20 bg-cream-dark rounded" />
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-text-light">
          국토교통부 실거래가 데이터를 불러오는 중입니다…
        </p>
      </div>
    </div>
  );
}
