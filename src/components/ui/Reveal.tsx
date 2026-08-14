"use client";

import { type ReactNode, useRef } from "react";
import { useRevealOnce } from "@/hooks/useRevealOnce";

type RevealProps = {
  children: ReactNode;
  /** Atraso em ms, para escalonar itens de uma mesma linha. */
  delay?: number;
  className?: string;
  as?: "div" | "li" | "section" | "article";
};

export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const visible = useRevealOnce(ref);

  return (
    <Tag
      ref={ref as never}
      className={["reveal", className].filter(Boolean).join(" ")}
      data-visible={visible ? "true" : "false"}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
