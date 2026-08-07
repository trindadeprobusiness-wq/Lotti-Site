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
          <div className="flex items-center gap-3 rounded-full border border-border bg-surface p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                !isAnnual ? "bg-ink text-surface" : "text-muted hover:text-ink"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                isAnnual ? "bg-ink text-surface" : "text-muted hover:text-ink"
              }`}
            >
              Anual
            </button>
          </div>
          {isAnnual && (
            <span className="text-sm font-medium text-emerald-600">
              ✨ {pricingCopy.annualSaveBadge}
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
                  className={`card relative flex h-full flex-col p-8 transition-transform hover:-translate-y-1 ${
                    plan.highlighted
                      ? "ring-2 ring-ink shadow-lg scale-[1.02] bg-surface"
                      : ""
                  }`}
                >
                  {plan.highlighted && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="rounded-full bg-ink px-4 py-1 text-xs font-bold tracking-wider text-surface">
                        {pricingCopy.highlightBadge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-border/50 text-ink">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-ink">{plan.name}</h3>
                      <p className="text-sm text-muted">{plan.audience}</p>
                    </div>
                  </div>

                  <div className="mb-6">
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
                    href="http://localhost:5173/plano" // Mock auth link to saas
                    variant={plan.highlighted ? "primary" : "secondary"}
                    className="mb-8 w-full justify-center"
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
