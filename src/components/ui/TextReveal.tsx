"use client";

import { useEffect, useRef, useState } from "react";

type TextRevealProps = {
  text: string;
  as?: any;
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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.05 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  if (typeof text !== "string") {
    return <Tag className={className}>{text}</Tag>;
  }

  const words = text.split(" ");

  return (
    <Tag ref={ref as never} className={className} aria-label={text}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-block">
        {words.map((word, i) => (
          <span
            key={i}
            className="inline-block overflow-hidden"
            style={{ marginRight: "0.25em" }}
          >
            <span
              className="inline-block transition-all duration-[800ms]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(100%)",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: `${delay + i * wordDelay}ms`,
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
