import { MessageCircle } from "lucide-react";
import ConsultationForm from "./ConsultationForm";

export const metadata = {
  title: "상담 신청 | 알파고 공인중개사사무소",
  description: "옥정동 전문 공인중개사에게 무료 부동산 상담을 신청하세요.",
};

export default function ConsultationPage() {
  return (
    <div className="pt-16 min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-sm font-medium tracking-wider uppercase mb-2">
            무료 전문가 상담
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            상담 신청
          </h1>
          <p className="text-white/60">
            매수, 임차, 투자 목적에 맞는 전문 공인중개사를 연결해 드립니다.
            영업일 기준 24시간 이내 연락드립니다.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Info sidebar */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-sm border border-border p-6">
              <h2 className="font-bold text-navy text-base mb-4">상담 진행 안내</h2>
              <ol className="space-y-4">
                {[
                  { step: "01", title: "상담 신청", desc: "아래 양식을 작성해 주세요" },
                  { step: "02", title: "중개사 배정", desc: "목적에 맞는 전문가를 매칭합니다" },
                  { step: "03", title: "연락 & 상담", desc: "24시간 이내 연락드립니다" },
                  { step: "04", title: "현장 동행", desc: "원하시면 직접 단지를 함께 방문합니다" },
                ].map((s) => (
                  <li key={s.step} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gold/10 rounded-sm flex items-center justify-center flex-shrink-0">
                      <span className="text-gold text-xs font-bold">{s.step}</span>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-navy">{s.title}</div>
                      <div className="text-xs text-text-muted mt-0.5">{s.desc}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="bg-navy rounded-sm p-6">
              <h2 className="font-bold text-white text-sm mb-3">직접 전화 상담</h2>
              <p className="text-white/60 text-xs mb-4">
                양식 작성이 번거로우시면 바로 전화주세요.
              </p>
              <a
                href="tel:031-864-4222"
                className="flex items-center justify-center gap-2 w-full py-3 bg-gold text-navy font-bold rounded-sm hover:bg-gold-light transition-colors duration-200 cursor-pointer text-sm"
              >
                031-864-4222
              </a>
              <a
                href="tel:010-4699-4222"
                className="flex items-center justify-center gap-2 w-full py-3 mt-2 border border-gold text-gold font-bold rounded-sm hover:bg-gold hover:text-navy transition-colors duration-200 cursor-pointer text-sm"
              >
                010-4699-4222
              </a>
              <a
                href="https://pf.kakao.com/_xhtexnG"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 mt-2 bg-[#FEE500] text-[#191919] font-bold rounded-sm hover:brightness-95 transition-all duration-200 cursor-pointer text-sm"
              >
                <MessageCircle className="w-4 h-4 fill-[#191919]" />
                카카오톡 상담
              </a>
              <p className="text-white/40 text-xs text-center mt-3">
                평일 09:00 ~ 19:00 | 토요일 10:00 ~ 17:00
              </p>
            </div>

            <div className="bg-white rounded-sm border border-border p-6">
              <h2 className="font-bold text-navy text-sm mb-3">상담 보장 사항</h2>
              <ul className="space-y-2">
                {[
                  "100% 맞춤형 무료 상담",
                  "철저한 비밀 및 개인정보 보호",
                  "실거래가 기반 객관적 매물 비교",
                  "철저한 권리분석 및 안심 계약 보장",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-text-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <ConsultationForm />
          </div>
        </div>
      </div>
    </div>
  );
}
