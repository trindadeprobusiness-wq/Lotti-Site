import { CLEAR_SPACE_RATIO } from "./LottiMark";

type LogoProps = {
  /** Altura de referência da assinatura em px. */
  size?: number;
  /** Variante para fundo claro (ink) ou escuro (paper). */
  tone?: "ink" | "paper";
  /** Aplica a área de proteção definida pela marca. */
  clearSpace?: boolean;
  className?: string;
};

export function Logo({
  size = 26,
  tone = "ink",
  clearSpace = false,
  className,
}: LogoProps) {
  const padding = clearSpace ? size * CLEAR_SPACE_RATIO : 0;
  const src =
    tone === "paper"
      ? "/brand/lotti-white.svg"
      : "/brand/lotti-linear-dark.svg";

  return (
    <span className={className} style={{ display: "inline-flex", padding }}>
      {/* O SVG oficial já reúne símbolo e lettering; não recompomos a marca. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="Lotti"
        style={{ height: size * 1.25, width: "auto", display: "block" }}
      />
    </span>
  );
}
