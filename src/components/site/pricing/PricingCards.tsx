import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { planCapacityItems } from "@/content/plans";
import { plansData, pricingCopy } from "@/content/pricing";

export function PricingCards() {
  return (
    <section className="section pt-0 pb-16">
      <div className="shell">
        <Reveal className="mb-12 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <span className="h-2 w-2 rounded-full bg-forest" aria-hidden="true" />
            Cobrança mensal
          </span>
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {plansData.map((plan, index) => {
            const Icon = plan.icon;
            const capacity = planCapacityItems(plan);

            return (
              <Reveal key={plan.code} delay={index * 0.1}>
                <article
                  data-pricing-card={plan.highlighted ? "highlighted" : undefined}
                  className={`card relative flex h-full flex-col p-7 sm:p-8 ${
                    plan.highlighted
                      ? "overflow-visible bg-surface shadow-2xl"
                      : "hover:-translate-y-1"
                  }`}
                >
                  {plan.highlighted ? (
                    <>
                      <div
                        data-pricing-beam=""
                        aria-hidden="true"
                        className="border-beam-wrapper pointer-events-none absolute inset-0 rounded-[inherit]"
                      />
                      <div className="absolute -top-4 left-1/2 z-10 -translate-x-1/2">
                        <span className="inline-flex whitespace-nowrap rounded-full bg-forest px-4 py-1 text-[0.67rem] font-bold tracking-[0.1em] text-white shadow-md">
                          {pricingCopy.highlightBadge}
                        </span>
                      </div>
                    </>
                  ) : null}

                  <div className="relative z-10 flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-line bg-paper text-forest">
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink">{plan.name}</h3>
                      <p className="mt-1 text-sm leading-snug text-muted">{plan.audience}</p>
                    </div>
                  </div>

                  <div className="relative z-10 mt-7">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight text-ink">
                        R$ {plan.monthlyPrice}
                      </span>
                      <span className="text-muted">/mês</span>
                    </div>
                    <p className="mt-2 text-sm text-muted">Renovação mensal</p>
                  </div>

                  <Button
                    href={`/checkout?plano=${plan.code}`}
                    variant={plan.highlighted ? "primary" : "secondary"}
                    className={`relative z-10 mt-6 w-full justify-center ${
                      plan.highlighted ? "btn-shimmer shadow-md" : ""
                    }`}
                  >
                    {plan.cta}
                  </Button>

                  <div className="relative z-10 mt-8 rounded-2xl border border-line bg-paper/80 p-4">
                    <p className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted">
                      Capacidade incluída
                    </p>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-5">
                      {capacity.map((item) => (
                        <div key={item.label} className="min-w-0">
                          <dt className="text-[0.7rem] leading-snug text-muted">{item.label}</dt>
                          <dd className="mt-1 text-sm font-semibold text-ink">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  <div className="relative z-10 mt-7 flex-1">
                    <p className="mb-4 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-muted">
                      Benefícios do plano
                    </p>
                    <ul className="grid gap-3">
                      {plan.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-start gap-3 text-sm leading-relaxed text-muted">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-forest" aria-hidden="true" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {plan.migrationNote ? (
                    <p className="relative z-10 mt-6 border-t border-line pt-5 text-xs leading-relaxed text-muted">
                      {plan.migrationNote}
                    </p>
                  ) : null}
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
