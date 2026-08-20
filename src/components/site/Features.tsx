import { Check, type LucideIcon } from "lucide-react";
import { ProductShot } from "@/components/ui/ProductShot";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { features } from "@/content/landing";

const primaryVisuals = [
  <ProductShot
    key="funil"
    src="/product/funil-etapas.png"
    alt="Funil de vendas em Kanban, com negócios distribuídos por etapa"
    aspect="1608/857"
    showScreenshot
    sizes="(max-width: 1024px) 100vw, 46vw"
  />,
  <ProductShot
    key="fachadas"
    src="/product/fachadas-qr.png"
    alt="Painel de Fachadas Inteligentes com métricas e QR Code em atividade"
    aspect="1601/868"
    showScreenshot
    sizes="(max-width: 1024px) 100vw, 46vw"
  />,
];

/** Ícone modular + nome do módulo. Sem a régua diagonal: o ícone já ancora. */
function FeatureLabel({ icon: Icon, label }: { icon: LucideIcon; label: string }) {
  return (
    <span className="flex items-center gap-3">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-line text-ink">
        <Icon size={18} strokeWidth={1.5} aria-hidden="true" />
      </span>
      <span className="eyebrow eyebrow-bare">{label}</span>
    </span>
  );
}

export function Features() {
  return (
    <section id="recursos" className="section">
      <div className="shell">
        <SectionHeading
          eyebrow={features.eyebrow}
          title={features.title}
          lead={features.lead}
        />

        {/* Os dois módulos que definem o produto ganham a linha inteira */}
        <div className="mt-14 flex flex-col gap-6">
          {features.primary.map((feature, index) => {
            const Icon = feature.icon;
            const flip = index % 2 === 1;

            return (
              <Reveal
                as="article"
                key={feature.label}
                className="card grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-2 lg:gap-12 lg:p-10"
              >
                <div className={flip ? "lg:order-2" : undefined}>
                  <FeatureLabel icon={Icon} label={feature.label} />
                  <h3 className="mt-5 max-w-[20ch] text-h2 text-balance">
                    {feature.title}
                  </h3>
                  <p className="mt-4 max-w-[52ch] text-muted">{feature.description}</p>

                  {feature.points ? (
                    <ul className="mt-6 flex flex-col gap-2.5">
                      {feature.points.map((point) => (
                        <li key={point} className="flex items-start gap-2.5 text-small">
                          <Check
                            size={16}
                            strokeWidth={2}
                            className="mt-0.5 shrink-0 text-ink"
                            aria-hidden="true"
                          />
                          <span className="text-muted">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>

                <div className={flip ? "lg:order-1" : undefined}>
                  {primaryVisuals[index]}
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* Os quatro restantes, em grade */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {features.secondary.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Reveal
                as="article"
                key={feature.label}
                delay={index * 60}
                className={`card flex flex-col p-6 sm:p-8 glass transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-ink/20 ${
                  index === 0 || index === 3 ? "md:col-span-2 lg:col-span-1" : ""
                }`}
              >
                <FeatureLabel icon={Icon} label={feature.label} />
                <h3 className="mt-5 max-w-[22ch] text-h3 text-ink">{feature.title}</h3>
                <p className="mt-3 text-small text-muted">{feature.description}</p>

                {feature.label === "Módulos de apoio" ? (
                  <ul className="mt-6 flex flex-wrap gap-2">
                    {features.supportModules.map(({ icon: ModuleIcon, label }) => (
                      <li
                        key={label}
                        className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-eyebrow uppercase text-muted transition-colors hover:bg-surface hover:text-ink"
                      >
                        <ModuleIcon size={13} strokeWidth={1.75} aria-hidden="true" />
                        {label}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
