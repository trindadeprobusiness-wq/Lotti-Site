import { Logo } from "@/components/brand/Logo";
import { DemoForm } from "@/components/ui/DemoForm";
import { finalCta } from "@/content/landing";

/**
 * Versão invertida do manual: a faixa preta fecha a página e o formulário
 * mora dentro dela. O foco visível inverte via .on-ink no globals.css.
 */
export function FinalCta() {
  return (
    <section id="demo" className="on-ink section bg-ink text-paper">
      <div className="shell grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div>
          {/* .eyebrow é inline-flex, então o logo precisa de um bloco próprio
              para não dividir a linha com ele. */}
          <div>
            <Logo size={24} tone="paper" />
          </div>

          <p className="eyebrow mt-10">{finalCta.eyebrow}</p>
          <h2 className="mt-6 max-w-[14ch] text-h2 text-paper text-balance">
            {finalCta.title}
          </h2>
          <p className="mt-5 max-w-[46ch] text-lead text-white/70">{finalCta.lead}</p>

          <ul className="mt-9 flex flex-wrap gap-2">
            {finalCta.reassurance.map((item) => (
              <li
                key={item}
                className="rounded-full border border-white/20 px-3.5 py-1.5 text-eyebrow uppercase text-white/70"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:pt-2">
          <DemoForm />
        </div>
      </div>
    </section>
  );
}
