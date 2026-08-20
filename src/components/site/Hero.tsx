import { Button } from "@/components/ui/Button";
import { ProductCarousel } from "@/components/ui/ProductCarousel";
import { hero } from "@/content/landing";

/**
 * O hero é o LCP da página: nada aqui entra com fade ou observer.
 * O campo de lâminas ao fundo é a geometria do símbolo virando estrutura.
 */
import { TextReveal } from "@/components/ui/TextReveal";

export function Hero() {
  return (
    <section id="topo" className="relative overflow-hidden pt-[calc(var(--header-h)+clamp(3rem,7vw,5.5rem))] pb-[clamp(3rem,7vw,6rem)] hero-mesh">
      <BladeField />

      <div className="shell relative z-10">
        <p className="eyebrow">{hero.eyebrow}</p>

        <h1 className="mt-7 max-w-[15ch] text-display text-balance">
          <TextReveal as="span" className="block text-ink" text={hero.headline[0]} delay={100} />
          <TextReveal as="span" className="block text-gradient-forest pb-2" text={hero.headline[1]} delay={300} />
        </h1>

        <TextReveal
          as="p"
          text={hero.lead}
          delay={500}
          className="mt-7 max-w-[56ch] text-lead text-muted"
        />

        <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
          <Button href="#demo" arrow className="btn-shimmer w-full shadow-lg sm:w-auto">
            {hero.primaryCta}
          </Button>
          <Button
            href="#recursos"
            variant="secondary"
            className="glass w-full transition-transform hover:scale-105 sm:w-auto"
          >
            {hero.secondaryCta}
          </Button>
        </div>

        <p className="mt-5 text-small text-muted">{hero.footnote}</p>

        <div className="mt-16 lg:mt-20 perspective-[2000px]">
          <div className="transform-gpu transition-all duration-700 hover:rotate-x-[2deg] hover:rotate-y-[-2deg] hover:scale-[1.01]">
            <ProductCarousel
              sizes="(max-width: 1216px) 100vw, 1216px"
              className="shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
            />
          </div>
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
