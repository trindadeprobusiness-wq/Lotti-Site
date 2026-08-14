import type { ReactNode } from "react";
import { TextReveal } from "./TextReveal";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: string;
  /** Sobre a faixa preta, inverte as cores do texto. */
  tone?: "ink" | "paper";
  align?: "start" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  tone = "ink",
  align = "start",
  className,
}: SectionHeadingProps) {
  const isPaper = tone === "paper";

  return (
    <div
      className={[
        "flex flex-col",
        align === "center" ? "items-center text-center" : "items-start",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="eyebrow">{eyebrow}</p>
      
      {typeof title === "string" ? (
        <TextReveal
          as="h2"
          text={title}
          delay={100}
          className={[
            "mt-6 max-w-[19ch] text-h2 text-balance",
            isPaper ? "text-paper" : "text-ink",
          ].join(" ")}
        />
      ) : (
        <h2
          className={[
            "mt-6 max-w-[19ch] text-h2 text-balance",
            isPaper ? "text-paper" : "text-ink",
          ].join(" ")}
        >
          {title}
        </h2>
      )}

      {lead ? (
        <p
          className={[
            "mt-5 max-w-[52ch] text-lead",
            isPaper ? "text-white/70" : "text-muted",
            "reveal"
          ].join(" ")}
        >
          {lead}
        </p>
      ) : null}
    </div>
  );
}
