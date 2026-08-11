import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { trust } from "@/content/landing";

export function Trust() {
  const marqueeItems = [...trust.items, ...trust.items]; // Duplica para preencher o loop

  return (
    <section className="section bg-surface overflow-hidden">
      <div className="shell">
        <SectionHeading eyebrow={trust.eyebrow} title={trust.title} />
      </div>

      <div className="relative mt-14 flex w-full flex-col items-center justify-center overflow-hidden">
        {/* Máscaras de gradiente laterais para o efeito fade-out */}
        <div className="absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-surface to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-surface to-transparent z-10" />

        <div className="flex w-full animate-marquee gap-8 pl-8">
          {marqueeItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="card flex w-[320px] shrink-0 flex-col p-6 transition-colors hover:border-ink/20 glass"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-line/30 mb-4">
                  <Icon
                    size={20}
                    strokeWidth={1.5}
                    className="text-ink"
                    aria-hidden="true"
                  />
                </div>
                <h3 className="text-h3 text-ink">{item.title}</h3>
                <p className="mt-2.5 text-small text-muted">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
