import { Phone, Award, MapPin, Clock, MessageCircle, ShieldCheck, Search, FileText, Building2 } from "lucide-react";
import Link from "next/link";
import ClippedShapeGallery from "@/components/ui/clipped-shape-image";

export const metadata = {
  title: "공인중개사 소개 | 알파고 공인중개사사무소",
  description: "알파고 공인중개사사무소 소속 전문 공인중개사를 소개합니다.",
};

const agents = [
  {
    id: "kang-eunju",
    name: "강은주",
    title: "공인중개사",
    office: "알파고 공인중개사사무소",
    image: "/agent-kang.jpg",
    specialty: ["아파트 매매", "전세·월세", "입지 분석"],
    deals: 300,
    reviews: 184,
    address: "경기도 양주시 옥정동 옥정로 123",
    phone: "031-864-4222",
    mobile: "010-4699-4222",
    hours: "평일 09:00 ~ 19:00 / 주말 10:00 ~ 17:00",
    bio: "고객분이 결정을 내리시기 전까지, 저는 한 번도 먼저 재촉한 적이 없습니다. 부동산 계약은 인생에서 가장 큰 결정 중 하나이기 때문에, 고객 한 분 한 분의 말씀을 끝까지 듣고 공감하는 것이 먼저라고 생각합니다. 특히 내 가족이 살 집을 고르는 엄마의 마음으로 함께하기 때문에, 고객이 무엇을 걱정하는지 누구보다 잘 압니다.\n\n공인중개사 자격증과 상가분석사 자격증을 바탕으로, 아파트 입지·실거래가·네이버부동산 호가를 교차 분석해 거품 없는 객관적인 정보를 드립니다. 고객님이 발품을 팔지 않아도 되도록, 조건에 딱 맞는 물건만 선별해 안내해 드려 소중한 시간을 지켜드립니다.\n\n계약 전 서류를 꼼꼼히 검토하여 분쟁 소지가 될 수 있는 부분은 반드시 미리 알려드립니다. 문제가 생긴 뒤 수습하는 것이 아니라, 처음부터 안전한 계약을 만드는 것이 진짜 전문가의 역할이라 믿습니다.",
    strengths: [
      { icon: ShieldCheck, label: "고압적 분위기 없는 상담", desc: "재촉하거나 불필요한 압박 없이, 고객님의 페이스에 맞춰 진행합니다." },
      { icon: Search, label: "데이터 기반 입지·시세 분석", desc: "실거래가와 호가를 교차 검토해 거품 없는 최적 물건만 추천합니다." },
      { icon: FileText, label: "사전 분쟁 예방 서류 검토", desc: "계약 전 리스크를 미리 짚어드려 사고를 원천 차단합니다." },
    ],
    certifications: ["공인중개사 자격증", "상가분석사 자격증", "RSA창업사관학교"],
  },
  {
    id: "kwon-jeonguk",
    name: "권정욱",
    title: "공인중개사",
    office: "알파고 공인중개사사무소",
    image: "/agent-kwon.png",
    specialty: ["상가·공장·창고", "아파트 매매", "권리 분석"],
    deals: 0,
    reviews: 0,
    address: "경기도 양주시 옥정동 옥정로 123",
    phone: "031-864-4222",
    mobile: "",
    hours: "평일 09:00 ~ 19:00 / 주말 10:00 ~ 17:00",
    bio: "주거용 아파트는 물론, 상가·공장·창고 같은 수익형 부동산까지 폭넓게 다루는 전문 중개사입니다. 한 분야에 머무르지 않고 다양한 물건을 다뤄 왔기에, 고객님의 목적에 가장 잘 맞는 해법을 제시해 드릴 수 있습니다.\n\n제가 가장 자신 있는 것은 '꼼꼼하고 스마트한 중개'입니다. 계약에 앞서 법률적인 부분과 권리관계를 서류 한 장까지 검토하고, 고객님 입장에서 미리 챙겨야 할 것들을 먼저 준비합니다. 문제가 생긴 뒤에 수습하는 것이 아니라, 문제가 생기기 전에 막는 것이 제 역할이라고 믿습니다.\n\nRSA창업사관학교와 박문각공인중개사 동문회장을 역임했으며, 옥정신도시 초창기부터 이곳에 거주해 온 주민입니다. 단지 하나하나의 변화와 생활 인프라를 직접 살아오며 지켜봤기에, 숫자만으로는 알 수 없는 옥정의 진짜 가치를 안내해 드립니다.",
    strengths: [
      { icon: FileText, label: "법률·권리관계 정밀 검토", desc: "서류 한 장까지 꼼꼼히 검토해 권리관계 리스크를 사전에 차단합니다." },
      { icon: Building2, label: "상가·공장·창고 수익형 전문", desc: "주거용을 넘어 수익형 부동산까지, 폭넓은 경험으로 최적의 해법을 제시합니다." },
      { icon: ShieldCheck, label: "손님 입장 사전 체크", desc: "계약 과정에서 필요한 것들을 미리 챙겨 고객이 놓치는 일이 없도록 합니다." },
    ],
    certifications: ["공인중개사 자격증", "상가분석사 자격증", "RSA창업사관학교"],
  },
];

