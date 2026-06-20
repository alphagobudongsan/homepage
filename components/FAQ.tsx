"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "옥정동만 전문으로 하나요? 다른 지역도 가능한가요?",
    a: "네, 알파고 공인중개사사무소는 경기도 양주시 옥정동 아파트를 전담합니다. 한 지역에 집중하기에 단지별 시세 흐름, 학군, 교통 호재까지 누구보다 정확하게 안내해 드릴 수 있습니다.",
  },
  {
    q: "시세 정보는 어디서 가져오나요? 믿을 수 있나요?",
    a: "국토교통부 실거래가 공개시스템 API를 직접 연동해 실제 신고된 매매·전세·월세 데이터를 제공합니다. 호가가 아닌 '실제 계약된 가격'이므로 가장 객관적인 기준입니다.",
  },
  {
    q: "전세 계약 시 보증금은 안전하게 보호받을 수 있나요?",
    a: "계약 전 등기부등본 권리관계 확인, 전세보증보험 가입 안내, 확정일자·전입신고 절차까지 전 과정을 함께 점검합니다. 계약갱신청구권 사용 여부와 종전 보증금 비교도 데이터로 확인해 드립니다.",
  },
  {
    q: "상담 비용이 있나요?",
    a: "상담은 100% 무료입니다. 매수·임차 목적과 예산을 알려주시면 가장 적합한 단지와 매물을 분석해 브리핑해 드리며, 상담만 받고 결정하셔도 전혀 부담 없습니다.",
  },
  {
    q: "집을 내놓으려는 소유주인데, 우리 집 가치를 알 수 있나요?",
    a: "네. 보유하신 단지의 동·평형별 최근 실거래가와 시세 추이를 분석해 객관적인 자산 가치를 브리핑해 드립니다. 적정 매도 시점과 호가 전략도 함께 제안합니다.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-border">
      {faqs.map((faq, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full flex items-center justify-between gap-4 py-5 text-left cursor-pointer group"
              aria-expanded={isOpen}
            >
              <span
                className={`font-bold text-base transition-colors ${
                  isOpen ? "text-gold" : "text-navy group-hover:text-gold"
                }`}
              >
                <span className="text-gold mr-2">Q.</span>
                {faq.q}
              </span>
              <span
                className={`flex-shrink-0 w-8 h-8 flex items-center justify-center border-2 transition-colors ${
                  isOpen
                    ? "bg-gold border-gold text-white"
                    : "border-navy text-navy group-hover:border-gold group-hover:text-gold"
                }`}
              >
                {isOpen ? (
                  <Minus className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </span>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="pb-6 pr-12 text-sm text-text-muted leading-relaxed">
                  {faq.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
