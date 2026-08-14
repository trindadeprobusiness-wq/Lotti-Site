import { SectionHeading } from "@/components/ui/SectionHeading";
import { trust } from "@/content/landing";

const repetitionsPerCopy = 2;

export function Trust() {
  return (
    <section className="section overflow-hidden bg-surface">
      <div className="shell">
        <SectionHeading eyebrow={trust.eyebrow} title={trust.title} />
      </div>

      <div
        className="marquee-viewport relative mt-14 w-full overflow-hidden"
        aria-label="Compromissos de confiança e segurança"
      >
        <div className="animate-marquee flex gap-8">
          <MarqueeCopy copy="primary" />
          <MarqueeCopy copy="duplicate" ariaHidden />
        </div>
      </div>
    </section>
  );
}

function MarqueeCopy({
  copy,
  ariaHidden = false,
}: {
  copy: "primary" | "duplicate";
  ariaHidden?: boolean;
}) {
  return (
    <div
      data-marquee-copy={copy}
      className="flex shrink-0 gap-8"
      aria-hidden={ariaHidden || undefined}
    >
      {Array.from({ length: repetitionsPerCopy }, (_, repetition) =>
        trust.items.map((item) => {
          const Icon = item.icon;
          const isVisualClone = ariaHidden || repetition > 0;

          return (
            <article
              key={`${repetition}-${item.title}`}
              data-trust-card=""
              aria-hidden={isVisualClone || undefined}
              className="card glass flex w-[min(20rem,calc(100vw-3rem))] shrink-0 flex-col p-6 transition-colors hover:border-ink/20 sm:w-80"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-line/30">
                <Icon
                  size={20}
                  strokeWidth={1.5}
                  className="text-ink"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-h3 text-ink">{item.title}</h3>
              <p className="mt-2.5 text-small text-muted">{item.description}</p>
            </article>
          );
        }),
      )}
    </div>
  );
}
