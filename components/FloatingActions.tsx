"use client";

import { useEffect, useState, type ComponentType } from "react";
import Link from "next/link";
import { Phone, ArrowUp, BarChart3, X, ChevronUp } from "lucide-react";

// 공식 브랜드 로고 (Simple Icons)
function KakaoIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M22.125 0H1.875C.8394 0 0 .8394 0 1.875v20.25C0 23.1606.8394 24 1.875 24h20.25C23.1606 24 24 23.1606 24 22.125V1.875C24 .8394 23.1606 0 22.125 0zM12 18.75c-.591 0-1.1697-.0413-1.7317-.1209-.5626.3965-3.813 2.6797-4.1198 2.7225 0 0-.1258.0489-.2328-.0141s-.0876-.2282-.0876-.2282c.0322-.2198.8426-3.0183.992-3.5333-2.7452-1.36-4.5701-3.7686-4.5701-6.5135C2.25 6.8168 6.6152 3.375 12 3.375s9.75 3.4418 9.75 7.6875c0 4.2457-4.3652 7.6875-9.75 7.6875zM8.0496 9.8672h-.8777v3.3417c0 .2963-.2523.5372-.5625.5372s-.5625-.2409-.5625-.5372V9.8672h-.8777c-.3044 0-.552-.2471-.552-.5508s.2477-.5508.552-.5508h2.8804c.3044 0 .552.2471.552.5508s-.2477.5508-.552.5508zm10.9879 2.9566a.558.558 0 0 1 .108.4167.5588.5588 0 0 1-.2183.371.5572.5572 0 0 1-.3383.1135.558.558 0 0 1-.4493-.2236l-1.3192-1.7479-.1952.1952v1.2273a.5635.5635 0 0 1-.5627.5628.563.563 0 0 1-.5625-.5625V9.3281c0-.3102.2523-.5625.5625-.5625s.5625.2523.5625.5625v1.209l1.5694-1.5694c.0807-.0807.1916-.1252.312-.1252.1404 0 .2814.0606.3871.1661.0985.0984.1573.2251.1654.3566.0082.1327-.036.2542-.1241.3425l-1.2818 1.2817 1.3845 1.8344zm-8.3502-3.5023c-.095-.2699-.3829-.5475-.7503-.5557-.3663.0083-.6542.2858-.749.5551l-1.3455 3.5415c-.1708.5305-.0217.7272.1333.7988a.8568.8568 0 0 0 .3576.0776c.2346 0 .4139-.0952.4678-.2481l.2787-.7297 1.7152.0001.2785.7292c.0541.1532.2335.2484.4681.2484a.8601.8601 0 0 0 .3576-.0775c.1551-.0713.3041-.2681.1329-.7999l-1.3449-3.5398zm-1.3116 2.4433l.5618-1.5961.5618 1.5961H9.3757zm5.9056 1.3836c0 .2843-.2418.5156-.5391.5156h-1.8047c-.2973 0-.5391-.2314-.5391-.5156V9.3281c0-.3102.2576-.5625.5742-.5625s.5742.2523.5742.5625v3.3047h1.1953c.2974 0 .5392.2314.5392.5156z" />
    </svg>
  );
}

function YoutubeIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function NaverIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.273 12.845 7.376 0H0v24h7.726V11.156L16.624 24H24V0h-7.727v12.845Z" />
    </svg>
  );
}

// 집 + 돋보기 = 매물 검색 (라인 아이콘)
function MaemulIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M3.5 11 12 4l6 5" />
      <path d="M5.5 9.7V19h6" />
      <path d="M9.2 19v-4.2h3.4V19" />
      <circle cx="16.7" cy="15.5" r="3.4" />
      <path d="m19.3 18.1 2.4 2.4" />
    </svg>
  );
}

type NavItem = {
  label: string;
  href: string;
  bg: string;
  text: string;
  Icon: ComponentType<{ className?: string }>;
  type: "internal" | "external" | "tel";
};

