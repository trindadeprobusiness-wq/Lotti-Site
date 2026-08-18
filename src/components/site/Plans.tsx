import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PricingCards } from "@/components/site/pricing/PricingCards";
import { plans } from "@/content/landing";

/**
 * Bloco de planos da home. O <h1> da página é o do Hero, então o título aqui
 * sai como <h2> pelo SectionHeading — o PricingHero, que traz o próprio <h1>,
 * fica reservado para /planos. O comparativo completo e o FAQ também moram
 * lá, para a home não repetir a página inteira.
 */
export function Plans() {
  return (
    <section id="planos">
      <div className="section pb-8">
        <div className="shell">
          <SectionHeading
            eyebrow={plans.eyebrow}
            title={plans.title}
            lead={plans.lead}
            align="center"
          />
        </div>
      </div>

      <PricingCards />

      <div className="shell flex justify-center pb-[clamp(4.5rem,9vw,8rem)]">
        <Reveal>
          <Button href="/planos" arrow>
            {plans.cta}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
