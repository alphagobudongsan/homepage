// 옥정동 아파트 단지 스카이라인 일러스트 (히어로 우측 영역)
export default function Skyline({ className = "" }: { className?: string }) {
  // 창문 그리드 생성
  const windows = (
    x: number,
    y: number,
    w: number,
    h: number,
    cols: number,
    rows: number,
    accent: number[] = []
  ) => {
    const items = [];
    const gapX = w / cols;
    const gapY = h / rows;
    const ww = gapX * 0.55;
    const wh = gapY * 0.5;
    let idx = 0;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const isAccent = accent.includes(idx);
        items.push(
          <rect
            key={`${x}-${y}-${r}-${c}`}
            x={x + gapX * c + (gapX - ww) / 2}
            y={y + gapY * r + (gapY - wh) / 2}
            width={ww}
            height={wh}
            fill={isAccent ? "#161616" : "#ffffff"}
            opacity={isAccent ? 0.9 : 0.35}
          />
        );
        idx++;
      }
    }
    return items;
  };

  return (
    <svg
      viewBox="0 0 400 420"
      className={className}
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMax meet"
    >
      {/* Tower 1 (left, tall) */}
      <rect x="40" y="120" width="80" height="300" fill="#ffffff" opacity="0.12" />
      <rect x="40" y="120" width="80" height="300" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
      {windows(40, 130, 80, 290, 4, 11, [10, 23, 36])}

      {/* Tower 2 (center, tallest) */}
      <rect x="150" y="60" width="95" height="360" fill="#ffffff" opacity="0.16" />
      <rect x="150" y="60" width="95" height="360" stroke="#ffffff" strokeWidth="2.5" opacity="0.6" />
      {windows(150, 72, 95, 348, 4, 13, [5, 18, 31, 44])}
      {/* rooftop accent */}
      <rect x="188" y="44" width="18" height="16" fill="#161616" opacity="0.85" />

      {/* Tower 3 (right, medium) */}
      <rect x="275" y="150" width="85" height="270" fill="#ffffff" opacity="0.12" />
      <rect x="275" y="150" width="85" height="270" stroke="#ffffff" strokeWidth="2" opacity="0.5" />
      {windows(275, 160, 85, 260, 4, 10, [14, 27])}

      {/* Ground line */}
      <rect x="20" y="416" width="360" height="4" fill="#161616" opacity="0.5" />
    </svg>
  );
}
