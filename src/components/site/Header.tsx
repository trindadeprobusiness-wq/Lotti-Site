"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { Button } from "@/components/ui/Button";
import { hero, nav } from "@/content/landing";

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
      className={[
        "fixed inset-x-0 top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-paper"
          : "border-b border-transparent bg-paper/80 backdrop-blur-sm",
      ].join(" ")}
      style={{ height: "var(--header-h)" }}
    >
      <div className="shell flex h-full items-center justify-between gap-6">
        <a
          href="#topo"
          aria-label={`${"Lotti"} — início da página`}
          className="-m-2 rounded-md p-2"
        >
          <Logo size={24} />
        </a>

        <nav aria-label="Seções do site" className="hidden items-center gap-9 lg:flex">
          {nav.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="link-underline text-small font-medium text-muted transition-colors hover:text-ink"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button href="#demo" className="hidden lg:inline-flex">
            {hero.primaryCta}
          </Button>

          <button
            type="button"
            className="-m-2 rounded-md p-2 text-ink lg:hidden"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>
        </div>
      </div>

      {/* Painel mobile */}
      <div
        id="menu-mobile"
        hidden={!open}
        className="border-t border-line bg-paper lg:hidden"
        style={{ height: "calc(100dvh - var(--header-h))" }}
      >
        <div className="shell flex h-full flex-col justify-between py-8">
          <nav aria-label="Seções do site" className="flex flex-col">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="border-b border-line py-5 text-h2 text-ink"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <Button
            href="#demo"
            arrow
            onClick={() => setOpen(false)}
            className="w-full"
          >
            {hero.primaryCta}
          </Button>
        </div>
      </div>
    </header>
  );
}
