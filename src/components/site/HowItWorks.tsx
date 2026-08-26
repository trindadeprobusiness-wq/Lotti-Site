import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { howItWorks } from "@/content/landing";

/**
 * Único lugar da página com numeração — aqui a ordem é informação.
 * No desktop os passos sobem em escada, no mesmo sentido das lâminas.
 * Classes literais para o scanner do Tailwind enxergar.
 */
const stepOffset = [
  "lg:mt-[5.25rem]",
  "lg:mt-[3.5rem]",
  "lg:mt-[1.75rem]",
  "lg:mt-0",
] as const;

export function HowItWorks() {
  return (
    <section id="como-funciona" className="section">
      <div className="shell">
        <SectionHeading eyebrow={howItWorks.eyebrow} title={howItWorks.title} />

        <ol className="mt-14 grid gap-x-8 gap-y-10 lg:grid-cols-4">
          {howItWorks.steps.map((step, index) => (
            <Reveal
              as="li"
              key={step.title}
              delay={index * 80}
              className={[
                "border-t border-line pt-6",
                stepOffset[index] ?? "lg:mt-0",
              ].join(" ")}
            >
              <span
                data-numeric
                className="text-eyebrow uppercase text-forest"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-4 text-h3 text-ink">{step.title}</h3>
              <p className="mt-2.5 max-w-[36ch] text-small text-muted">
                {step.description}
              </p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
