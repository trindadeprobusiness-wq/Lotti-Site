"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { plansData, pricingCopy } from "@/content/pricing";

export function PricingCards() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section className="section pb-16">
      <div className="shell">
        <Reveal className="mb-12 flex flex-col items-center justify-center gap-4">
          <div className="flex items-center gap-3 rounded-full border border-line bg-surface p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                !isAnnual ? "bg-ink text-paper" : "text-muted hover:text-ink"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                isAnnual ? "bg-ink text-paper" : "text-muted hover:text-ink"
              }`}
            >
              Anual
            </button>
          </div>
          {isAnnual && (
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3.5 py-1 text-eyebrow font-semibold uppercase tracking-wider text-ink">
              {pricingCopy.annualSaveBadge}
            </span>
          )}
        </Reveal>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
          {plansData.map((plan, i) => {
            const Icon = plan.icon;
            const price = isAnnual ? plan.annualPrice / 12 : plan.monthlyPrice;
            
            return (
              <Reveal key={plan.code} delay={i * 0.1}>
                <div
                  className={`card relative flex h-full flex-col p-8 ${
                    plan.highlighted
                      ? "border-beam-wrapper bg-surface shadow-2xl"
                      : "hover:-translate-y-1"
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="rounded-full bg-ink px-4 py-1 text-xs font-bold tracking-wider text-paper shadow-md">
                        {pricingCopy.highlightBadge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-line bg-paper text-ink z-10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="z-10">
                      <h3 className="font-semibold text-ink">{plan.name}</h3>
                      <p className="text-sm text-muted">{plan.audience}</p>
                    </div>
                  </div>

                  <div className="mb-6 z-10">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold tracking-tight text-ink">
                        R$ {price.toFixed(0)}
                      </span>
                      <span className="text-muted">/mês</span>
                    </div>
                    <p className="mt-2 text-sm text-muted">
                      {isAnnual
                        ? `Faturado R$ ${plan.annualPrice.toFixed(0)} por ano`
                        : `Faturado mensalmente`}
                    </p>
                  </div>

                  <Button
                    href="/#demo"
                    variant={plan.highlighted ? "primary" : "secondary"}
                    className={`mb-8 w-full justify-center z-10 ${plan.highlighted ? "btn-shimmer shadow-md" : ""}`}
                  >
                    {plan.cta}
                  </Button>

                  <ul className="flex flex-1 flex-col gap-3">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm text-muted">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-ink" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
