"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectMenuProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

/**
 * 사이트 톤(검정/빨강/흰색)에 맞춘 커스텀 셀렉트 드롭다운.
 * 부드러운 펼침 애니메이션 + 항목 hover/선택 강조. 외부 클릭·Esc로 닫힘.
 */
export default function SelectMenu({
  value,
  onChange,
  options,
  placeholder = "선택하세요",
  ariaLabel,
  className = "",
}: SelectMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between gap-2 bg-white border rounded-sm pl-3 pr-3 py-2.5 text-sm font-medium cursor-pointer transition-colors ${
          open
            ? "border-gold text-navy"
            : "border-border text-navy hover:border-navy"
        }`}
      >
        <span className={`truncate ${selected ? "text-navy" : "text-text-light"}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-text-muted flex-shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <div
        role="listbox"
        className={`absolute left-0 right-0 top-full mt-1 z-30 origin-top rounded-sm border border-border bg-white shadow-lg max-h-72 overflow-auto transition-all duration-200 ${
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-95 -translate-y-1 pointer-events-none"
        }`}
      >
        {options.map((opt) => {
          const isSel = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={isSel}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2.5 text-sm transition-colors ${
                isSel
                  ? "bg-navy text-white font-semibold"
                  : "text-navy hover:bg-cream"
              }`}
            >
              <span className="truncate">{opt.label}</span>
              {isSel && <Check className="w-4 h-4 flex-shrink-0" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
