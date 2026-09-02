"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 64rem)");
    const closeOnDesktop = () => {
      if (desktop.matches) setOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <header data-site-header="" className="site-header">
      <div
        data-header-open={open ? "true" : "false"}
        data-header-scrolled={scrolled ? "true" : "false"}
        className={[
          "site-header-shell on-ink",
          open ? "is-open" : "",
          scrolled ? "is-scrolled" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="site-header-row">
          <a
            href="#topo"
            aria-label="Lotti - início da página"
            className="site-header-logo"
            onClick={() => setOpen(false)}
          >
            <Logo tone="paper" size={18} />
          </a>

          <nav aria-label="Seções do site" className="site-header-desktop-nav">
            {nav.map((item) => (
              <a key={item.href} href={item.href} className="site-header-nav-link">
                {item.label}
              </a>
            ))}
          </nav>

          <Button
            href="#demo"
            variant="inverted"
            className="site-header-desktop-cta"
          >
            {hero.primaryCta}
          </Button>

          <button
            type="button"
            data-menu-toggle=""
            className="site-menu-toggle"
            aria-expanded={open}
            aria-controls="menu-mobile"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span
              data-menu-line=""
              className="site-menu-line site-menu-line-top"
              aria-hidden="true"
            />
            <span
              data-menu-line=""
              className="site-menu-line site-menu-line-bottom"
              aria-hidden="true"
            />
          </button>
        </div>

        <div
          id="menu-mobile"
          data-mobile-nav=""
          className="site-mobile-menu"
          aria-hidden={!open}
        >
          <div className="site-mobile-menu-inner">
            <nav aria-label="Seções do site" className="site-mobile-nav">
              {nav.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className="site-mobile-nav-link"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <Button
              href="#demo"
              variant="inverted"
              tabIndex={open ? 0 : -1}
              onClick={() => setOpen(false)}
              className="site-mobile-cta"
            >
              {hero.primaryCta}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
