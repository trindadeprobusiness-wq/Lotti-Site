import { siteConfig } from "@/config/site";
import { CLEAR_SPACE_RATIO, LottiMark } from "./LottiMark";

type LogoProps = {
  /** Altura do símbolo em px. O wordmark escala junto. */
  size?: number;
  /** Cor da marca. "paper" é a versão invertida, para a faixa preta. */
  tone?: "ink" | "paper";
  /** Aplica a área de proteção do manual (altura da pílula) ao redor. */
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

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: size * 0.3,
        padding,
        color: tone === "paper" ? "#ffffff" : "#000000",
      }}
    >
      {siteConfig.useOfficialBrandFiles ? (
        // O arquivo oficial é um SVG de proporção própria; deixamos a altura
        // mandar e a largura seguir. next/image não otimiza SVG, então uma
        // <img> simples é mais direta e não introduz layout shift aqui.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={
            tone === "paper"
              ? "/brand/lotti-full-white.svg"
              : "/brand/lotti-full.svg"
          }
          alt="Lotti"
          style={{ height: size * 1.5, width: "auto", display: "block" }}
        />
      ) : (
        <>
          <LottiMark
            style={{ height: size, width: "auto", display: "block", flex: "none" }}
          />
          <span
            style={{
              fontFamily:
                "var(--font-sora), ui-sans-serif, system-ui, sans-serif",
              // O manual alinha o topo do "L" ao topo do símbolo e a baseline
              // à base dele. O cap-height da Sora é ~0,7em, então a fonte
              // precisa medir size/0,7 para o cap bater com a altura do símbolo;
              // com line-height 1 e alinhamento central o encaixe é exato.
              fontSize: size / 0.7,
              fontWeight: 600,
              letterSpacing: "-0.02em",
              lineHeight: 1,
            }}
          >
            Lotti
          </span>
        </>
      )}
    </span>
  );
}
