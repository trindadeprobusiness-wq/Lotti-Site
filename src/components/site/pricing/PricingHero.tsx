import { Reveal } from "@/components/ui/Reveal";
import { pricingCopy } from "@/content/pricing";

export function PricingHero() {
  return (
    <section className="section pb-8 pt-16 md:pt-24 lg:pt-32">
      <div className="shell text-center">
        <Reveal>
          <h1 className="mx-auto max-w-4xl text-h1 text-balance">
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
