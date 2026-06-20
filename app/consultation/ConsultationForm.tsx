"use client";

import { useState } from "react";
import { CheckCircle, Send } from "lucide-react";

const COMPLEXES = [
  "옥정 센트럴 푸르지오",
  "양주 옥정 아이파크",
  "옥정 힐스테이트",
  "옥정 e편한세상",
  "옥정 롯데캐슬",
  "옥정자이",
  "기타 / 미정",
];

const BUDGETS = [
  "2억 미만",
  "2억 ~ 3억",
  "3억 ~ 4억",
  "4억 ~ 5억",
  "5억 이상",
  "협의 가능",
];

const SIZES = ["59㎡ 이하", "60~74㎡", "75~84㎡", "85~110㎡", "110㎡ 이상", "무관"];

type PurposeType = "매매" | "전세" | "월세" | "투자상담" | "기타";

export default function ConsultationForm() {
  const [purpose, setPurpose] = useState<PurposeType>("매매");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    complex: "",
    budget: "",
    size: "",
    moveDate: "",
    message: "",
    agreePrivacy: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // 실제 구현 시 API 호출로 대체
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="bg-white rounded-sm border border-border p-10 text-center">
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-gold" />
        </div>
        <h2 className="text-xl font-bold text-navy mb-2">상담 신청 완료!</h2>
        <p className="text-text-muted text-sm leading-relaxed mb-6">
          <strong className="text-navy">{form.name}</strong>님의 상담 신청을
          접수했습니다.
          <br />
          영업일 기준 24시간 이내에 전문 중개사가 연락드립니다.
        </p>
        <div className="bg-cream rounded-sm p-4 text-left text-sm mb-6">
          <div className="grid grid-cols-2 gap-2">
            <div className="text-text-muted">상담 유형</div>
            <div className="font-semibold text-navy">{purpose}</div>
            <div className="text-text-muted">연락처</div>
            <div className="font-semibold text-navy">{form.phone}</div>
            <div className="text-text-muted">희망 단지</div>
            <div className="font-semibold text-navy">{form.complex || "미정"}</div>
            <div className="text-text-muted">예산</div>
            <div className="font-semibold text-navy">{form.budget || "협의"}</div>
          </div>
        </div>
        <button
          onClick={() => {
            setSubmitted(false);
            setForm({
              name: "",
              phone: "",
              complex: "",
              budget: "",
              size: "",
              moveDate: "",
              message: "",
              agreePrivacy: false,
            });
          }}
          className="text-sm text-text-muted hover:text-navy transition-colors cursor-pointer"
        >
          새 상담 신청하기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-sm border border-border overflow-hidden"
    >
      <div className="p-6 border-b border-border">
        <h2 className="font-bold text-navy text-lg">상담 신청서</h2>
        <p className="text-xs text-text-muted mt-1">
          * 표시는 필수 입력 항목입니다
        </p>
      </div>

      <div className="p-6 space-y-6">
        {/* Purpose */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            상담 유형 *
          </label>
          <div className="flex flex-wrap gap-2">
            {(["매매", "전세", "월세", "투자상담", "기타"] as PurposeType[]).map(
              (p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPurpose(p)}
                  className={`px-4 py-2 text-sm font-semibold rounded-sm border transition-colors duration-150 cursor-pointer ${
                    purpose === p
                      ? "bg-navy text-white border-navy"
                      : "border-border text-text-muted hover:border-navy hover:text-navy"
                  }`}
                >
                  {p}
                </button>
              )
            )}
          </div>
        </div>

        {/* Name + Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-semibold text-navy mb-1.5"
            >
              이름 *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={form.name}
              onChange={handleChange}
              placeholder="홍길동"
              className="w-full px-3 py-2.5 border border-border rounded-sm text-sm text-text placeholder:text-text-light focus:outline-none focus:border-navy transition-colors"
            />
          </div>
          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-semibold text-navy mb-1.5"
            >
              연락처 *
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={form.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className="w-full px-3 py-2.5 border border-border rounded-sm text-sm text-text placeholder:text-text-light focus:outline-none focus:border-navy transition-colors"
            />
          </div>
        </div>

        {/* Complex */}
        <div>
          <label
            htmlFor="complex"
            className="block text-sm font-semibold text-navy mb-1.5"
          >
            희망 단지
          </label>
          <select
            id="complex"
            name="complex"
            value={form.complex}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-border rounded-sm text-sm text-text focus:outline-none focus:border-navy transition-colors cursor-pointer bg-white"
          >
            <option value="">단지를 선택하세요</option>
            {COMPLEXES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Budget + Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="budget"
              className="block text-sm font-semibold text-navy mb-1.5"
            >
              예산 범위
            </label>
            <select
              id="budget"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-border rounded-sm text-sm text-text focus:outline-none focus:border-navy transition-colors cursor-pointer bg-white"
            >
              <option value="">예산을 선택하세요</option>
              {BUDGETS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="size"
              className="block text-sm font-semibold text-navy mb-1.5"
            >
              희망 면적
            </label>
            <select
              id="size"
              name="size"
              value={form.size}
              onChange={handleChange}
              className="w-full px-3 py-2.5 border border-border rounded-sm text-sm text-text focus:outline-none focus:border-navy transition-colors cursor-pointer bg-white"
            >
              <option value="">면적을 선택하세요</option>
              {SIZES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Move Date */}
        <div>
          <label
            htmlFor="moveDate"
            className="block text-sm font-semibold text-navy mb-1.5"
          >
            희망 이사 시기
          </label>
          <input
            id="moveDate"
            name="moveDate"
            type="month"
            value={form.moveDate}
            onChange={handleChange}
            className="w-full px-3 py-2.5 border border-border rounded-sm text-sm text-text focus:outline-none focus:border-navy transition-colors"
          />
        </div>

        {/* Message */}
        <div>
          <label
            htmlFor="message"
            className="block text-sm font-semibold text-navy mb-1.5"
          >
            추가 문의사항
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange}
            placeholder="궁금하신 점이나 추가로 알려주실 사항을 자유롭게 적어주세요."
            className="w-full px-3 py-2.5 border border-border rounded-sm text-sm text-text placeholder:text-text-light focus:outline-none focus:border-navy transition-colors resize-none"
          />
        </div>

        {/* Privacy */}
        <div className="flex items-start gap-3">
          <input
            id="agreePrivacy"
            name="agreePrivacy"
            type="checkbox"
            required
            checked={form.agreePrivacy}
            onChange={handleChange}
            className="mt-0.5 w-4 h-4 accent-navy cursor-pointer flex-shrink-0"
          />
          <label
            htmlFor="agreePrivacy"
            className="text-xs text-text-muted leading-relaxed cursor-pointer"
          >
            개인정보 수집·이용에 동의합니다. 수집된 정보는 상담 목적으로만
            활용되며, 상담 완료 후 즉시 파기됩니다. *
          </label>
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-gold text-navy font-bold rounded-sm hover:bg-gold-light transition-colors duration-200 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-sm"
        >
          {loading ? (
            <span className="w-4 h-4 border-2 border-navy/30 border-t-navy rounded-full animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {loading ? "신청 중..." : "무료 상담 신청하기"}
        </button>
      </div>
    </form>
  );
}