const NAV_ITEMS: NavItem[] = [
  { label: "실거래가 확인", href: "/market", bg: "bg-blue-600", text: "text-white", Icon: BarChart3, type: "internal" },
  { label: "카카오상담", href: "https://pf.kakao.com/_xhtexnG", bg: "bg-[#FEE500]", text: "text-[#191919]", Icon: KakaoIcon, type: "external" },
  { label: "바로문의", href: "tel:010-4699-4222", bg: "bg-gold", text: "text-white", Icon: Phone, type: "tel" },
  { label: "옥정매물", href: "https://fin.land.naver.com/realtor/n8644222", bg: "bg-blue-900", text: "text-white", Icon: MaemulIcon, type: "external" },
  { label: "블로그", href: "https://blog.naver.com/ipt_korea", bg: "bg-[#03C75A]", text: "text-white", Icon: NaverIcon, type: "external" },
  { label: "유튜브", href: "https://www.youtube.com/@%EC%96%91%EC%A3%BC%EC%98%A5%EC%A0%95%EC%95%8C%ED%8C%8C%EA%B3%A0%EB%B6%80%EB%8F%99%EC%82%B0", bg: "bg-[#FF0000]", text: "text-white", Icon: YoutubeIcon, type: "external" },
];

function ItemLink({
  item,
  className,
  children,
}: {
  item: NavItem;
  className: string;
  children: React.ReactNode;
}) {
  if (item.type === "internal") {
    return (
      <Link href={item.href} aria-label={item.label} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <a
      href={item.href}
      target={item.type === "external" ? "_blank" : undefined}
      rel={item.type === "external" ? "noopener noreferrer" : undefined}
      aria-label={item.label}
      className={className}
    >
      {children}
    </a>
  );
}

export default function FloatingActions() {
  const [showTop, setShowTop] = useState(false);
  // 모바일에서 메뉴 접기/펴기 (기본: 펼침)
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed right-3 sm:right-4 bottom-20 z-40 flex flex-col items-end gap-2">
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="맨 위로"
          className="flex items-center justify-center w-12 h-12 rounded-full bg-navy text-white shadow-lg hover:bg-navy-light transition-colors duration-200 cursor-pointer"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* 데스크탑(lg+): 아이콘만 + 마우스 올리면 라벨 슬라이드 (세로, 균일 크기) */}
      <div className="hidden lg:flex flex-col items-end gap-3">
        {NAV_ITEMS.map((item) => (
          <ItemLink
            key={item.label}
            item={item}
            className={`group relative flex items-center justify-center w-12 h-12 rounded-full shadow-lg ${item.bg} ${item.text} transition-transform duration-200 hover:scale-110 cursor-pointer`}
          >
            <item.Icon className="w-5 h-5" />
            <span className="pointer-events-none absolute right-full mr-3 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-navy text-white px-3 py-1.5 text-[13px] font-bold shadow-lg opacity-0 translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
              {item.label}
            </span>
          </ItemLink>
        ))}
      </div>

      {/* 모바일 전용: 접기/펴기 토글 (상단) */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "메뉴 접기" : "메뉴 열기"}
        aria-expanded={open}
        className="lg:hidden flex items-center justify-center w-12 h-12 rounded-full bg-navy text-white shadow-lg hover:bg-navy-light transition-colors duration-200 cursor-pointer"
      >
        {open ? <X className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
      </button>

      {/* 모바일 전용: 라벨 보이는 펼침 그룹 */}
      <div className={`lg:hidden flex-col items-end gap-2 ${open ? "flex" : "hidden"}`}>
        {NAV_ITEMS.map((item) => (
          <ItemLink
            key={item.label}
            item={item}
            className={`flex items-center gap-2 h-12 pl-3.5 pr-4 rounded-full shadow-lg ${item.bg} ${item.text} font-bold text-[13px] transition-transform duration-200 hover:scale-105 cursor-pointer`}
          >
            <item.Icon className="w-5 h-5 flex-shrink-0" />
            <span className="whitespace-nowrap">{item.label}</span>
          </ItemLink>
        ))}
      </div>
    </div>
  );
}
