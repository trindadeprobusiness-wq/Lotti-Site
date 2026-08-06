import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { plans } from "@/content/landing";

export function Plans() {
  return (
    <section id="planos" className="section">
      <div className="shell">
        <Reveal className="card grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16 lg:p-14">
          <div>
            <p className="eyebrow">{plans.eyebrow}</p>
            <h2 className="mt-6 max-w-[16ch] text-h2 text-balance">{plans.title}</h2>
            <p className="mt-5 max-w-[48ch] text-lead text-muted">{plans.lead}</p>
          </div>

          <div className="flex flex-col justify-center gap-7">
            <ul className="flex flex-col gap-3.5">
              {plans.points.map((point) => (
                <li key={point} className="flex items-start gap-3">
                  <Check
                    size={17}
                    strokeWidth={2}
                    className="mt-0.5 shrink-0 text-ink"
                    aria-hidden="true"
                  />
                  <span className="text-muted">{point}</span>
                </li>
              ))}
            </ul>

            <Button href="#demo" arrow className="self-start">
              {plans.cta}
            </Button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
