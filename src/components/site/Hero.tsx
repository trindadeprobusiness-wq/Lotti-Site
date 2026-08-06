import { Button } from "@/components/ui/Button";
import { ProductShot } from "@/components/ui/ProductShot";
import { hero } from "@/content/landing";

/**
 * O hero é o LCP da página: nada aqui entra com fade ou observer.
 * O campo de lâminas ao fundo é a geometria do símbolo virando estrutura.
 */
export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden pt-[calc(var(--header-h)+clamp(3rem,7vw,5.5rem))] pb-[clamp(3rem,7vw,6rem)]">
      <BladeField />

      <div className="shell relative">
        <p className="eyebrow">{hero.eyebrow}</p>

        <h1 className="mt-7 max-w-[15ch] text-display text-balance">
          <span className="block text-muted">{hero.headline[0]}</span>
          <span className="block text-ink">{hero.headline[1]}</span>
        </h1>

        <p className="mt-7 max-w-[56ch] text-lead text-muted">{hero.lead}</p>

        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Button href="#demo" arrow>
            {hero.primaryCta}
          </Button>
          <Button href="#recursos" variant="secondary">
            {hero.secondaryCta}
          </Button>
        </div>

        <p className="mt-5 text-small text-muted">{hero.footnote}</p>

        <div className="mt-16 lg:mt-20">
          <ProductShot
            src="/product/hero-dashboard.png"
            alt="Painel da Lotti com os módulos de gestão imobiliária"
            aspect="16/10"
            priority
            sizes="(max-width: 1216px) 100vw, 1216px"
          />
        </div>
      </div>
    </section>
  );
}

/**
 * Três lâminas ascendentes no ângulo do símbolo. Puramente decorativas:
 * ficam atrás do conteúdo, em cinza secundário, e nunca tocam o texto.
 */
function BladeField() {
  // Larguras e folgas na proporção do símbolo: lâminas grossas, respiro fino,
  // alturas decrescendo para a direita.
  const blades = [
    { left: "64%", width: "5rem", top: "-26%", height: "96%" },
    { left: "71%", width: "5rem", top: "-10%", height: "80%" },
    { left: "78%", width: "5rem", top: "6%", height: "64%" },
  ];

  return (
    <div className="blade-field" aria-hidden="true">
      {blades.map((blade) => (
        <span key={blade.left} className="blade" style={blade} />
      ))}
    </div>
  );
}
