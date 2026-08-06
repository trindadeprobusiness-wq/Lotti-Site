import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { trust } from "@/content/landing";

export function Trust() {
  return (
    <section className="section bg-surface">
      <div className="shell">
        <SectionHeading eyebrow={trust.eyebrow} title={trust.title} />

        <ul className="mt-14 grid gap-8 md:grid-cols-3">
          {trust.items.map((item, index) => {
            const Icon = item.icon;

            return (
              <Reveal
                as="li"
                key={item.title}
                delay={index * 70}
                className="border-t border-line pt-7"
              >
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className="text-ink"
                  aria-hidden="true"
                />
                <h3 className="mt-5 text-h3 text-ink">{item.title}</h3>
                <p className="mt-2.5 text-small text-muted">{item.description}</p>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
