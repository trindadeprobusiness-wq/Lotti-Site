import { Reveal } from "@/components/ui/Reveal";
import { pricingCopy } from "@/content/pricing";

export function PricingHero() {
  return (
    <section className="section pb-8 pt-16 md:pt-24 lg:pt-32">
      <div className="shell flex flex-col items-center text-center">
        <Reveal>
          <p className="eyebrow">Planos e Preços</p>
          <h1 className="mx-auto mt-6 max-w-[22ch] text-display text-balance">
            {pricingCopy.title}
          </h1>
          <p className="mx-auto mt-6 max-w-[60ch] text-lead text-muted">
            {pricingCopy.subtitle}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
