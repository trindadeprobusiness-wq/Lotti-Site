"use client";

import { useEffect, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { nav } from "@/content/landing";

const PLATFORM_URL = "https://olivercrm.vercel.app/";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <header
      className="fixed inset-x-0 top-0 z-50 transition-all duration-300"
      style={{ height: "var(--header-h)" }}
    >
      {/* Floating dark pill navbar */}
      <div className="shell flex h-full items-center justify-center pt-3">
        <div
          className={[
            "header-pill flex w-full items-center justify-between gap-6 rounded-full px-6 py-3 transition-all duration-500",
            scrolled
              ? "header-pill--scrolled"
              : "header-pill--top",
          ].join(" ")}
        >
          {/* Logo */}
          <a
            href="#topo"
            aria-label="Lotti - início da página"
            className="-m-1 rounded-md p-1 shrink-0"
          >
            <Logo size={22} tone="paper" />
          </a>

          {/* Desktop nav links */}
          <nav aria-label="Seções do site" className="hidden items-center gap-8 lg:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="header-link text-small font-medium text-white/70 transition-colors duration-200 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Entrar button + mobile toggle */}
          <div className="flex items-center gap-3">
            <a
              href={PLATFORM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="header-enter-btn hidden items-center gap-2.5 rounded-full py-2 pl-4 pr-2 text-small font-semibold text-white transition-all duration-300 hover:brightness-110 lg:inline-flex"
            >
              Entrar
              <span className="header-enter-icon flex h-8 w-8 items-center justify-center rounded-full bg-[#093323] text-white transition-transform duration-300">
                <ArrowRight size={16} strokeWidth={2.5} />
              </span>
            </a>

            <button
              type="button"
              className="-m-2 rounded-md p-2 text-white lg:hidden"
              aria-expanded={open}
              aria-controls="menu-mobile"
              aria-label={open ? "Fechar menu" : "Abrir menu"}
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </div>

      {/* Painel mobile */}
      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-white/10 bg-[#051e14] lg:hidden"
        style={{ height: "calc(100dvh - var(--header-h))" }}
      >
        <div className="shell flex h-full flex-col justify-between py-8">
          <nav aria-label="Seções do site" className="flex flex-col">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-white/10 py-5 text-h2 text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <a
            href={PLATFORM_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="header-enter-btn flex w-full items-center justify-center gap-2.5 rounded-full py-3.5 text-small font-semibold text-white transition-all duration-300"
          >
            Entrar
            <span className="header-enter-icon flex h-8 w-8 items-center justify-center rounded-full bg-[#093323] text-white">
              <ArrowRight size={16} strokeWidth={2.5} />
            </span>
          </a>
        </div>
      </div>
    </header>
  );
}
