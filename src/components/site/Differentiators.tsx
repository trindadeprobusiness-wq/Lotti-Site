import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { differentiators } from "@/content/landing";

/**
 * Sem cards aqui. Depois da seção de recursos, que é toda emoldurada,
 * esta respira: só tipografia grande e réguas de 1px.
 */
export function Differentiators() {
  return (
    <section id="diferenciais" className="section bg-surface">
      <div className="shell">
        <SectionHeading eyebrow={differentiators.eyebrow} title={differentiators.title} />

        <div className="mt-14 grid gap-x-12 gap-y-10 md:grid-cols-2">
          {differentiators.items.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal
                as="article"
                key={item.title}
                delay={index * 70}
                className="border-t border-line pt-8"
              >
                <Icon size={20} strokeWidth={1.5} className="text-ink" aria-hidden="true" />
                <h3 className="mt-5 max-w-[24ch] text-[1.375rem] font-semibold leading-[1.25] tracking-[-0.025em] text-ink text-balance">
                  {item.title}
                </h3>
                <p className="mt-3 max-w-[46ch] text-muted">{item.description}</p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
