import Image from "next/image";
import {
  Building2,
  BarChart3,
  Home,
  Menu,
  Target,
  Users,
} from "lucide-react";
import { siteConfig } from "@/config/site";
import { LottiMark } from "@/components/brand/LottiMark";
import { ProductVideo } from "@/components/ui/ProductVideo";

type ProductShotProps = {
  /** Caminho dentro de public/product/, ex.: "/product/funil.png" */
  src: string;
  /** Vídeo de demonstração exibido dentro da mesma moldura do produto. */
  videoSrc?: string;
  /** Exibe este print real mesmo enquanto os outros quadros usam o placeholder. */
  showScreenshot?: boolean;
  /** Define se o print ocupa todo o quadro ou aparece por inteiro. */
  imageFit?: "cover" | "contain";
  alt: string;
  /** Proporção do print. Mantenha igual à do arquivo para não gerar CLS. */
  aspect?: string;
  /** Só no print do hero — ele é o LCP. */
  priority?: boolean;
  sizes?: string;
  className?: string;
};

/**
 * Moldura para os prints do produto.
 *
 * Enquanto siteConfig.useProductScreenshots for false, desenha a moldura de
 * "cabeçalho de sistema SaaS" do manual da marca — estrutura de interface,
 * sem inventar número de tela. Troque o flag depois de colocar os arquivos
 * em public/product/ e a mesma moldura passa a exibir o print real.
 */
export function ProductShot({
  src,
  videoSrc,
  showScreenshot = false,
  imageFit = "cover",
  alt,
  aspect = "16/10",
  priority = false,
  sizes = "(max-width: 1024px) 100vw, 60vw",
  className,
}: ProductShotProps) {
  return (
    <div
      className={[
        "relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: aspect.replace("/", " / ") }}
    >
      {videoSrc ? (
        <ProductVideo src={videoSrc} alt={alt} />
      ) : showScreenshot || siteConfig.useProductScreenshots ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={imageFit === "contain" ? "object-contain" : "object-cover object-top"}
        />
      ) : (
        // O quadro 16/10 é bem mais alto: ganha uma faixa de funil embaixo
        // para não ficar com um vazio no meio.
        <SaasFrame label={alt} dense={aspect === "16/10"} />
      )}
    </div>
  );
}

const modules = [
  { icon: Home, label: "Dashboard" },
  { icon: Target, label: "Oportunidades" },
  { icon: Users, label: "Clientes" },
  { icon: Building2, label: "Imóveis" },
  { icon: BarChart3, label: "Relatórios" },
] as const;

function SaasFrame({ label, dense = false }: { label: string; dense?: boolean }) {
  return (
    <div className="absolute inset-0 flex flex-col" aria-hidden="true">
      {/* Barra superior — cabeçalho de sistema SaaS do manual */}
      <div className="flex items-center gap-3 border-b border-line px-4 py-3">
        <Menu size={15} strokeWidth={2} className="text-muted" />
        <span className="flex items-center gap-1.5 text-ink">
          <LottiMark style={{ height: 13, width: "auto" }} />
          <span className="text-[13px] font-medium tracking-[-0.02em]">Lotti</span>
        </span>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Navegação lateral */}
        <div className="hidden w-[30%] max-w-[180px] shrink-0 flex-col gap-1 border-r border-line p-3 sm:flex">
          {modules.map(({ icon: Icon, label: item }, index) => (
            <span
              key={item}
              className={[
                "flex items-center gap-2 rounded-md px-2.5 py-2 text-[11px] font-medium",
                index === 0 ? "bg-surface text-ink" : "text-muted",
              ].join(" ")}
            >
              <Icon size={13} strokeWidth={2} />
              {item}
            </span>
          ))}
        </div>

        {/* Área de conteúdo — estrutura, sem dado inventado */}
        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
          <div className="h-2.5 w-24 rounded-full bg-line" />
          <div className="grid grid-cols-3 gap-2.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-2 rounded-lg border border-line p-2.5"
              >
                <div className="h-1.5 w-2/3 rounded-full bg-line" />
                <div className="h-3 w-1/2 rounded-full bg-surface" />
              </div>
            ))}
          </div>
          <div className="min-h-0 flex-1 rounded-lg border border-line p-3">
            <div className="mb-2.5 h-1.5 w-20 rounded-full bg-line" />
            <svg
              viewBox="0 0 240 70"
              preserveAspectRatio="none"
              className="h-[calc(100%-1.25rem)] w-full"
            >
              <polyline
                points="0,58 34,50 68,54 102,36 136,40 170,22 204,26 240,8"
                fill="none"
                stroke="#000000"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>

          {dense ? (
            <div className="grid min-h-0 flex-1 grid-cols-3 gap-2.5">
              {[3, 2, 2].map((cards, column) => (
                <div
                  key={column}
                  className="flex flex-col gap-2 rounded-lg bg-surface/70 p-2.5"
                >
                  <div className="h-1.5 w-1/2 rounded-full bg-line" />
                  {Array.from({ length: cards }).map((_, card) => (
                    <div
                      key={card}
                      className="rounded-md border border-line bg-paper p-2"
                    >
                      <div className="h-1.5 w-3/4 rounded-full bg-line" />
                      <div className="mt-1.5 h-1.5 w-1/3 rounded-full bg-surface" />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <span className="sr-only">{label}</span>
    </div>
  );
}
