"use client";

import React from "react";

interface HoverFillButtonProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  /** 내부 텍스트 span의 크기/여백 등 (예: "px-6 py-3 text-sm") */
  textClassName?: string;
}

/**
 * 위→아래로 어두운 배경이 채워지고 상·하 테두리가 나타나며 글씨가 흰색으로 바뀌는 hover 효과.
 * active=true 이면 채워진 상태로 고정.
 */
export default function HoverFillButton({
  active = false,
  onClick,
  children,
  textClassName = "px-4 py-2 text-base",
}: HoverFillButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="relative inline-block group cursor-pointer"
    >
      {/* 글씨 */}
      <span
        className={`relative z-10 block font-bold whitespace-nowrap transition-colors duration-300 ${
          active ? "text-white" : "text-navy group-hover:text-white"
        } ${textClassName}`}
      >
        {children}
      </span>
      {/* 상·하 테두리 */}
      <span
        className={`absolute inset-0 border-t-2 border-b-2 border-navy transition-all duration-300 origin-center ${
          active
            ? "scale-y-100 opacity-100"
            : "scale-y-[2] opacity-0 group-hover:scale-y-100 group-hover:opacity-100"
        }`}
      />
      {/* 배경 채움 (위에서 아래로) */}
      <span
        className={`absolute top-[2px] left-0 w-full h-full bg-navy transition-all duration-300 origin-top ${
          active
            ? "scale-100 opacity-100"
            : "scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100"
        }`}
      />
    </button>
  );
}
