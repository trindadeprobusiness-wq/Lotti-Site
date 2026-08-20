"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export const CAROUSEL_INTERVAL_MS = 3_500;

export const PRODUCT_SCREENSHOTS = [
  {
    src: "/product/tela-inicio.png",
    alt: "Tela inicial da Lotti",
  },
  {
    src: "/product/tela-clientes.png",
    alt: "Lista de clientes da Lotti",
  },
  {
    src: "/product/tela-imoveis.png",
    alt: "Lista de imóveis da Lotti",
  },
  {
    src: "/product/tela-funil.png",
    alt: "Funil de vendas da Lotti em quadro Kanban",
  },
  {
    src: "/product/tela-alugueis.png",
    alt: "Gestão de aluguéis da Lotti",
  },
  {
    src: "/product/tela-financeiro.png",
    alt: "Painel financeiro da Lotti",
  },
  {
    src: "/product/tela-juridico.png",
    alt: "Painel jurídico da Lotti",
  },
  {
    src: "/product/tela-midias.png",
    alt: "Biblioteca de mídias da Lotti",
  },
  {
    src: "/product/tela-fachadas.png",
    alt: "Fachadas Inteligentes da Lotti com QR Code",
  },
  {
    src: "/product/tela-assistente-ia.png",
    alt: "Assistente de IA da Lotti",
  },
] as const;

type ProductCarouselProps = {
  className?: string;
  sizes: string;
};

export function ProductCarousel({ className, sizes }: ProductCarouselProps) {
  const [screenIndex, setScreenIndex] = useState(0);
  const [previousScreenIndex, setPreviousScreenIndex] = useState<number | null>(null);
  const [currentLoaded, setCurrentLoaded] = useState(true);
  const screen = PRODUCT_SCREENSHOTS[screenIndex];
  const previousScreen = previousScreenIndex === null
    ? null
    : PRODUCT_SCREENSHOTS[previousScreenIndex];

  useEffect(() => {
    const interval = window.setInterval(() => {
      setScreenIndex((current) => {
        setPreviousScreenIndex(current);
        setCurrentLoaded(false);
        return (current + 1) % PRODUCT_SCREENSHOTS.length;
      });
    }, CAROUSEL_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    if (previousScreenIndex === null || !currentLoaded) return;

    const timeout = window.setTimeout(() => setPreviousScreenIndex(null), 500);
    return () => window.clearTimeout(timeout);
  }, [currentLoaded, previousScreenIndex]);

  return (
    <div
      className={[
        "relative overflow-hidden rounded-[var(--radius-card)] border border-line bg-paper",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ aspectRatio: "1919 / 867" }}
      data-product-carousel=""
      data-carousel-interval={CAROUSEL_INTERVAL_MS}
    >
      {previousScreen ? (
        <Image
          src={previousScreen.src}
          alt=""
          fill
          sizes={sizes}
          className="object-contain object-top transition-opacity duration-500"
        />
      ) : null}
      <Image
        key={screen.src}
        src={screen.src}
        alt={screen.alt}
        fill
        priority={screenIndex === 0}
        sizes={sizes}
        onLoad={() => setCurrentLoaded(true)}
        className={[
          "object-contain object-top transition-opacity duration-500",
          currentLoaded ? "opacity-100" : "opacity-0",
        ].join(" ")}
      />
    </div>
  );
}