export default function AgentsPage() {
  return (
    <div className="pt-16 min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gold text-sm font-medium tracking-wider uppercase mb-2">
            알파고 공인중개사사무소
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3">
            공인중개사 소개
          </h1>
          <p className="text-white/60">
            당신의 완벽한 거래를 완성할 최적의 파트너.<br />
            옥정신도시의 가치를 가장 잘 아는 2인의 수석 중개사를 소개합니다.
          </p>
        </div>
      </div>

      {/* Clipped Photo Gallery */}
      <div className="bg-navy pb-16 pt-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-white/40 text-xs tracking-widest uppercase text-center mb-8">Meet the Team</p>
          <ClippedShapeGallery
            mediaItems={[
              {
                src: "/agent-kang.jpg",
                alt: "강은주 공인중개사",
                clipId: "clip-another1",
                type: "image",
              },
              {
                src: "/sindosi.png",
                alt: "옥정신도시 아파트 단지",
                clipId: "clip-another2",
                type: "image",
              },
              {
                src: "/agent-kwon.png",
                alt: "권정욱 공인중개사",
                clipId: "clip-another3",
                type: "image",
              },
            ]}
          />
          <div className="grid grid-cols-3 gap-6 mt-4 text-center">
            <p className="text-white/60 text-sm font-medium">강은주 중개사</p>
            <p className="text-white/60 text-sm font-medium">옥정신도시</p>
            <p className="text-white/60 text-sm font-medium">권정욱 중개사</p>
          </div>
        </div>
      </div>

      {/* Agent Profiles */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-10">
        {agents.map((agent) => (
          <div key={agent.id} className="bg-white border border-border rounded-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-[280px_1fr]">
              {/* Photo */}
              <div className="relative">
                <img
                  src={agent.image!}
                  alt={agent.name}
                  className="w-full h-full object-cover object-top min-h-[320px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy/60 via-transparent to-transparent md:hidden" />
              </div>

              {/* Info */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-gold text-xs font-bold tracking-widest uppercase mb-1">{agent.office}</p>
                      <h2 className="text-3xl font-black text-navy">{agent.name}</h2>
                      <p className="text-text-muted text-sm mt-0.5">{agent.title}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5 justify-end">
                      {agent.certifications.map((c) => (
                        <span key={c} className="flex items-center gap-1 text-xs px-2 py-1 bg-cream border border-border rounded-sm text-text-muted font-medium whitespace-nowrap">
                          <Award className="w-3 h-3 text-gold flex-shrink-0" />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {agent.specialty.map((s) => (
                      <span key={s} className="text-xs px-3 py-1 bg-gold/10 border border-gold/30 rounded-sm text-gold-dark font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>

                  {/* Bio */}
                  <div className="space-y-3">
                    {agent.bio.split("\n\n").map((para, i) => (
                      <p key={i} className="text-sm text-text-muted leading-relaxed">
                        {i === 0 ? <span className="font-semibold text-navy">{para}</span> : para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Contact */}
                <div className="mt-8 pt-6 border-t border-border space-y-2">
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <MapPin className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    {agent.address}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-text-muted">
                    <Clock className="w-3.5 h-3.5 text-gold flex-shrink-0" />
                    {agent.hours}
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths */}
            <div className="border-t border-border bg-cream/40 grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
              {agent.strengths.map((str) => (
                <div key={str.label} className="p-6 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <str.icon className="w-4 h-4 text-gold flex-shrink-0" />
                    <span className="text-sm font-bold text-navy">{str.label}</span>
                  </div>
                  <p className="text-xs text-text-muted leading-relaxed">{str.desc}</p>
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="px-8 py-5 flex flex-col sm:flex-row gap-3 border-t border-border">
              <a
                href={`tel:${agent.phone}`}
                className="flex-1 flex items-center justify-center gap-2 py-3 bg-navy text-white text-sm font-semibold rounded-sm hover:bg-gold transition-colors duration-200 cursor-pointer"
              >
                <Phone className="w-4 h-4" />
                {agent.phone} (사무소)
              </a>
              {agent.mobile && (
                <a
                  href={`tel:${agent.mobile}`}
                  className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-navy text-navy text-sm font-semibold rounded-sm hover:bg-navy hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  <Phone className="w-4 h-4" />
                  {agent.mobile} (직통)
                </a>
              )}
              <Link
                href="/consultation"
                className="flex-1 flex items-center justify-center gap-2 py-3 border-2 border-gold text-gold text-sm font-semibold rounded-sm hover:bg-gold hover:text-white transition-colors duration-200 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                온라인 상담 신청
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-navy py-14">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-white mb-3">상담이 망설여지시나요?</h2>
          <p className="text-white/60 mb-6">
            부담 없이 문의하셔도 됩니다. 강은주·권정욱 중개사가 직접 응대합니다.
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gold text-white font-semibold rounded-sm hover:bg-gold-light transition-colors duration-200 cursor-pointer"
          >
            무료 상담 신청하기
          </Link>
        </div>
      </div>
    </div>
  );
}
