import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { siteConfig } from "@/config/site";
import "./globals.css";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    /**
     * O <title> é o campo de maior peso da página, e "Lotti" sozinho não
     * carrega nenhum termo que alguém pesquise — ninguém busca a marca antes
     * de conhecê-la. Começa pelo nome, para quem já busca a Lotti, e emenda o
     * que o mercado procura. ~60 caracteres, o limite que o Google exibe.
     */
    default: `${siteConfig.name} - CRM Imobiliário com IA para Corretores e Imobiliárias`,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "CRM imobiliário",
    "software para imobiliária",
    "sistema para corretor de imóveis",
    "gestão de aluguéis",
    "contrato de locação com IA",
    "funil de vendas imobiliário",
    "captação de leads imobiliários",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} - ${siteConfig.tagline}`,
    description: siteConfig.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={sora.variable}>
      <body>{children}</body>
    </html>
  );
}
