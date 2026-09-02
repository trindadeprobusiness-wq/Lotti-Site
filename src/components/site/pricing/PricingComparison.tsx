import { Check, Minus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { comparisonCategories, comparisonFeatures, plansData } from "@/content/pricing";

function CellValue({ value }: { value: boolean | string }) {
  if (typeof value === "boolean") {
    return value ? (
      <Check className="h-4 w-4 text-ink" aria-label="Incluído" />
    ) : (
      <Minus className="h-4 w-4 text-line" aria-label="Não incluído" />
    );
  }
  return <span>{value}</span>;
}

export function PricingComparison() {
  return (
    <section className="section py-16">
      <div className="shell max-w-5xl">
        <Reveal>
          <SectionHeading
            eyebrow="Comparação"
            title="Compare os limites e o atendimento."
            lead="Os números abaixo são os limites mensais oficiais de cada plano."
            align="center"
          />

          {/* Desktop: tabela de 4 colunas */}
          <div className="mt-14 card overflow-hidden hidden md:block">
            <div className="grid grid-cols-[2fr_1fr_1fr_1fr] border-b border-line bg-surface/50 p-6">
              <div className="font-medium text-muted">Recursos</div>
              {plansData.map((plan) => (
                <div key={plan.code} className="text-center font-medium text-ink">
                  {plan.name}
                </div>
              ))}
            </div>

            <div className="divide-y divide-line">
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
                          <div className="flex justify-center text-ink">
                            <CellValue value={feature.essencial} />
                          </div>
                          <div className="flex justify-center text-ink">
                            <CellValue value={feature.profissional} />
                          </div>
                          <div className="flex justify-center text-ink font-medium">
                            <CellValue value={feature.imobiliaria} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Mobile: cards empilhados por plano */}
          <div className="mt-14 flex flex-col gap-6 md:hidden">
            {plansData.map((plan) => {
              const planKey = plan.code as "essencial" | "profissional" | "imobiliaria";

              return (
                <div key={plan.code} className="card overflow-hidden">
                  <div className="border-b border-line bg-surface/50 p-5">
                    <h3 className="font-semibold text-ink">{plan.name}</h3>
                    <p className="text-small text-muted">{plan.audience}</p>
                  </div>

                  <div className="divide-y divide-line">
                    {comparisonCategories.map((category) => {
                      const categoryFeatures = comparisonFeatures.filter(
                        (f) => f.category === category.key
                      );

                      if (categoryFeatures.length === 0) return null;

                      const CategoryIcon = category.icon;

                      return (
                        <div key={category.key} className="px-5 py-4">
                          <div className="mb-3 flex items-center gap-2">
                            <CategoryIcon className="h-4 w-4 text-muted" />
                            <span className="text-eyebrow uppercase text-muted">
                              {category.label}
                            </span>
                          </div>

                          <ul className="space-y-2.5">
                            {categoryFeatures.map((feature, idx) => {
                              const value = feature[planKey];
                              return (
                                <li
                                  key={idx}
                                  className="flex items-center justify-between gap-3 text-small"
                                >
                                  <span className="text-muted">{feature.label}</span>
                                  <span className="shrink-0 font-medium text-ink">
                                    <CellValue value={value} />
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
