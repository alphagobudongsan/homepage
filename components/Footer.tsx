import Link from "next/link";
import { Home, Phone, MapPin, Mail } from "lucide-react";

const links = [
  { label: "아파트 시세", href: "/market" },
  { label: "공인중개사 소개", href: "/agents" },
  { label: "아파트 단지 정보", href: "/apartments" },
  { label: "부동산 사례", href: "/cases" },
  { label: "상담 신청", href: "/consultation" },
];

export default function Footer() {
  return (
    <footer className="bg-navy text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 bg-gold rounded-sm flex items-center justify-center flex-shrink-0">
                <Home className="w-4 h-4 text-navy" strokeWidth={2.5} />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] text-gold-light tracking-[0.2em] uppercase font-light">
                  AI가 추천하는 옥정동부동산
                </span>
                <span className="text-white font-semibold text-base">
                  알파고 공인중개사사무소
                </span>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed max-w-xs">
              경기도 양주시 옥정동 전문 공인중개사 2인이 AI 실거래 데이터로
              매수·임차 고객에게 가장 정확한 정보를 안내합니다.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide mb-4">
              빠른 메뉴
            </h3>
            <ul className="space-y-2.5">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/60 hover:text-gold transition-colors duration-200 cursor-pointer"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide mb-4">
              연락처
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gold mt-0.5 flex-shrink-0" />
                <span className="text-sm text-white/60">
                  경기도 양주시 옥정동 일대
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-sm text-white/60">031-000-0000</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gold flex-shrink-0" />
                <span className="text-sm text-white/60">
                  info@okjeong-re.kr
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">
            © {new Date().getFullYear()} 알파고 공인중개사사무소. All rights
            reserved.
          </p>
          <p className="text-xs text-white/40">
            본 사이트의 부동산 데이터는 국토교통부 실거래가 공개시스템을
            활용합니다.
          </p>
        </div>
      </div>
    </footer>
  );
}
