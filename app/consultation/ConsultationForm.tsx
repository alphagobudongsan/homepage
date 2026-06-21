"use client";

import { useState } from "react";
import { CheckCircle, Send, MessageCircle } from "lucide-react";
import SelectMenu from "@/components/ui/select-menu";

const COMPLEXES = [
  "e편한세상 옥정어반센트럴",
  "옥정센트럴파크푸르지오",
  "옥정중앙역중흥S-클래스센텀시티(1단지)",
  "옥정중앙역중흥S-클래스센텀시티(2단지)",
  "양주옥정신도시제일풍경채레이크시티1단지",
  "양주옥정신도시제일풍경채레이크시티2단지",
  "양주옥정신도시디에트르프레스티지",
  "e편한세상 옥정에듀써밋",
  "e편한세상 옥정더퍼스트",
  "옥정 대방노블랜드더시그니처",
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

// Web3Forms Access Key (이메일 수신용, 공개 키라 노출 무방)
const WEB3FORMS_KEY = "fb6d2fef-5b06-49bf-abf3-cb2c8db0cfd9";

// 카카오톡 채널 (카톡 상담 버튼)
export const KAKAO_CHANNEL_URL = "https://pf.kakao.com/_xhtexnG";

type PurposeType = "매매" | "전세" | "월세" | "기타";
type ModeType = "seek" | "list"; // seek: 집을 구해요(매수·임차), list: 집을 내놓아요(매도·임대)

export default function ConsultationForm() {
  const [mode, setMode] = useState<ModeType>("seek");
  const [purpose, setPurpose] = useState<PurposeType>("매매");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    complex: "",
    budget: "",
    price: "",
    size: "",
    moveDate: "",
    message: "",
    agreePrivacy: false,
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    setError("");
    try {
      const payload = {
        access_key: WEB3FORMS_KEY,
        subject: `[알파고 상담신청] ${
          mode === "seek" ? "구해요" : "내놓아요"
        } · ${purpose} · ${form.name}`,
        from_name: "알파고 홈페이지 상담신청",
        상담구분: mode === "seek" ? "집을 구해요(매수·임차)" : "집을 내놓아요(매도·임대)",
        거래유형: purpose,
        이름: form.name,
        연락처: form.phone,
        단지: form.complex || "미정",
        ...(mode === "seek"
          ? { 예산: form.budget || "미정", "희망 면적": form.size || "미정" }
          : { "희망 가격": form.price || "미정", "보유 면적": form.size || "미정" }),
        시기: form.moveDate || "미정",
        문의사항: form.message || "(없음)",
      };
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
      } else {
        setError(
          "전송에 실패했어요. 잠시 후 다시 시도하시거나 전화(031-864-4222)로 문의해 주세요."
        );
      }
    } catch {
      setError(
        "전송 중 오류가 발생했어요. 전화(031-864-4222)로 문의해 주세요."
      );
    } finally {
      setLoading(false);
    }
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
            <div className="text-text-muted">상담 구분</div>
            <div className="font-semibold text-navy">
              {mode === "seek" ? "집을 구해요 (매수·임차)" : "집을 내놓아요 (매도·임대)"}
            </div>
            <div className="text-text-muted">거래 유형</div>
            <div className="font-semibold text-navy">{purpose}</div>
            <div className="text-text-muted">연락처</div>
            <div className="font-semibold text-navy">{form.phone}</div>
            <div className="text-text-muted">
              {mode === "seek" ? "희망 단지" : "보유 단지"}
            </div>
            <div className="font-semibold text-navy">{form.complex || "미정"}</div>
            <div className="text-text-muted">
              {mode === "seek" ? "예산" : "희망 가격"}
            </div>
            <div className="font-semibold text-navy">
              {mode === "seek" ? form.budget || "협의" : form.price || "협의"}
            </div>
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
              price: "",
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
        {/* Mode — 상담 구분 */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            상담 구분 *
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(
              [
                { key: "seek", title: "집을 구해요", desc: "매수 · 임차" },
                { key: "list", title: "집을 내놓아요", desc: "매도 · 임대" },
              ] as { key: ModeType; title: string; desc: string }[]
            ).map((m) => (
              <button
                key={m.key}
                type="button"
                onClick={() => setMode(m.key)}
                className={`px-4 py-3 rounded-sm border text-left transition-colors duration-150 cursor-pointer ${
                  mode === m.key
                    ? "bg-navy text-white border-navy"
                    : "border-border text-text-muted hover:border-navy hover:text-navy"
                }`}
              >
                <div className="text-sm font-bold">{m.title}</div>
                <div
                  className={`text-xs mt-0.5 ${
                    mode === m.key ? "text-white/70" : "text-text-light"
                  }`}
                >
                  {m.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Purpose — 거래 유형 */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-2">
            거래 유형 *
          </label>
          <div className="flex flex-wrap gap-2">
            {(["매매", "전세", "월세", "기타"] as PurposeType[]).map((p) => (
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
            ))}
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

        {/* Complex (label 적응형) */}
        <div>
          <label className="block text-sm font-semibold text-navy mb-1.5">
            {mode === "seek" ? "희망 단지" : "보유(매물) 단지"}
          </label>
          <SelectMenu
            ariaLabel={mode === "seek" ? "희망 단지" : "보유 단지"}
            value={form.complex}
            onChange={(v) => setForm((p) => ({ ...p, complex: v }))}
            placeholder="단지를 선택하세요"
            options={COMPLEXES.map((c) => ({ value: c, label: c }))}
          />
        </div>

        {/* 적응형: 구해요 → 예산/희망면적 / 내놓아요 → 희망가격/보유면적 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mode === "seek" ? (
            <div>
              <label className="block text-sm font-semibold text-navy mb-1.5">
                예산 범위
              </label>
              <SelectMenu
                ariaLabel="예산 범위"
                value={form.budget}
                onChange={(v) => setForm((p) => ({ ...p, budget: v }))}
                placeholder="예산을 선택하세요"
                options={BUDGETS.map((b) => ({ value: b, label: b }))}
              />
            </div>
          ) : (
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-navy mb-1.5"
              >
                희망 가격
              </label>
              <input
                id="price"
                name="price"
                type="text"
                value={form.price}
                onChange={handleChange}
                placeholder="예: 매매 4.2억 / 전세 2.5억 / 월세 1000·60"
                className="w-full px-3 py-2.5 border border-border rounded-sm text-sm text-text placeholder:text-text-light focus:outline-none focus:border-navy transition-colors"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-navy mb-1.5">
              {mode === "seek" ? "희망 면적" : "보유 면적"}
            </label>
            <SelectMenu
              ariaLabel={mode === "seek" ? "희망 면적" : "보유 면적"}
              value={form.size}
              onChange={(v) => setForm((p) => ({ ...p, size: v }))}
              placeholder="면적을 선택하세요"
              options={SIZES.map((s) => ({ value: s, label: s }))}
            />
          </div>
        </div>

        {/* Move Date (label 적응형) */}
        <div>
          <label
            htmlFor="moveDate"
            className="block text-sm font-semibold text-navy mb-1.5"
          >
            {mode === "seek" ? "희망 이사 시기" : "입주 가능 시기"}
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
        {error && (
          <p className="mb-3 text-sm text-gold-dark bg-gold/10 border border-gold/30 rounded-sm px-3 py-2">
            {error}
          </p>
        )}
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

        <div className="flex items-center gap-3 my-4">
          <span className="flex-1 h-px bg-border" />
          <span className="text-xs text-text-light">또는</span>
          <span className="flex-1 h-px bg-border" />
        </div>

        <a
          href={KAKAO_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#FEE500] text-[#191919] font-bold rounded-sm hover:brightness-95 transition-all duration-200 cursor-pointer text-sm"
        >
          <MessageCircle className="w-4 h-4 fill-[#191919]" />
          카카오톡으로 바로 상담하기
        </a>
      </div>
    </form>
  );
}
