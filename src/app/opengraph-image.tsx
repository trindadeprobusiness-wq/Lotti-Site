import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";
import { hero } from "@/content/landing";

export const alt = `${siteConfig.name} - ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Versão invertida da marca, como manda o manual: símbolo e texto em branco
 * sobre preto, com o campo de lâminas do hero repetido em escala.
 */
export default async function OpengraphImage() {
  // Instâncias estáticas: o Satori não lida bem com a Sora variável.
  const [regular, bold] = await Promise.all([
    readFile(join(process.cwd(), "assets", "Sora-Regular.woff")),
    readFile(join(process.cwd(), "assets", "Sora-Bold.woff")),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#000000",
          color: "#ffffff",
          padding: 72,
          fontFamily: "Sora",
          position: "relative",
        }}
      >
        {/* Lâminas ascendentes, no ângulo do símbolo */}
        <svg
          width={1200}
          height={630}
          viewBox="0 0 1200 630"
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          <polygon points="760,630 830,630 1090,140 1020,140" fill="#ffffff" opacity="0.07" />
          <polygon points="880,630 950,630 1160,235 1090,235" fill="#ffffff" opacity="0.07" />
          <polygon points="1000,630 1070,630 1230,330 1160,330" fill="#ffffff" opacity="0.07" />
        </svg>

        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <svg width={48} height={38} viewBox="0 0 100 80" fill="#ffffff">
            <path d="M0 80 L14 80 L56.5 0 L42.5 0 Z" />
            <path d="M18 80 L32 80 L62.8 22 L48.8 22 Z" />
            <path d="M36 80 L50 80 L69.1 44 L55.1 44 Z" />
            <rect x="76" y="36" width="24" height="44" rx="12" />
          </svg>
          <span style={{ fontSize: 46, fontWeight: 400, letterSpacing: "-0.03em" }}>
            {siteConfig.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <span
            style={{
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.035em",
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {hero.headline[0]}
          </span>
          <span
            style={{
              fontSize: 82,
              fontWeight: 700,
              lineHeight: 1.06,
              letterSpacing: "-0.035em",
            }}
          >
            {hero.headline[1]}
          </span>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: 24,
            color: "rgba(255,255,255,0.6)",
          }}
        >
          <span>{siteConfig.tagline}</span>
          <span>{siteConfig.domain}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Sora", data: regular, style: "normal", weight: 400 },
        { name: "Sora", data: bold, style: "normal", weight: 700 },
      ],
    },
  );
}
