"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { pricingFAQ } from "@/content/pricing";

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const ids = useId();

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section py-16">
      <div className="shell max-w-3xl">
        <Reveal>
          <SectionHeading
            eyebrow="Dúvidas"
            title="Perguntas frequentes."
            align="center"
          />

          <div className="mt-14 space-y-4">
            {pricingFAQ.map((faq, index) => {
              const isOpen = openIndex === index;
              const triggerId = `${ids}-faq-trigger-${index}`;
              const panelId = `${ids}-faq-panel-${index}`;

              return (
                <div
                  key={index}
                  className="card overflow-hidden transition-all duration-200"
                >
                  <button
                    id={triggerId}
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    className="flex w-full items-center justify-between p-6 text-left"
                  >
                    <span className="font-semibold text-ink">{faq.question}</span>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-muted transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                      aria-hidden="true"
                    />
                  </button>
                  <div
                    id={panelId}
                    role="region"
                    aria-labelledby={triggerId}
                    className={`grid transition-all duration-200 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-muted">{faq.answer}</p>
                    </div>
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
