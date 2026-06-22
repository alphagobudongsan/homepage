"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Home } from "lucide-react";

const navLinks = [
  { href: "/", label: "홈" },
  { href: "/market", label: "아파트 시세" },
  { href: "/agents", label: "공인중개사" },
  { href: "/apartments", label: "단지 정보" },
  { href: "/cases", label: "부동산 사례" },
  { href: "/consultation", label: "상담 신청" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy shadow-lg shadow-navy/10"
          : "bg-navy/95 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group cursor-pointer"
          >
            <div className="w-8 h-8 bg-gold rounded-sm flex items-center justify-center flex-shrink-0">
              <Home className="w-4 h-4 text-navy" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] sm:text-xs text-gold-light tracking-[0.08em] font-semibold">
                AI가 추천하는 옥정신도시부동산
              </span>
              <span className="text-white font-bold text-base sm:text-lg tracking-tight">
                알파고 공인중개사사무소
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-sm cursor-pointer ${
                    isActive
                      ? "text-gold"
                      : "text-white/80 hover:text-white"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-gold rounded-full" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA Button */}
          <div className="hidden lg:block">
            <Link
              href="/consultation"
              className="px-5 py-2 bg-gold text-navy text-sm font-semibold rounded-sm hover:bg-gold-light transition-colors duration-200 cursor-pointer"
            >
              무료 상담
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden text-white p-2 cursor-pointer"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden bg-navy border-t border-white/10">
          <nav className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 text-sm font-medium rounded-sm transition-colors duration-150 cursor-pointer ${
                    isActive
                      ? "text-gold bg-white/5"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/consultation"
              className="mt-2 px-4 py-3 bg-gold text-navy text-sm font-semibold rounded-sm text-center cursor-pointer"
            >
              무료 상담 신청
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
