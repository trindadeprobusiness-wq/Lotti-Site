"use client";

import { type ElementType, useRef } from "react";
import { useRevealOnce } from "@/hooks/useRevealOnce";

type TextRevealProps = {
  text: string;
  as?: ElementType;
  className?: string;
  delay?: number;
  wordDelay?: number;
};

export function TextReveal({
  text,
  as: Tag = "p",
  className = "",
  delay = 0,
  wordDelay = 30,
}: TextRevealProps) {
  const ref = useRef<HTMLElement>(null);
  const visible = useRevealOnce(ref);
  const words = text.split(" ");
  const isGradient = className.includes("text-gradient");
  const outerClassName = className.replace("text-gradient", "").trim();

  return (
    <Tag ref={ref as never} className={outerClassName} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="inline-block overflow-hidden"
            style={{ marginRight: "0.25em" }}
          >
            <span
              className={`inline-block transition-[opacity,transform] duration-[800ms] ${
                isGradient ? "text-gradient" : ""
              }`}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(100%)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: `${delay + index * wordDelay}ms`,
              }}
            >
              {word}
            </span>
          </span>
        ))}
      </span>
    </Tag>
  );
}
