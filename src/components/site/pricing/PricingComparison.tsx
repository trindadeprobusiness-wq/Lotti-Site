import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { comparisonCategories, comparisonFeatures, plansData } from "@/content/pricing";

export function PricingComparison() {
  return (
    <section className="section py-16 hidden md:block">
      <div className="shell max-w-5xl">
        <Reveal>
          <div className="mb-10 text-center">
            <h2 className="text-h2">Compare os planos em detalhes</h2>
          </div>

          <div className="card overflow-hidden">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-border bg-surface/50 p-6">
              <div className="font-medium text-muted">Recursos</div>
              {plansData.map((plan) => (
                <div key={plan.code} className="text-center font-medium text-ink">
                  {plan.name}
                </div>
              ))}
            </div>

            <div className="divide-y divide-border">
              {comparisonCategories.map((category) => {
                const categoryFeatures = comparisonFeatures.filter(
                  (f) => f.category === category.key
                );

                if (categoryFeatures.length === 0) return null;

                const CategoryIcon = category.icon;

                return (
                  <div key={category.key} className="py-6">
                    <div className="mb-4 flex items-center gap-2 px-6">
                      <CategoryIcon className="h-5 w-5 text-muted" />
                      <h3 className="font-semibold text-ink">{category.label}</h3>
                    </div>

                    <div className="space-y-4">
                      {categoryFeatures.map((feature, idx) => (
                        <div
                          key={idx}
                          className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-6 text-sm"
                        >
                          <div className="text-muted">{feature.label}</div>
                          
                          {/* Essencial */}
                          <div className="flex justify-center text-ink">
                            {typeof feature.essencial === "boolean" ? (
                              feature.essencial ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4 text-border" />
                            ) : (
                              feature.essencial
                            )}
                          </div>
                          
                          {/* Profissional */}
                          <div className="flex justify-center text-ink">
                            {typeof feature.profissional === "boolean" ? (
                              feature.profissional ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4 text-border" />
                            ) : (
                              feature.profissional
                            )}
                          </div>
                          
                          {/* Imobiliaria */}
                          <div className="flex justify-center text-ink font-medium">
                            {typeof feature.imobiliaria === "boolean" ? (
                              feature.imobiliaria ? <Check className="h-4 w-4" /> : <Minus className="h-4 w-4 text-border" />
                            ) : (
                              feature.imobiliaria
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
