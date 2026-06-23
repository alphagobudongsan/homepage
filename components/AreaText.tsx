import { pyeongOf } from "@/lib/apartments";

// 면적 표기: "85㎡ (34평)" — 평수는 굵게 + 강조색(빨강)으로 구분
export default function AreaText({
  complex,
  area,
  decimals = 0,
  pyClassName = "text-gold",
  className = "",
}: {
  complex: string;
  area: number | string;
  decimals?: number;
  pyClassName?: string;
  className?: string;
}) {
  const m2 = typeof area === "string" ? parseFloat(area) : area;
  if (!m2 || isNaN(m2)) return null;
  const py = pyeongOf(complex, m2);
  const m2Label = decimals > 0 ? m2.toFixed(decimals) : String(Math.round(m2));
  return (
    <span className={className}>
      {m2Label}㎡
      {py > 0 && (
        <>
          {" ("}
          <b className={`font-extrabold ${pyClassName}`}>{py}평</b>
          {")"}
        </>
      )}
    </span>
  );
}
